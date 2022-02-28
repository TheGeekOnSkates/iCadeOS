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
				// Set the key
				try {
					ram[storage.status] = 5;
					storage.key = storage._getBuffer(ram);
					ram[storage.status] = 0;
				}
				catch(e) { storage.onError(2); }
				break
			case 2:
				// Get the value of storage.key
				if (storage.key == "") {
					storage.onError(3);
					return;
				}
				try {
					ram[storage.status] = 5;
					var address = ram[storage.bufferStart + 1] * 0x100 + ram[storage.bufferStart],
						data = localStorage.getItem(storage.key);
					if (!data) {	// null or empty
						ram[address] = 0; return;
					}
					for (var i=address; i<address + data.length; i++) {
						ram[i] = data.charCodeAt(i);
					}
					ram[storage.status] = 0;
				}
				catch(e) { storage.onError(2); }
				break
			case 3:
				// Set the value of storage.key
				if (storage.key == "") {
					storage.onError(3);
					return;
				}
				try {
					ram[storage.status] = 5;
					localStorage.setItem(storage.key, storage._getBuffer(ram));
					ram[storage.status] = 0;
				}
				catch(e) { storage.onError(2); }
				break
			case 4:
				// TO-DO: Remove the item named storage.key
				if (storage.key == "") {
					storage.onError(3);
					return;
				}
				try {
					ram[storage.status] = 5;
					localStorage.removeItem(storage.key);
					ram[storage.status] = 0;
				}
				catch(e) { storage.onError(2); }
				break
		}
	},

	/**
	 * Reads the contents of the buffer until it finds a zero or hits the end of RAM
	 * @param {Uint8Array} ram The memory object used in reading/writing
	 */
	_getBuffer: function(ram) {
		var str = "", address = ram[storage.bufferStart + 1] * 0x100 + ram[storage.bufferStart];
		for (var i=address; i<65536; i++) {
			if (ram[i] == 0) break;
			str += String.fromCharCode(ram[i]);
		}
		return str;
	},

	/** wires.js should override this */
	onError: function(code) {},
};
