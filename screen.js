/**
 * The screen uses ___ bytes, and breaks down as follows:
 * 
 * 
 * 
 */
var screen = {
	
	/**
	 * Initial setup - creates a canvas and initializes its memory
	 * @param {Uint8Array} The emulated computer's memory (or chip's if separate from the CPU)
	 * @param {number} start Where graphics memory should start
	 * @param {number} w The screen width, in pixels
	 * @param {number} h The screen height, in pixels
	 */
	init: function(ram, start, w, h) {
		// Set up the canvas
		var c = document.createElement('canvas');
		c.width = w * 2; c.height = h * 2;
		document.body.appendChild(c);
		screen.canvas = c.getContext('2d');
		
		// Dimensions, in character cells
		screen.w = w / 8;
		screen.h = h / 8;
		
		// Define the memory variables we'll need later
		screen.charRAM = start;
		screen.screenRAM = start + 1024;
		screen.colorRAM = screen.screenRAM + (screen.w * screen.h);
		screen.paletteRAM = screen.colorRAM + (screen.w * screen.h);
		screen.color3 = screen.paletteRAM + 48;
		screen.color4 = screen.color3 + 1;
		screen.spriteRAM = screen.color4 + 1;
		
		// Set up the default character set
		screen.defaultCharSet = [
			// Numbers
			60,66,70,90,98,66,60,0,		// 0 ($00): 0
			8,24,40,8,8,8,62,0,		// 1 ($01): 1
			60,66,2,12,48,64,126,0,		// 2 ($02): 2
			60,66,2,28,2,66,60,0,		// 3 ($03): 3
			4,12,20,36,126,4,4,0,		// 4 ($04): 4
			126,64,120,4,2,68,56,0,		// 5 ($05): 5
			28,32,64,124,66,66,60,0,	// 6 ($06): 6
			126,66,4,8,16,16,16,0,		// 7 ($07): 7
			60,66,66,60,66,66,60,0,		// 8 ($08): 8
			60,66,66,62,2,4,56,0,		// 9 ($09): 9
			
			// Empty space
			0,0,0,0,0,0,0,0,		// 10 ($0A): space
			
			// Uppercase letters
			24,36,66,126,66,66,66,0,	// 11 ($0B): A
			124,34,34,60,34,34,124,0,	// 12 ($0C): B
			28,34,64,64,64,34,28,0,		// 13 ($0D): C
			120,36,34,34,34,36,120,0,	// 14 ($0E): D
			126,64,64,120,64,64,126,0,	// 15 ($0F): E
			126,64,64,120,64,64,64,0,	// 16 ($10): F
			28,34,64,78,66,34,28,0,		// 17 ($11): G
			66,66,66,126,66,66,66,0,	// 18 ($12): H
			28,8,8,8,8,8,28,0,		// 19 ($13): I
			14,4,4,4,4,68,56,0,		// 20 ($14): J
			66,68,72,112,72,68,66,0,	// 21 ($15): K
			64,64,64,64,64,64,126,0,	// 22 ($16): L
			66,102,90,90,66,66,66,0,	// 23 ($17): M
			66,98,82,74,70,66,66,0,		// 24 ($18): N
			24,36,66,66,66,36,24,0,		// 25 ($19): O
			124,66,66,124,64,64,64,0,	// 26 ($1A): P
			24,36,66,66,74,36,26,0,		// 27 ($1B): Q
			124,66,66,124,72,68,66,0,	// 28 ($1C): R
			60,66,64,60,2,66,60,0,		// 29 ($1D): S
			62,8,8,8,8,8,8,0,		// 30 ($1E): T
			66,66,66,66,66,66,60,0,		// 31 ($1F): U
			66,66,66,36,36,24,24,0,		// 32 ($20): V
			66,66,66,90,90,102,66,0,	// 33 ($21): W
			66,66,36,24,36,66,66,0,		// 34 ($22): X
			34,34,34,28,8,8,8,0,		// 35 ($23): Y
			126,2,4,24,32,64,126,0,		// 36 ($24): Z
			
			// Lowercase letters
			0,0,56,4,60,68,58,0,		// 37 ($25): a
			64,64,92,98,66,98,92,0,		// 38 ($26): b
			0,0,60,66,64,66,60,0,		// 39 ($27): c
			2,2,58,70,66,70,58,0,		// 40 ($28): d
			0,0,60,66,126,64,60,0,		// 41 ($29): e
			12,18,16,124,16,16,16,0,	// 42 ($2A): f
			0,0,58,70,70,58,2,60,		// 43 ($2B): g
			64,64,92,98,66,66,66,0,		// 44 ($2C): h
			8,0,24,8,8,8,28,0,		// 45 ($2D): i
			4,0,12,4,4,4,68,56,		// 46 ($2E): j
			64,64,68,72,80,104,68,0,	// 47 ($2F): k
			24,8,8,8,8,8,28,0,	// 48 ($30): l
			0,0,118,73,73,73,73,0,		// 49 ($31): m
			0,0,92,98,66,66,66,0,		// 50 ($32): n
			0,0,60,66,66,66,60,0,		// 51 ($33): o
			0,0,92,98,98,92,64,64,		// 52 ($34): p
			0,0,58,70,70,58,2,2,		// 53 ($35): q
			0,0,92,98,64,64,64,0,		// 54 ($36): r
			0,0,62,64,60,2,124,0,		// 55 ($37): s
			16,16,124,16,16,18,12,0,	// 56 ($38): t
			0,0,66,66,66,70,58,0,		// 57 ($39): u
			0,0,66,66,66,36,24,0,		// 58 ($3A): v
			0,0,65,73,73,73,54,0,		// 59 ($3B): w
			0,0,66,36,24,36,66,0,		// 60 ($3C): x
			0,0,66,66,70,58,2,60,		// 61 ($3D): y
			0,0,126,4,24,32,126,0,		// 62 ($3E): z
			
			// Drawing characters
			128,64,32,16,8,4,2,1,		// 63 ($3F): like a \
			1,2,4,8,16,32,64,128,		// 64 ($40): like a /
			129,66,36,24,24,36,66,129,	// 65 ($41): Like an X
			255,127,63,31,15,7,3,1,		// 66 ($42): triangle like \
			255,254,252,248,240,224,192,128,	// 67 ($43): triangle like /
			170,85,170,85,170,85,170,85,	// 68 ($44): like a checkerboard
			160,80,160,80,160,80,160,80,	// 69 ($45): half a checkerboard (vertical)
			0,0,0,0,170,85,170,85,		// 70 ($46): half a checkerboard (horizontal)
			255,128,128,128,128,128,128,128,	// 71 ($47): top left corner of square
			255,1,1,1,1,1,1,1,		// 72 ($48): top right corner of square
			128,128,128,128,128,128,128,255,	// 73 ($49): bottom left corner of square
			1,1,1,1,1,1,1,255,		// 74 ($4A): bottom right corner of square
			54,127,127,127,62,28,8,0,	// 75 ($4B): heart
			8,28,62,127,62,28,8,0,		// 76 ($4C): diamond
			8,28,42,119,42,8,8,0,		// 77 ($4D): club
			8,28,62,127,127,28,62,0,	// 78 ($4E): spade
			0,60,126,126,126,126,60,0,	// 79 ($4F): Ball
			24,24,24,24,24,24,24,24,	// 80 ($50): Vertical line thru center
			0,0,0,255,255,0,0,0,		// 81 ($51): Horizontal line thru center
			240,240,240,240,0,0,0,0,	// 82 ($52): top left corner filled
			15,15,15,15,0,0,0,0,		// 83 ($53): top right corner filled
			0,0,0,0,240,240,240,240,	// 84 ($54): bottom left corner filled
			0,0,0,0,15,15,15,15,		// 85 ($55): bottom right corner filled
			240,240,240,240,15,15,15,15,	// 86 ($56): top left/bottom right filled
			15,15,15,15,240,240,240,240,	// 87 ($57): top right/bottom left filled
			240,240,240,240,240,240,240,240,	// 88 ($58): left filled
			15,15,15,15,15,15,15,15,	// 89 ($59): right filled
			255,255,255,255,0,0,0,0,	// 90 ($5A): top filled
			0,0,0,0,255,255,255,255,	// 91 ($5B): bottom filled
			24,24,24,255,255,24,24,24,	// 92 ($5C): like a +
			255,255,24,24,24,24,24,24,	// 93 ($5D): like a T
			24,24,24,24,24,24,255,255,	// 94 ($5E): like an upside-down T
			192,192,192,255,255,192,192,192,	// 95 ($5F): like a T pointing left
			3,3,3,255,255,3,3,3,		// 96 ($60): Like a T pointing right
			102,51,153,204,102,51,153,204,	// 97 ($61): wavy lines like \
			102,204,153,51,102,204,153,51,	// 98 ($62): wavy lines like /
			204,102,51,153,204,102,51,153,	// 99 ($63): different wavy lines like \
			51,102,204,153,51,102,204,153,	// 100 ($64): different wavy lines like /
			0,0,0,0,0,0,0,255,		// 101 ($65): Like an _
			255,0,0,0,0,0,0,0,		// 102 ($66): Like an upside-down _
			0,0,0,0,0,0,255,255,		// 103 ($67): Like a thicker _
			255,255,0,0,0,0,0,0,		// 104 ($68): Like a thicker upside-down _
			128,128,128,128,128,128,128,128,	// 105 ($69): Like an | (far left)
			192,192,192,192,192,192,192,192,	// 106 ($6A): Like a thicker | (far left)
			1,1,1,1,1,1,1,1,		// 107 ($6B): Like an | (far right)
			3,3,3,3,3,3,3,3,		// 108 ($6C): Like a thicker | (far right)
			255,255,192,192,192,192,192,192,	// 109 ($6D): top left corner (thicker)
			255,255,3,3,3,3,3,3,		// 110 ($6E): top right corner (thicker)
			192,192,192,192,192,192,255,255,	// 111 ($6F): bottom left corner (thicker)
			3,3,3,3,3,3,255,255,	// 112 ($70): bottom right corner (thicker)
			0,0,0,31,31,24,24,24,	// 113 ($71): Smaller top left corner
			0,0,0,248,248,24,24,24,	// 114 ($72): Smaller top right corner
			24,24,24,31,31,0,0,0,	// 115 ($73): Smaller bottom left corner
			24,24,24,248,248,0,0,0,	// 116 ($74): Smaller bottom right corner
			0,0,0,255,255,24,24,24,	// 117 ($75): Like a smaller T
			24,24,24,255,255,0,0,0,	// 118 ($76): Like a smaller upside-down T
			24,24,24,248,248,24,24,24,	// 119 ($77): Smaller T pointing left
			24,24,24,31,31,24,24,24,	// 120 ($78): Smaller t pointing right
			
			// Punctuation
			8,30,40,28,10,60,8,0,	// 121 ($79): $
			0,0,8,0,0,8,0,0,	// 122 ($7A): colon
			4,8,16,0,0,0,0,0,	// 123 ($7B): apostrophe
			0,0,0,0,0,24,24,0,	// 124 ($7C): Period
			0,0,0,0,0,8,8,16,	// 125 ($7D): Comma
			60,66,2,12,16,0,16,0,	// 126 ($7E): Question mark
			8,8,8,8,0,0,8,0		// 127 ($7F): Exclamation point
		];
		
		// And call reset and step to complete the setup
		screen.reset(ram);
		screen.step(ram);
	},
	
	/**
	 * Sets up / resets the memory to its default values
	 * @param {Uint8Array} ram The memory that stores the screen data
	 */
	reset: function(ram) {
		// Set up character RAM
		for (var i=0; i<screen.defaultCharSet.length; i++) {
			ram[screen.charRAM + i] = screen.defaultCharSet[i];
		}
		
		// Set up the default values for the screen and color RAM
		for (var i=0; i<(screen.w * screen.h); i++) {
			// Color is black & white by default;
			ram[screen.colorRAM + i] = 1; // white on black
			
			// Screen is all empty space by default
			ram[screen.screenRAM + i] = 10;
		}
		
		// Set the default colors for the color palette
		var defaultColors = [
			0, 0, 0,	// black
			255, 255, 255,	// white
			255, 0, 0,	// red
			0, 255, 0,	// green
			0, 0, 255,	// blue
			255, 255, 0,	// yellow
			0, 255, 255,	// cyan (light blue-green)
			255, 0, 255,	// magenta (hot pink)
			64, 64, 64,	// gray
			127, 127, 127,	// silver
			127, 0, 0,	// dark red
			0, 127, 0,	// dark green
			0, 0, 127,	// dark blue
			127, 127, 0,	// gold
			0, 127, 127,	// teal (blue-green)
			127, 0, 127,	// purple
		];
		for (var i=0; i<48;i++) {
			ram[screen.paletteRAM + i] = defaultColors[i];
		}
	},
	
	/**
	 * Updates the screen based on what's in memory
	 * @param {Uint8Array} ram The memory
	 */
	step: function(ram) {
		// Draw every character on the screen
		for (var x=0; x<screen.w; x++) {
			for (var y=0; y<screen.h; y++) {
				screen.setChar(ram, x, y, ram[screen.screenRAM + (y * screen.w) + x], y * screen.w + x);
			}
		}
		
		// And continue the loop
		requestAnimationFrame(function() { screen.step(ram); });
	},

	/**
	 * Updates a character on the screen
	 * @param {Uint8Array} ram The screen card's RAM
	 * @param {number} x The horizontal ("X") coordinate of the character cell
	 * @param {number} y The vertical ("Y") coordinate of the character cell
	 * @param {number} n The location in ram where the character data is stored
	 * (the first of 8, since each character takes 8 bytes to set each "pixel")
	 * @param {number} C The location in ram where the color data is stored
	 */
	setChar: function(ram, x, y, n, C) {
		// If the highest bit of the character RAM is set,
		// Draw the character in multi-color mode
		if (n & 128) {
			screen.setCharMC(ram, x, y, n, C);
			return;
		}
		
		// Otherwise, do normal 2-color mode
		var c = ram[screen.colorRAM + C];
		screen.canvas.fillStyle = screen.getColor(ram, c >> 4);
		screen.canvas.fillRect(x * 16, y * 16, 16, 16);
		screen.canvas.fillStyle = screen.getColor(ram, c - ((c >> 4) * 0x10));

		// Go character-by-character, updating the entire screen
		for (var i=0; i<8; i++) {
			for (var j=0; j<8; j++) {
				if (ram[screen.charRAM + (n * 8) + i] & (1 << j)) {
					screen.canvas.fillRect(((x * 16) - (j * 2)) + 14, (y * 16) + (i * 2), 2, 2);
				}
			}
		}
	},
	
	// Same as setChar except for multi-color mode
	setCharMC: function(ram, x, y, n, C) {
		
		// We're in multi-color mode, so get the 4 colors
		// They're in the order:
		// 0=background, 1=foreground, 2=global 1, 3=global 2
		var c = ram[screen.colorRAM + C];
		var colors = [
			screen.getColor(ram, c >> 4),
			screen.getColor(ram, c - ((c >> 4) * 0x10)),
			screen.getColor(ram, ram[screen.color3]),
			screen.getColor(ram, ram[screen.color4]),
		];
		
		// Clear to the background color
		screen.canvas.fillStyle = colors[0];
		screen.canvas.fillRect(x * 16, y * 16, 16, 16);

		n &= ~128;	// We don't need that high-bit

		// Go character-by-character, updating the entire screen
		for (var i=0; i<8; i++) {
			for (var j=0; j<4; j++) {
				var color = colors[screen.get2bits(n, j + 1)];
				if (!color) continue;
				screen.canvas.fillStyle = color;
				screen.canvas.fillRect(((x * 16) - (j * 2)) + 14, (y * 16) + (i * 2), 2, 2);
			}
		}
	},
	
	/**
	 * Converts a color code into one of the 16 colors the system supports
	 * @param {number} c The color code (0-15)
	 * @returns {string} A name for use by canvas "fillStyle" calls
	 */
	getColor: function(ram, c) {
		var s = screen.paletteRAM + (c * 3);
		return 'rgb(' + ram[s] + ',' + ram[s + 1] + ',' + ram[s + 2] + ')';
	},
	
	/**
	 * Gets a 2-bit number from an 8-bit number
	 * @param {number} n The 8-bit number
	 * @param {number} h Which bit to get (1-4)
	 * @returns A number from 0 to 3
	 * @remarks This is for multi-color mode, which
	 * works similar to the C64 and NES.
	 * @example var test = 0b00110110;
	 * if b is 1, this returns 2 (10)
	 * if b is 2, this returns 1 (01)
	 * if b is 3, this returns 3 (11)
	 * if b is 4, this returns 0 (00)
	 */
	get2bits: function(n, b) {
		switch(b) {
			case 1: n &= 3; break;
			case 2: n &= 12; break;
			case 3: n &= 48; break;
			case 4: n &= 192;
		}
		for (var i=1; i<b; i++) n = n >> 2;
		return n;
	}
};
