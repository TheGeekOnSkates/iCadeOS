/**
 * The input system will only need 2 bytes of RAM:
 * One for the joystick, and the other for the buttons.
 * Joystick will be a bitmask
 * 	UP = 1
 * 	DOWN = 2
 * 	LEFT = 4
 * 	RIGHT = 8
 * This way, if the player is holding the joystick up
 * and right at the same time, that byte will be 9 (so
 * programs can know that both are toggled on)
 * 
 * Now for the buttons I'm doing it a bit different from
 * the iCade manual; their buttons start at 5 and go to 7,
 * then 9, then Enter; then the next row is 6/8/0/Enter.
 * That's now how we read (we do left-to-right, THEN top-
 * to-bottom), and starting at 5 is not an option here.
 * This is another bitmask, with each bit being a button
 * 	BUTTON_1 = 1
 * 	BUTTON_2 = 2
 * 	BUTTON_3 = 4
 * 	BUTTON_4 = 8
 * 	BUTTON_5 = 16
 * 	BUTTON_6 = 32
 * 	BUTTON_7 = 64
 * 	BUTTON_8 = 128
 */
var input = {
	init: function(ram, start) {
		window.onkeydown = function(e) {
			switch(e.key) {
				// The actual iCade controls are all on keydown (this is the random letters like W, E, etc.)
				// I'm also setting it up to work with the arrow keys and numbers 1-8
				case 'w':	 // D-pad up pressed
				case 'ArrowUp':
					ram[start] |= 1; break;
				case 'e':	 // D-pad up released
					ram[start] &= ~1; break;
				case 'x':	 // D-pad down pressed
				case 'ArrowDown':
					ram[start] |= 2; break;
				case 'z':	 // D-pad down released
					ram[start] &= ~2; break;
				case 'a':	 // D-pad left pressed
				case 'ArrowLeft':
					ram[start] |= 4; break;
				case 'q':	 // D-pad left released
					ram[start] &= ~4; break;
				case 'd':	 // D-pad right pressed
				case 'ArrowRight':
					ram[start] |= 8; break;
				case 'c':	 // D-pad right released
					ram[start] &= ~8; break;
				case 'y':	 // Button 1 pressed
				case '1':
					ram[start + 1] |= 1; break;
				case 't':	 // Button 1 released
					ram[start + 1] &= ~1; break;
				case 'u':	 // Button 2 pressed
				case '2':
					ram[start + 1] |= 2; break;
				case 'f':	 // Button 2 released
					ram[start + 1] &= ~2; break;
				case 'i':	 // Button 3 pressed
				case '3':
					ram[start + 1] |= 4; break;
				case 'm':	 // Button 3 released
					ram[start + 1] &= ~4; break;
				case 'o':	 // Button 4 pressed
				case '4':
					ram[start + 1] |= 8; break;
				case 'g':	 // Button 4 released
					ram[start + 1] &= ~8; break;
				case 'h':	 // Button 5 pressed
				case '5':
					ram[start + 1] |= 16; break;
				case 'r':	 // Button 5 released
					ram[start + 1] &= ~16; break;
				case 'j':	 // Button 6 pressed
				case '6':
					ram[start + 1] |= 32; break;
				case 'n':	 // Button 6 released
					ram[start + 1] &= ~32; break;
				case 'k':	 // Button 7 pressed
				case '7':
					ram[start + 1] |= 64; break;
				case 'p':	 // Button 7 released
					ram[start + 1] &= ~64; break;
				case 'l':	 // Button 8 pressed
				case '8':
					ram[start + 1] |= 128; break;
				case 'v':	 // Button 8 released
					ram[start + 1] &= ~128;
			}
		};
		
		// Now for the arrow & number keys, I need to update the RAM on key up
		window.onkeyup = function(e) {
			switch(e.key) {
				case 'ArrowUp': ram[start] &= ~1; break;
				case 'ArrowDown': ram[start] &= ~2; break;
				case 'ArrowLeft': ram[start] &= ~4; break;
				case 'ArrowRight': ram[start] &= ~8; break;
				case '1': ram[start + 1] &= ~1; break;
				case '2': ram[start + 1] &= ~2; break;
				case '3': ram[start + 1] &= ~4; break;
				case '4': ram[start + 1] &= ~8; break;
				case '5': ram[start + 1] &= ~16; break;
				case '6': ram[start + 1] &= ~32; break;
				case '7': ram[start + 1] &= ~64; break;
				case '8': ram[start + 1] &= ~128;
			}
		};
	}
};
