# iCadeOS

## Overview

The "Ion iCade" was a really cool idea that sadly never caught on.  It's a tabletop arcade cabinet that's just a Bluetooth keyboard under the hood.  A lot of people have reviewed it [on YouTube](https://www.youtube.com/watch?v=DliJ2-sRYyM), and those reviews kind of say it all.  At the time of this first commit, the iCade could still be found [on Amazon](https://www.amazon.com/ION-iCade-Arcade-Bluetooth-Cabinet/dp/B004YC4NH6/ref=sr_1_1?keywords=ion+icade&qid=1643946976&sr=8-1), though rare.  They're more common [on eBay](https://www.ebay.com/itm/334288997982?hash=item4dd52d4e5e:g:xH4AAOSw975h3x5Z), and I even saw one at a flea market once.  It seems there were way more units sold than there were games developed for it, and that was ultimately its downfall.

But here's the thing (and I wish the company that made these realized this): it's not limited to just iPads!  I've successfully paired my iCade to my Android tablet, and considering there are so many of them out there, I think it would be worthwhile if those of us who code would actually build some game for it.

## Version 1.0 design goals

* It should run in a web browser; I considered actually learning native Android app development and using this project as an excuse to do that, but then I'd be cutting out all the people who actually bought the iCade to use with an iPad.  And since I neither own a Mac nor have any intention of saving for one, it's gonna be a web thing.  That also means it'll run on a Raspberry Pi or anything else with Bluetooth support (which is awesome, cuz the Raspberry Pi is often used to build arcade cabinets that don't use Bluetooth, which supposedly has lower lag and all that).
* It should be simple.  If it's going to run in a browser, all that extra browser stuff is going to waste resources.  So the games I envision this running are things like Donkey Kong, Pac-Man, Frogger, Space Invaders, etc.  Not Street Fighter, Ninja Turtles 2 "The Arcade Game", or anything more recent than that.  If web browsers get fast enough and light enough to easily do those things on a low-resource machine, then it'll be time to talk 2.0
* I'd like it to actually run actual 8-bit machine code.  This is for a lot of reasons, which I don't want to bore you with, but might list out at some point.

## Version 1.0 road map

### World 1: Build the machine

At the code level, each script emulates a different hardware component that would actually exist on a real arcade machine (and some that would never be in a real arcade machine, but could be if programmers were crazy :D)

### World 2: Build some games!

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

### World 3: Write developer docs

There's not much about open-source software I dislike, but one thing I wish we open-source fans did better was write manuals.  Some projects do an excellent job, don't get me wrong, but others... not so much.  As a programmer, nothing drives me crazier when a library only has encyclopedia-style reference material.  No tutorials, not quick starts, no examples, just a list of functions/objects/whatever.  If I make it to Level 3 - if I don't get a "Game Over" (burnout) - then I just gotta write great docs.  Ultimately, I'd really like for other programmers to learn to code for this system - they can't do that without docs.




-----------------------------------------------------------------------------------------------

# Level 1 to-do's:

## "World 1-3": Network and local storage

* Test modem.js - try it in a local web server, maybe a little Bottle server
* **BOSS BATTLE:** Write an Assembly program that uses the localStorage and modem.js if I use it.

## "World 1-4": Misc. and Polish

* Create a timer (I think I have an old script for that too)
* Create a logo for the icon - I've been calling it iCadeOS, but it wasn't actually sponsored by the company behind the iCade (if they're even still around).  So probably just a generic arcade icon, but with a tablet icon inside that (lol).  Once the icon is done, update the HEAD tag and all that.
* Create a nicer background on startup; maybe code a program that puts some instructions on there or something
* Research which license to use - I really want UNLICENSE, but the 6502 piece was created under something else
* Test the canvas with screen readers and make sure it's accessible - this system could be used to create audio games (and in fact some of the code it's running was originally built for that) so I want to make sure people who want to can do that.
* Idea: auto-run from URL (like the Commodore PET emulator)?  One wrinkle tho: sound.  Some browsers don't allow sound unless the user pushes a button.  So maybe in wires.js, if the URL contains program code, just put a "start game" button on it or something...
* Minify the HTML, JS, and CSS
* **MINI-BOSS:** Write an Assembly program that uses the timer
* **MINI-BOSS:** Finalize my memory map in wires.js, add comments to all JS code I haven't yet, and update the code to include whatever comments the license requires

-----------------------------------------------------------------------------------------------

# Level 2 to-do's:

Yes, I'm starting to think about World 2-1 here! :D

## World 2-1: Air Hockey

Basically a Pong clone, in 6502 Assembly.  That's about as good as my Assembly skills are at this point, and it's the simplest game I could possibly want for a starter.  It should:

* Have 1- and 2-player modes
* Play sound effects when the ball bounces or a player scores
* Use the default character set (no redefining here)

## World 2-2: Alien Invasion

Basically a Space Invaders clone, probably also Assembly but maybe in C.  It should

* Redefine characters, maybe use a custom character set
* Play music on the title screen
* Use the storage system for high scores

## World 2-3: Breakout

It should:

* Have constant background music AND have sound effects

## World 2-4: Tetris

* 
* 


--------------------------------------------------------------------------

World 3 is probably going to be an ongoing work in progress.  I'll have to write as I go.
