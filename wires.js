var MemoryMap = {
	zp: 0,			// 0-255 ($00-$FF): Zero-page
	stack: 256,		// 256-511 ($0100-$01FF): Stack page
	screen: 512,		// 512-????: Screen RAM (placeholder - charset will probably go first)
	color: 1024,		// ????-???? Color RAM (placeholder)
	sprites: 1024,		// ????-???? Sprites RAM (placeholder)
	charset: 1024,		// ????-???? Character setRAM (placeholder)
	sound: 1024,		// ????-???? Sound RAM (placeholder)
	input: 1024,		// ????-???? Input RAM and event handlers
	storage: 1024,		// ????-???? Storage onthe machine (localStorage)
	random: 1024,		// ???? Pseudo random number generator (placeholder)
	tts: 1024,		// ????-???? Text-to-speech settings
	gameCode: 1024,		// ????-???? End-developers' game code starts here
};
window.onload = function() {
	js6502.init(MemoryMap.random);
	input.init(js6502.ram);
	screen.init(js6502.ram, MemoryMap.screen);
	tts.init(js6502.ram, MemoryMap.tts);
	screen.canvas.canvas.onclick = disk.load;
	var soundOn = 0;
	disk.onload = function(data) {
		if (!soundOn) {
			sound.init(js6502.ram);
			soundOn = 1;
		}
		screen.reset();
		sound.reset();
		for (var i=0; i<data.length; i++) js6502.ram[MemoryMap.gameCode + i] = data[i];
		js6502.cpu.run(MemoryMap.gameCode);
	};
	setInterval(function() {
		
	}, 10);
};
