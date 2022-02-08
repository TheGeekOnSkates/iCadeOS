/**
 * A simple timer using 4 bytes.  It stores the following info:
 * "Split-seconds" (0.1 seconds), seconds, minutes, and hours
 */
var timer = {
	
	/**
	 * Sets up the timer
	 * @param {Uint8Array} The data to be used as its RAM
	 * @param {number} start Where to put the timer in RAM.
	 */
	init: function(ram, start) {
		// Set memory addresses and other stuff
		timer.split = start + 3;	// "split-seconds", 0.01 seconds, or 100 milliseconds
		timer.seconds = start + 2;	// seconds (0-60)
		timer.minutes = start + 1;	// minutes (0-60)
		timer.hours = start;		// hours (0-255 - lol the idea of someone running this thing for 255 hours :D)
		timer.counter = 0;		// Split-second counter
		timer.reset(ram);		// Start out with all as zeroes
	},
	
	/**
	 * Updates the timer
	 * @param {Uint8Array} The data to be used as its RAM
	 * @param {number} add How many milliseconds to add
	 */
	step: function(ram, add) {
		// If < 1 split-second, do nothing
		timer.counter += add;
		if (timer.counter < 100) return;
		
		// If >= 1 split-second, update split-seconds
		timer.counter -= 100;
		ram[timer.split]++;
		
		// Update the "seconds" if we've reached 100 split-seconds
		if (ram[timer.split] < 10) return;
		ram[timer.split] = 0;
		ram[timer.seconds]++;
		
		// Update the minutes if we've reached 60 seconds
		if (ram[timer.seconds] < 60) return;
		ram[timer.seconds] = 0;
		ram[timer.minutes]++;
		
		// Update the hours if we've reached 60 minutes
		if (ram[timer.minutes] < 60) return;
		ram[timer.minutes] = 0;
		ram[timer.hours]++;
	},
	
	/**
	 * Sets the timer's memory to zero
	 * @param {Uint8Array} The data to be used as its RAM
	 */
	reset: function(ram) {
		for (i=0; i<4; i++) {
			ram[timer.hours + i] = 0;
		}
	}
};
