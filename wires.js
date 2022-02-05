var MemoryMap = {
	zp: 0,			// 0-255 ($00-$FF): Zero-page
	stack: 256,		// 256-511 ($0100-$01FF): Stack page
	screen: 512,		// 512-1535 ($0200-$05FF): Graphics (character set) RAM
				// 1536-2735 ($0600-$0AAF): Graphics (screen) RAM
				// 2736-3935 ($0AB0-$0F5F): Graphics (color) RAM
				// 3936-4095 ($0F60-$0FFF): Graphics (sprite) RAM
				// Place holder - this gives me 160 bytes for sprites; now, to see if that's reasonable :)
	sound: 0x8000,		// ????-???? Sound RAM (placeholder)
	input: 0xA000,		// ????-???? (2 bytes) Input RAM and event handlers
	storage: 0xA002,	// ????-???? Storage onthe machine (localStorage)
	random: 0xC000,		// ???? Pseudo random number generator (placeholder)
	tts: 0xD000,		// ????-???? Text-to-speech settings
	gameCode: 0xD100,	// ????-???? End-developers' game code starts here
};
window.onload = function() {
	js6502.init(MemoryMap.random);
	js6502.onReset = function() {
		//sound.reset(js6502.ram);
		screen.reset(js6502.ram);
	};
	input.init(js6502.ram, MemoryMap.input);
	screen.init(js6502.ram, MemoryMap.screen, 240, 320);
	tts.init(js6502.ram, MemoryMap.tts);
	screen.canvas.canvas.onclick = disk.load;
	var soundOn = 0;
	disk.onLoad = function(data) {
		if (!soundOn) {
			//sound.init(js6502.ram);
			soundOn = 1;
		}
		js6502.cpu.load(MemoryMap.gameCode, data);
	};
	
	// And start the main loop
	setInterval(function() {
		js6502.cpu.step();
	}, 10);
};
