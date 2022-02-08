/** Simple wrapper around AJAX, so the PhoneBoy can do multi-player on-line games */
var modem = {

	/**
	 * Initial setup
	 * @param {Uint8Array) The memory to be used to store data from the interwebz
	 * @param {number} Starting memory address for modem settings
	 * @remarks The modem uses 7 bytes + whatever size you want to store data
	 */
	init: function(ram, start) {
		modem.status = start;			// Gets/sets the modem status, obviously :)
		modem.responseCode = start + 1;		// Stores the HTTP response code (2 bytes)
		modem.bufferStart = start + 3;		// Start of buffer to store URLs and response data (2 bytes)
		modem.bufferEnd = start + 5;		// End address of data storage buffer
		modem.reset(ram);
	},
	
	/**
	 * Called on a loop, this drives the modem based on what's in memory
	 * @param {Uint8Array) The memory to be used to store data from the interwebz
	 */
	step: function(ram) {
		switch(ram[modem.status]) {
			case 0: break;		// Modem isn't doing anything
			case 1:			// Copy URL
				modem.url = "";
				var start = ram[modem.bufferStart] + (ram[modem.bufferStart + 1]) * 0x100,
					end = ram[modem.bufferEnd] + (ram[modem.bufferEnd + 1]) * 0x100;
				for (var i=start; i<=end; i++) {
					if (ram[i] == 0) break;
					modem.url += String.fromCharCode(ram[i]);
				}
				ram[modem.status] = 6;	// so it clears next time
				console.log('URL: ' + modem.url);
				break;
			case 2:			// Copy parameters
				modem.params = "";
				var start = ram[modem.bufferStart] + (ram[modem.bufferStart + 1]) * 0x100,
					end = ram[modem.bufferEnd] + (ram[modem.bufferEnd + 1]) * 0x100;
				for (var i=start; i<=end; i++) {
					if (ram[i] == 0) break;
					modem.params += String.fromCharCode(ram[i]);
				}
				ram[modem.status] = 6;	// so it clears next time
				//console.log('Params: ' + modem.params);
				break;
			case 3:			// Send XHR
				ram[modem.status] = 4;
				var x = new XMLHttpRequest();
				x.responseType = "arraybuffer"
				x.open('POST', modem.url, true);
				x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				x.onreadystatechange = function() {
					// If the request is not done, do nothing
					if (x.readyState != 4) return;
					
					// Update the response code bytes
					ram[modem.responseCode] = x.status % 100;
					ram[modem.responseCode + 1] = x.status - ((x.status % 100) * 100);
					
					// And store the response text in the rest of its memory
					var bytes = new Uint8Array(x.response);
					var start = ram[modem.bufferStart] + (ram[modem.bufferStart + 1]) * 0x100,
						end = ram[modem.bufferEnd] + (ram[modem.bufferEnd + 1]) * 0x100;
					for (var i=start; i<=end; i++) {
						ram[i] = bytes[i - modem.start];
					}
					
					// And let the system know the request is done
					ram[modem.status] = 5;
				};
				x.send(modem.params);
				modem.url = "";
				modem.params = "";
				break;
			// 4 = Waiting on response - nothing to do here
			// 5 = XHR completed - again, nothing to do
			case 6:			// Clear previous data
				var start = ram[modem.bufferStart] + (ram[modem.bufferStart + 1]) * 0x100,
					end = ram[modem.bufferEnd] + (ram[modem.bufferEnd + 1]) * 0x100;
				for (var i=start; i<=end; i++) {
					ram[i] = 0;
				}
				ram[modem.status] = 0;
		}
	},
	
	/**
	 * Sets all modem settings to zero
	 * @param {Uint8Array) The memory to be used to store data from the interwebz
	 */
	reset: function(ram) {
		for (var i=0; i<7; i++) ram[modem.status + i] = 0;
	}
};
