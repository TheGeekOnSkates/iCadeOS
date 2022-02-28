/**
 * Wraps the HTML5 localStorage API, giving programmers a way to
 * save stuff like high scores, game state, etc. without having to
 * run a web server and use modem.js
 */
var storage = {

	/**
	 * Initial setup
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 * @param {number} start The starting address where settings should go
	 * @remarks Uses 3 bytes: 2 for a buffer pointing to where data should
	 * go, and one to tell the JS code what to do (a status byte, like the
	 * TTS engine and other components have).
	 */
	init: function(ram, start) {
		storage.bufferStart = start;
		storage.status = start + 2;
		storage.reset(ram);
	},

	/**
	 * Resets everything to its default values
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 */
	reset: function(ram) {
		ram[storage.bufferStart] = 0;
		ram[storage.bufferStart + 1] = 0;
		ram[storage.status] = 0;
		storage.key = "";
	},

	/**
	 * Called in the main loop - does stuff based on what the programmer tells it to
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 */
	step: function(ram) {
		// Storage status values:
		//	STORAGE_READY = 0 /* The storage system is not doing anything, ready for instructions */
		//	STORAGE_SET_KEY = 1 /* Set the key (call this before setting it to the next two) */
		//	STORAGE_GET_VALUE = 2 /* Get the value (first do STORAGE_SET_KEY so it knows which item we want */
		//	STORAGE_SET_VALUE = 3 /* Set the value (again, first it's important to say which key) */
		//	STORAGE_DELETE_VALUE = 4 /* Delete a value (again, set the key first) */
		//	STORAGE_BUSY = 5 /* The storage system is busy - programs should not do anything */
		switch(ram[storage.status]) {
			case 0: case 5: return;
			case 1:
				// TO-DO: Set the key
				break
			case 2:
				// TO-DO: Get the value of key
				break
			case 3:
				// TO-DO: Get the value
				break
			case 1:
				// TO-DO: Set the value
				break
		}
	},

	/**
	 * 
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 */
	load: function(ram) {
		
	},

	/**
	 * 
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 */
	save: function(ram) {
		
	},
};
