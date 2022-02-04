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

* **The CPU:** I'm going with a 6502, again for a lot of reasons I won't dive into here
* **The screen:** I think I'll go with a 3:4 aspect ratio, since that should work on most tablets.  Probably only 16 colors, but I'd like it to have both a Commodore-style character set (which can be changed to create graphics) and sprites.  I'm not super-familiar with sprites, but I figure this gives me a chance to learn them (on the NES and C64) and see if there's a strategy there that works on the iCade.
* **The sound chips:** In previous 8-bit projects I've built, I've had 4 to 8 independently programmable sound "voices" (and also text-to-speech); I plan to include at least those features in iCadeOS.  But ideally, I'd like to learn how ADSR works (on the C64) and see if I can add that functionality.  I've seen JS libraries that can do that, so if it's not a resource-hog it would sure make the sound a lot better.  And **MAYBE** even samples - but again, not likely (lol)
* **A way to load ROMs:** Unlike other 80s game systems, arcade cabinets didn't have cartridges or floppy drives - at least, none that us kids could see.  Here's where iCadeOS is different.  Because it's open-source - and because developers will want to actually test their code - I need a way to load games.  I have a few ideas on this, some I've used before, others I've seen on other web emulators.

And there are probably other things, but I don't know yet which ones I'll need/want.  I once built an emulator that had a way to connect to the internet - which arcade games didn't have, but might be helpful for i.e. saving high scores.  But then again there are other ways to do that (localStorage etc.).  We'll see

### Level 2: Build games

I would love iCadeOS to have clones of games like:

* Space Invaders
* Pac-Man
* Frogger
* Breakout
* Tetris
* Snake
* Pong
* Maybe others?

In addition to being fun to build and (hopefully) fun to play, this will give me a power-up for the last level: a nice library of Assembly and C code that other developers can use to build their games.

### Level 3: Write developer docs

There's not much about open-source software I dislike, but one thing I wish we open-source fans did better was write manuals.  Some projects do an excellent job, don't get me wrong, but others... not so much.  As a programmer, nothing drives me crazier when a library only has encyclopedia-style reference material.  No tutorials, not quick starts, no examples, just a list of functions/objects/whatever.  If I make it to Level 3 - if I don't get a "Game Over" (burnout) - then I just gotta write great docs.  Ultimately, I'd really like for other programmers to learn to code for this system - they can't do that without docs.

# Here goes nuttin'! :)
