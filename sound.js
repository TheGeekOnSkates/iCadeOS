/** Sound card */
var sound = {
	
	/**
	 * I have long since forgotten where I got these,
	 * but from what I read these are sound frequencies
	 * thatcorrespond to musical notes
	 */
	notes: [
		16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87,
		32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74,
		65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47,
		130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94,
		261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88,
		523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77,
		1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760, 1864.66, 1975.53,
		2093, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520, 3729.31, 3951.07,
		4186.01, 4434.92, 4698.63, 4978.03, 5274.04, 5587.65, 5919.91, 6271.93, 6644.88, 7040, 7458.62, 7902.13
	],
	osc: [],	/* stores 8 "OscillatorrNode" objects */
	vol: [],	/* stores 8 "GainNode" objects */
	pan: [],	/* stores 8 "PannerNode" objects */
	
	/**
	 * Initial setup
	 * @param {Uint8Array} ram The memoey used to store sound settings
	 * @param {number} The first memory address for sound settings
	 * @remarks The sound card requires 32 bytes of memory to work.
	 */
	init: function(ram, start) {
		// Create the synth, volume and pan components
		// TO-DO: If I can ever figure out 8-bit noise, add noise generators
		sound.start = start;
		sound.audio = new (AudioContext || window.webkitaudioContext)();
		for (let i=0; i<8; i++) {
			sound.osc[i] = sound.audio.createOscillator();
			sound.vol[i] = sound.audio.createGain();
			sound.pan[i] = sound.audio.createStereoPanner();

			// "Wire them up" (except for noise, for now)
			sound.osc[i].connect(sound.vol[i]);
			sound.vol[i].connect(sound.pan[i]);
			sound.pan[i].connect(sound.audio.destination);
		}
		
		// Set up the RAM so all sounds are off
		sound.reset(ram);
		sound.step(ram);
		
		// And start the synths!
		for (let i=0; i<8; i++) sound.osc[i].start();
	},
	
	/**
	 * Called on a loop, this updates the sound based on settings in memory
	 * @param {Uint8Array} ram The memoey used to store sound settings
	 */
	step: function(ram) {
		if (sound.osc.length < 8) sound.init(ram, sound.start);
		for (let i=0; i<8; i++) {
			// Set the wave form
			// NOTE: Yes I'm aware we're only using 2 bits here;
			// Yes I'm aware I could conserve memory by using the other 6 for something else.
			// If you want to build a better "sound card", have at it. :)
			// Okay seriously tho, 32 bytes for controlling sound on a machine with 64K is not that bad.
			// And this "sound card" is already way more powerful than what most 8-bit computers were capable of (except for i.e. the C64's SID chip lol).
			switch(ram[sound.start + (i * 4)]) {
				case 0: sound.osc[i].type = "square"; break;
				case 1: sound.osc[i].type = "triangle"; break;
				case 2: sound.osc[i].type = "sawtooth"; break;
				case 3: sound.osc[i].type = "sine"; break;
			}
			
			// Set the volume
			sound.vol[i].gain.value = ram[sound.start + (i * 4) + 1] / 500;
			
			// Set the note
			var b = ram[sound.start + (i * 4) + 2];
			if (b < 0) b = 0;
			if (b >= sound.notes.length) b = sound.notes.length - 1;
			sound.osc[i].frequency.value = sound.notes[b];
			
			// Set the pan
			b = ram[sound.start + (i * 4) + 3];
			var pos = b & 127;
			if (pos > 100) pos = 100;
			if (b & 128) pos *= -1;
			sound.pan[i].pan.value = pos / 100;
		}
	},
	
	/**
	 * Resets all sound settings to zero
	 * @param {Uint8Array} ram The memoey used to store sound settings
	 */
	reset: function(ram) {
		for (let i=sound.start; i<sound.start+32; i++) {
			ram[sound.start + i] = 0;
		}
	}
};
