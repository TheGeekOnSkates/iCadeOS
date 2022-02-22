var MemoryMap = {
	zp: 0,			// 0-255 ($00-$FF): Zero-page
	stack: 256,		// 256-511 ($0100-$01FF): Stack page
	screen: 512,		// 512-1535 ($0200-$05FF): Graphics (character set) RAM
				// 1536-2735 ($0600-$0AAF): Graphics (screen) RAM
				// 2736-3935 ($0AB0-$0F5F): Graphics (color) RAM
				// 3936-3983 ($0F60-$0F8F): Graphics (palette) RAM
				// 3984 ($0F90): Graphics (extra colors) byte
	tts: 3985,		// 3985-3992 ($0F91-$0F98): Text-to-speech settings
	sound: 3993,		// 3993-4024 ($0F99-$0FB8): Sound RAM (placeholder)
	timer: 4025,		// 4025-4028 ($0FB9-$0FBC): Timer
	input: 4029,		// 4029-4030 ($0FBD-$0FBE): Input RAM (the iCade's controls)
	storage: 4032,		// 4031-4039 ($0FBF-$0FC7): Storage on the machine (localStorage)
	random: 4040,		// 4040 ($0FC8): Pseudo random number generator (placeholder)
	modem: 4041,		// 4041-4048 ($0FC9-$0CFCF): End-developers' game code starts here
	error: 4048,		// 4048 ($0FD0): Last system error
				// 0 = No error
				// 1 = Invalid sound type (valid values are 0-6)
	gameCode: 4049,		// 4049-65535 ($0FD1-$FFFF): End-developers' game code starts here
};
window.onload = function() {
	js6502.init(MemoryMap.random);
	js6502.onReset = function() {
		sound.reset(js6502.ram);
		screen.reset(js6502.ram);
		timer.reset(js6502.ram);
	};
	sound.onError = function(code) {
		js6502.ram[MemoryMap.error] = code;
	}
	input.init(js6502.ram, MemoryMap.input);
	screen.init(js6502.ram, MemoryMap.screen, 240, 320);
	tts.init(js6502.ram, MemoryMap.tts);
	timer.init(js6502.ram, MemoryMap.timer);
	modem.init(js6502.ram, MemoryMap.modem);
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
		timer.step(js6502.ram, 10);
	}, 10);
};
