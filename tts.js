var tts = {
	rate: 50,
	pitch: 50,
	volume: 100,
	say: function(data) {
		// If TTS is off, do nothing
		if (tts.volume == 0) return;
		
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
		console.log(s);
		speechSynthesis.speak(s);
	},
	stop: function() {
		speechSynthesis.cancel();
	}
};
