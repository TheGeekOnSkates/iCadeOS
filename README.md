# iCadeOS

## Overview

The "Ion iCade" was a really cool idea that sadly never caught on.  It's a tabletop arcade cabinet that's just a Bluetooth keyboard under the hood.  A lot of people have reviewed it [on YouTube](https://www.youtube.com/watch?v=DliJ2-sRYyM), and those reviews kind of say it all.  At the time of this first commit, the iCade could still be found [on Amazon](https://www.amazon.com/ION-iCade-Arcade-Bluetooth-Cabinet/dp/B004YC4NH6/ref=sr_1_1?keywords=ion+icade&qid=1643946976&sr=8-1), though rare.  They're more common [on eBay](https://www.ebay.com/itm/334288997982?hash=item4dd52d4e5e:g:xH4AAOSw975h3x5Z), and I even saw one at a flea market once.  It seems there were way more units sold than there were games developed for it, and that was ultimately its downfall.

But here's the thing (and I wish the company that made these realized this): it's not limited to just iPads!  I've successfully paired my iCade to my Android tablet, and considering there are so many of them out there, I think it would be worthwhile if those of us who code would actually build some game for it.

## Version 1.0 design goals

* It should run in a web browser; I considered actually learning native Android app development and using this project as an excuse to do that, but then I'd be cutting out all the people who actually bought the iCade to use with an iPad.  And since I neither own a Mac nor have any intention of saving for one, it's gonna be a web thing.  That also means it'll run on a Raspberry Pi or anything else with Bluetooth support (which is awesome, cuz the Raspberry Pi is often used to build arcade cabinets that don't use Bluetooth, which supposedly has lower lag and all that).
* It should be simple.  If it's going to run in a browser, all that extra browser stuff is going to waste resources.  So the games I envision this running are things like Donkey Kong, Pac-Man, Frogger, Space Invaders, etc.  Not Street Fighter, Ninja Turtles 2 "The Arcade Game", or anything more recent than that.  If web browsers get fast enough and light enough to easily do those things on a low-resource machine, then it'll be time to talk 2.0
* I'd like it to actually run actual 8-bit machine code.  This is for a lot of reasons, which I don't want to bore you with, but might list out at some point.

## Version 1.0 road map

### Level 1: Build the machine

At the code level, each script emulates a different thing that would actually exist on a real arcade machine.  So the components I'll have to build (or import from other projects) are:

* **The screen:** I think I'll go with a 3:4 aspect ratio, since that should work on most tablets.  Probably only 16 colors, but I'd like it to have both a Commodore-style character set (which can be changed to create graphics) and sprites.  I'm not super-familiar with sprites, but I figure this gives me a chance to learn them (on the NES and C64) and see if there's a strategy there that works on the iCade.
* **The sound chips:** In previous 8-bit projects I've built, I've had 4 to 8 independently programmable sound "voices" (and also text-to-speech); I plan to include at least those features in iCadeOS.  But ideally, I'd like to learn how ADSR works (on the C64) and see if I can add that functionality.  I've seen JS libraries that can do that, so if it's not a resource-hog it would sure make the sound a lot better.  And **MAYBE** even samples - but again, not likely (lol)
* **A way to load ROMs:** Unlike other 80s game systems, arcade cabinets didn't have cartridges or floppy drives - at least, none that us kids could see.  Here's where iCadeOS is different.  Because it's open-source - and because developers will want to actually test their code - I need a way to load games.  I have a few ideas on this, some I've used before, others I've seen on other web emulators.

-----------------------------------------------------------------------------------------------

#### Level 1 to-do's:

##### "World 1-2": Sound and speech

* Learn ADSR and/or 8-bit noise and see if I can get those things working
* **BOSS BATTLE:** Build an Assembly program that uses sound and speech - ideally both music AND sound effects.


##### "World 1-3": Network and local storage

* Set up my localStorage wrapper
* If I haven't already used up too much RAM, re-add my old "modem.js" from another project (I've been on the fence about it, but I kinda like the idea for people who want to store their high scores online)
* Idea: auto-run from URL (like the Commodore PET emulator)?  Might be really hard, but might be totally awesome and totally worth it. :)
* **BOSS BATTLE:** Write an Assembly program that uses the localStorage and modem.js if I use it.

Like the other boss battles, it passes if it works on the actual iCade.


##### "World 1-4": Misc. and Polish

* Create a timer (I think I have an old script for that too)
* Create a logo for the icon - I've been calling it iCadeOS, but it wasn't actually sponsored by the company behind the iCade (if they're even still around).  So probably just a generic arcade icon, but with a tablet icon inside that (lol).  Once the icon is done, update the HEAD tag and all that.
* Create a nicer background on startup; maybe code a program that puts some instructions on there or something
* Research which license to use - I really want UNLICENSE, but the 6502 piece was created under something else
* Test the canvas with screen readers and make sure it's accessible - this system could be used to create audio games (and in fact some of the code it's running was originally built for that) so I want to make sure people who want to can do that.
* Minify the HTML, JS, and CSS
* **MINI-BOSS:** Write an Assembly program that uses the timer
* **MINI-BOSS:** Finalize my memory map in wires.js, add comments to all JS code I haven't yet, and update the code to include whatever comments the license requires

##### Bonus round

* Try to compile a C program or two using cc65; maybe convert my program from 1-1 into C and do a speed comparison

I had many other ideas (interrupts, a way to set the start address in the compiled ROM, a kernel with routines for things like muting all sound and clearing the screen, and others I've already forgotten) but that's an awful lot of feature-creep for a 1.0 :)

##### Future 1.x releases

I don't actually plan to do as much JS once I've completed level 1.  Bug fixes are one thing, but no more features.  If someone else wants to 1-up what I did, they can do that.  My code is open-source.


#### Thoughts/research on sprites

ON THE NES, there were:

* 2 bits per pixel = avoid weird double-width pixels the VIC-20 and C64 had (but it also means 16 bytes for one 8x8 sprite)
* Sprite 4 bytes for foreground sprite instances
	x coordinate
	y coordinate
	which tiles
	and a 4th byte for settings:
		flip horizontal
		flip vertical
		and others the guy didn't say but I found on https://wiki.nesdev.org/w/index.php/PPU_OAM#Byte_3
* The NES also has color palettes stored in memory, an interesting thought
* Could handle up to 64 sprite instances

I kind of like this a bit more than how the C64 did it.  Thing is tho, the Nintendo's "PPU" (an acronym that's a cheesy joke waiting to happen :D) had separate foreground and background character RAM.  I don't know if I want to waste another half-a-KB on sprites - at lesat, not unledd the developer does.

Random thoughts to consider:
* How are X and Y only 8 bits?  240 fits in 8 bits but not 320
* On the JS side, sprites and background chars might overwrite each other in each frame, creating a weird blinking/flickering effect.  I have an idea on how to fix this if I run into it: create a second, transparent, canvas, to go over the top one; it would have its own requestAnimationFrame loop and all that... not sure if I want to go there tho.
* Also, I had thought about using a pointer for the sprite, a 1-byte number like the character set; the charset only goes from 0-127... wait, what if setting the last bit (the 128) turned on a kind of multi-character mode like the VIC?  idk, still thinking, too tired to care. :D

So based on that...
	16 bytes for the sprite's pixels (2-bit numbers like the NES)
		* 8 sprites = 128 bytes
	I think one color palette is more than enough; 3 bytes per color
		* 16 colors = 48 bytes
	Now for sprite instances: for each instance, use 4 bytes (like the NES)
			- 1 byte for x-coordinate
			- 2 bytes for y-coordinate
			- 1 byte for settings:
				bits 0-2 (numbers 0-7): which sprite
				bit 3: flip horizontal
				bit 4: flip vertical
				bit 5: double-width on/off
				bit 6: double-height on/off
				bit 7: Rotate
		* 64 sprites = 256 bytes
	The total in this setup is 128 + 48 + 256 = 432 ($01B0) bytes
	Not exactly the nice round number I was shooting for, but it works!
	The question is, will it slow the page to a crawl? :D

On the other hand, the C64's sprites had collision registers (which would be helpful)...  I think I'm starting to over think it tho :)











--------------------------------------------------------------------------

### Level 2: Build games

I would love iCadeOS to have clones of games like:

* Air Hockey (Pong clone); I'll probably start here
* Space Invaders (harder than Pong but still no crazy physics or anything)
* Snake (I saw a version in BASIC that I think would do well here, if I can concert it to Assembly)
* Breakout (the math is kinda tricky without floats; maybe this one will be in C)
* Pac-Man
* Frogger
* Tetris
* Maybe others?

In addition to being fun to build and (hopefully) fun to play, this will give me a power-up for the last level: a nice library of Assembly and C code that other developers can use to build their games.

### Level 3: Write developer docs

There's not much about open-source software I dislike, but one thing I wish we open-source fans did better was write manuals.  Some projects do an excellent job, don't get me wrong, but others... not so much.  As a programmer, nothing drives me crazier when a library only has encyclopedia-style reference material.  No tutorials, not quick starts, no examples, just a list of functions/objects/whatever.  If I make it to Level 3 - if I don't get a "Game Over" (burnout) - then I just gotta write great docs.  Ultimately, I'd really like for other programmers to learn to code for this system - they can't do that without docs.

# Here goes nuttin'! :)
