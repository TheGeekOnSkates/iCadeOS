 ORG $0FD0	/* for now */
 PROCESSOR 6502
 include "iCadeOS.s"

	JSR SETUP_CHARS	/* LEFT OFF HERE (doesn't copy arrows, also seems to freeze) */
	JSR SETUP_SCREEN
LOOP:
	JSR READ_DPAD
	JSR READ_BUTTONS
	JMP LOOP

/* Redefines the characters to use the graphics I want */
SETUP_CHARS:
	LDA #<ONE
	LDY #>ONE
	JSR COPY_CHARS	/* Never gets to the next line... some kind of infinite loop? */
	LDA #<ARROWS
	LDA #>ARROWS
	JSR COPY_ARROWS
	RTS

/* Draw the graphics on the screen, black-on-black */
SETUP_SCREEN:
	LDA #11
	STA GRAPHICS_SCREEN_RAM+31
	/* Left off here */
	RTS

/* TO-DO: Rework this so it changes the color RAM instead of screen RAM */
READ_DPAD:
	LDA INPUT_DPAD
	STA GRAPHICS_SCREEN_RAM
	RTS

/* TO-DO: Rework this so it changes the color RAM instead of screen RAM */
READ_BUTTONS:
	LDA INPUT_BUTTONS
	STA GRAPHICS_SCREEN_RAM + 1
	RTS


/*
Random thought: This is something I expect I'll be using A LOT;
I hadn'e really meant for this sytem to have a kernel, but if I
do, maybe I should think about including this function.
*/
COPY_CHARS:
 CLC
 STA $00
 STY $01		/* So $0000 now points to the string to be written */
 LDY #$00
COPY_CHARS_CONTINUE:
 LDA ($00),Y
 BCS COPY_CHARS_DONE		/* If A == 77, then return */
 STA GRAPHICS_CHARACTER_RAM+88,Y
 INY
 JMP COPY_CHARS_CONTINUE	/* else, print the character and continue the loop */
COPY_CHARS_DONE:
 RTS

/* Same idea for the arrow characters */
COPY_ARROWS:
 STA $00
 STY $01		/* So $0000 now points to the string to be written */
 LDY #$00
COPY_ARROWS_CONTINUE:
 LDA ($00),Y
 BEQ COPY_ARROWS_DONE		/* If A == 77, then return */
 STA GRAPHICS_CHARACTER_RAM+344,Y
 INY
 JMP COPY_ARROWS_CONTINUE	/* else, print the character and continue the loop */
COPY_ARROWS_DONE:
 RTS






/*********************************************************************************************************************/
/* GRAPHICS CHARACTER REDEFINITION                                                                                   */
/*********************************************************************************************************************/

/* 1 */
ONE:
	BYTE 15,31,63,127,254,254,252,254
	BYTE 240,248,252,254,127,127,127,127
	BYTE 254,254,254,248,127,63,31,15
	BYTE 127,127,127,31,254,252,248,240
/* 2 */
	BYTE 15,31,63,127,252,249,255,254
	BYTE 240,248,252,254,63,159,159,63
	BYTE 253,251,251,248,127,63,31,15
	BYTE 255,255,255,31,254,252,248,240
/* 3 */
	BYTE 15,31,63,127,252,251,255,255
	BYTE 240,248,252,254,63,159,159,63
	BYTE 252,255,251,252,127,63,31,15
	BYTE 63,159,159,63,254,252,248,240
/* 4 */
	BYTE 15,31,63,127,255,255,254,253
	BYTE 240,248,252,254,191,63,191,191
	BYTE 248,255,255,255,127,63,31,15
	BYTE 31,191,191,255,254,252,248,240
/* 5 */
	BYTE 15,31,63,127,248,251,248,255
	BYTE 240,248,252,254,31,255,127,191
	BYTE 255,251,252,255,127,63,31,15
	BYTE 223,191,127,255,254,252,248,240
/* 6 */
	BYTE 15,31,63,127,254,253,251,248
	BYTE 240,248,252,254,63,255,255,63
	BYTE 251,251,252,255,127,63,31,15
	BYTE 223,223,63,255,254,252,248,240
/* 7 */
	BYTE 15,31,63,127,248,251,255,255
	BYTE 240,248,252,254,31,223,191,127
	BYTE 254,254,254,255,127,63,31,15
	BYTE 255,255,255,255,254,252,248,240
/* 8 */
	BYTE 15,31,63,127,252,251,251,252
	BYTE 240,248,252,254,63,223,223,63
	BYTE 251,251,252,255,127,63,31,15
	BYTE 223,223,63,255,254,252,248,240
ARROWS:
/* An arrow pointing left */
	BYTE 1,3,6,12,24,48,96,192
	BYTE 192,192,192,255,255,3,3,3
	BYTE 192,96,48,24,12,6,3,1
	BYTE 3,3,3,255,255,192,192,192
/* An arrow pointing rightt */
	BYTE 3,3,3,255,255,192,192,192
	BYTE 128,192,96,48,24,12,6,3
	BYTE 192,192,192,255,255,3,3,3
	BYTE 3,6,12,24,48,96,192,128
/* Top part of an arrow pointing down (for the pointy parts I can reuse bits from the left/right arrows) */
	BYTE 31,31,24,24,24,24,248,248
	BYTE 248,248,24,24,24,24,31,31
/* Bottom part of an arrow pointing up */
	BYTE 248,248,24,24,24,24,31,31
	BYTE 31,31,24,24,24,24,248,248
