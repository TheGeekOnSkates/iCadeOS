var MemoryMap = {
	zp: 0,			// 0-255 ($00-$FF): Zero-page
	stack: 256,		// 256-511 ($0100-$01FF): Stack page
	screen: 512,		// 512-1535 ($0200-$05FF): Graphics (character set) RAM
				// 1536-2735 ($0600-$0AAF): Graphics (screen) RAM
				// 2736-3935 ($0AB0-$0F5F): Graphics (color) RAM
				// 3936-3983 ($0F60-$0F8F): Graphics (palette) RAM
				// 3984 ($0F90): Graphics (extra colors) byte
	tts: 3985,		// 3985-3993 ($0F91-$0F99): Text-to-speech settings
	sound: 3994,		// 3994-4025 ($0F9A-$0FB9): Sound RAM (placeholder)
	input: 5000,		// ????-???? ($????-$????): Input RAM (the iCade's controls)
	random: 6000,		// ???? Pseudo random number generator (placeholder)
	storage: 7000,		// 4018-???? ($0FB2-$????): Storage on the machine (localStorage)
	gameCode: 8000,	// ????-???? End-developers' game code starts here
};
window.onload = function() {
	js6502.init(MemoryMap.random);
	js6502.onReset = function() {
		sound.reset(js6502.ram);
		screen.reset(js6502.ram);
	};
	input.init(js6502.ram, MemoryMap.input);
	screen.init(js6502.ram, MemoryMap.screen, 240, 320);
	tts.init(js6502.ram, MemoryMap.tts);
	screen.canvas.canvas.onclick = disk.load;
	var soundOn = 0;
	disk.onLoad = function(data) {
		if (!soundOn) {
			sound.init(js6502.ram, MemoryMap.sound);
			soundOn = 1;
		}
		js6502.cpu.load(MemoryMap.gameCode, data);
	};
	
	// And start the main loop
	setInterval(function() {
		js6502.cpu.step();
		tts.step(js6502.ram);
		sound.step(js6502.ram);
	}, 10);
};
