var input = {
	init: function(ram) {
		// The input system will only need 2 bytes of RAM:
		// One for the joystick, and the other for the buttons.
		// Joystick will be a bitmask
		//		UP = 1
		//		DOWN = 2
		//		LEFT = 4
		//		RIGHT = 8
		// This way, if the player is holding the joystick up
		// and right at the same time, that byte will be 9 (so
		// programs can know that both are toggled on)
		//
		// Now for the buttons I'm doing it a bit different from
		// the iCade manual; their buttons start at 5 and go to 7,
		// then 9, then Enter; then the next row is 6/8/0/Enter.
		// That's now how we read (we do left-to-right, THEN top-
		// to-bottom), and starting at 5 is not an option here.
		// This is another bitmask, with each bit being a button
		//		BUTTON_1 = 1
		//		BUTTON_2 = 2
		//		BUTTON_3 = 4
		//		BUTTON_4 = 8
		//		BUTTON_5 = 16
		//		BUTTON_6 = 32
		//		BUTTON_7 = 64
		//		BUTTON_8 = 128*
		// Note that BUTTON_4 and BUTTON_8 may not exist; I think
		// (though I need to test this) that the iCade's "Enter"
		// buttons are the same (that there are 2 of them, 1 on
		// each row).  In that case, I will rearrange my enum above
	},
};
