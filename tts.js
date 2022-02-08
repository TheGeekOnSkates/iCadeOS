/* Text-to-speech synthesizer powered by the Web Speech API */
var tts = {
	
	/**
	 * Initial setup
	 * @param {Uint8Array} ram The memory to be used to store TTS settings
	 * @param {number} start The memory address where the settings should go
	 * @remarks The TTS engine requires 8 bytes + whatever buffer size you give it to speak stuff
	 */
	init: function(ram, start) {
		tts.rateControl = start;
		tts.pitchControl = start + 1;
		tts.volumeControl = start + 2;
		tts.status = start + 3;
		tts.bufferStart = start + 4;	// 16-bit pointer, 2 bytes
		tts.bufferEnd = start + 6;	// same, total 8 bytes
		tts.reset(ram);
	},
	
	/**
	 * Called on a loop to update settings and run speech when the program says to do so
	 * @param {Uint8Array} ram The memory to be used to store TTS settings
	 */
	step: function(ram) {
		// Update the settings
		// If TTS is off, do nothing
		tts.volume = ram[tts.volumeControl];
		if (tts.volume == 0) return;
		tts.rate = ram[tts.rateControl];
		tts.pitch = ram[tts.pitchControl];
		
		// If the status byte is not set to "start speaking", we're done.
		// Status byte settings are:
		//	TTS_NOT_SPEAKING		0	/* Not speaking */
		//	TTS_START_SPEAKING		1	/* Tell the system to start talking immediately, canceling any speech that may already be going on */
		//	TTS_SPEECH_IN_PROGRESS		2	/* Speech is currently in progress */
		if (ram[tts.status] != 1) return;
		
		// Otherwise, we want to start talking; first, update the status byte to "speech in progress"
		var start = tts._buf(ram[tts.bufferStart], ram[tts.bufferStart + 1]),
			end = tts._buf(ram[tts.bufferEnd], ram[tts.bufferEnd + 1]);
		
		// Get the memory between addresses A and B
		var str = [];
		for (var i=start; i<=end; i++) {
			if (!ram[i]) break;
			str.push(ram[i]);
			ram[i] = 0;
		}
		
		// And do the actual speaking :)
		tts.say(ram, str);
	},
	
	/**
	 * Resets all settings to the default values
	 * @param {Uint8Array} ram The memory to be used to store TTS settings
	 */
	reset: function(ram) {
		ram[tts.rateControl] = 50;
		ram[tts.pitchControl] = 50;
		ram[tts.volumeControl] = 100;
		ram[tts.status] = 0;
	},
	
	/**
	 * Speaks the text in the speech buffer
	 * @param {Uint8Array} ram The memory to be used to store TTS settings
	 * @param {Array<number>} The text to speak (copied from memory)
	 */
	say: function(ram, data) {
		
		// Stop any speech in progress
		speechSynthesis.cancel();
		
		// Convert the raw data into a string; if blank, do nothing
		var str = "";
		for (var i=0; i<data.length; i++) str += String.fromCharCode(data[i]);
		if (str == "") return;
		
		// Speak the string
		var s = new SpeechSynthesisUtterance(str);
		s.volume = tts.volume / 100;
		s.rate = (2 * tts.rate) / 100;
		s.pitch = tts.pitch / 100;
		ram[tts.status] = 2;
		s.end = function() {
			ram[tts.status] = 0;
		};
		speechSynthesis.speak(s);
	},
	
	/**
	 * Converts two 8-bit numbers into a 16-bit number (memory address)
	 * @param {number} lo The low byte of a the address
	 * @param {number} hi The high byte of a the address
	 * @returns {number} The memory address
	 * @example if you pass lo = 0x34, hi = 0x12, you get 0x1234
	 */
	_buf: function(lo, hi) {
		return hi * 0x100 + lo;
	},
};
