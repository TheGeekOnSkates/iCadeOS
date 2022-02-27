/******************************************************************************/
/* MEMORY MAP                                                                 */
/******************************************************************************/

GRAPHICS_CHARACTER_RAM =	$0200
GRAPHICS_SCREEN_RAM =		$0600
GRAPHICS_COLOR_RAM =		$0AB0
GRAPHICS_PALETTE_RAM =		$0F60
GRAPHICS_EXTRA_COLORS =		$0F90
TTS_RATE =			$0F91
TTS_PITCH =			$0F92
TTS_VOLUME =			$0F93
TTS_STATUS =			$0F94
TTS_BUFFER_START =		$0F95
SOUND_VOICE1_WAVE =		$0F97
SOUND_VOICE1_VOLUME =		$0F98
SOUND_VOICE1_NOTE =		$0F99
SOUND_VOICE1_PAN =		$0F9A
SOUND_VOICE2_WAVE =		$0F9B
SOUND_VOICE2_VOLUME =		$0F9C
SOUND_VOICE2_NOTE =		$0F9D
SOUND_VOICE2_PAN =		$0F9E
SOUND_VOICE3_WAVE =		$0F9F
SOUND_VOICE3_VOLUME =		$0FA0
SOUND_VOICE3_NOTE =		$0FA1
SOUND_VOICE3_PAN =		$0FA2
SOUND_VOICE4_WAVE =		$0FA3
SOUND_VOICE4_VOLUME =		$0FA4
SOUND_VOICE4_NOTE =		$0FA5
SOUND_VOICE4_PAN =		$0FA6
SOUND_VOICE5_WAVE =		$0FA7
SOUND_VOICE5_VOLUME =		$0FA8
SOUND_VOICE5_NOTE =		$0FA9
SOUND_VOICE5_PAN =		$0FAA
SOUND_VOICE6_WAVE =		$0FAB
SOUND_VOICE6_VOLUME =		$0FAC
SOUND_VOICE6_NOTE =		$0FAD
SOUND_VOICE6_PAN =		$0FAE
SOUND_VOICE7_WAVE =		$0FAF
SOUND_VOICE7_VOLUME =		$0FB0
SOUND_VOICE7_NOTE =		$0FB1
SOUND_VOICE7_PAN =		$0FB2
SOUND_VOICE8_WAVE =		$0FB3
SOUND_VOICE8_VOLUME =		$0FB4
SOUND_VOICE8_NOTE =		$0FB5
SOUND_VOICE8_PAN =		$0FB6
INPUT_DPAD =			$0FB7
INPUT_BUTTONS =			$0FB8
RANDOM =			$0FB9
TIMER_HOURS =			$0FBA
TIMER_MINUTES =			$0FBB
TIMER_SECONDS =			$0FBC
TIMER_SPLIT_SECONDS =		$0FBD

/* Everything after this point is a work-in-progress (lol) */
STORAGE_KEY_START =		$0FBF
STORAGE_KEY_END =		$0FC1
STORAGE_VALUE_START =		$0FB3
STORAGE_VALUE_END =		$0FC5
STORAGE_STATUS =		$0FC7
MODEM_STATUS =			$0FC9
MODEM_RESPONSE_CODE =		$0FCA
MODEM_BUFFER_START =		$0FCC
MODEM_BUFFER_END =		$0FCE


/******************************************************************************/
/* INPUT CONSTANTS                                                            */
/******************************************************************************/

DPAD_UP =		$01
DPAD_DOWN =		$02
DPAD_LEFT =		$04
DPAD_RIGHT =		$08

BUTTON_1 =		$01
BUTTON_2 =		$02
BUTTON_3 =		$04
BUTTON_4 =		$08
BUTTON_5 =		$10
BUTTON_6 =		$20
BUTTON_7 =		$40
BUTTON_8 =		$80


/******************************************************************************/
/* DEFAULT CHARACTER SET                                                      */
/******************************************************************************/
/* Digits */
CHAR_0 =			$00
CHAR_1 =			$01
CHAR_2 =			$02
CHAR_3 =			$03
CHAR_4 =			$04
CHAR_5 =			$05
CHAR_6 =			$06
CHAR_7 =			$07
CHAR_8 =			$08
CHAR_9 =			$09

/* Space */
CHAR_SPACE =			$0A

/* Uppercase letters */
CHAR_A =			$0B
CHAR_B =			$0C
CHAR_C =			$0D
CHAR_D =			$0E
CHAR_E =			$0F
CHAR_F =			$10
CHAR_G =			$11
CHAR_H =			$12
CHAR_I =			$13
CHAR_J =			$14
CHAR_K =			$15
CHAR_L =			$16
CHAR_M =			$17
CHAR_N =			$18
CHAR_O =			$19
CHAR_P =			$1A
CHAR_Q =			$1B
CHAR_R =			$1C
CHAR_S =			$1D
CHAR_T =			$1E
CHAR_U =			$1F
CHAR_V =			$20
CHAR_W =			$21
CHAR_X =			$22
CHAR_Y =			$23
CHAR_Z =			$24

/* Lowercase letters */
CHAR_A_LOWER =			$25
CHAR_B_LOWER =			$26
CHAR_C_LOWER =			$27
CHAR_D_LOWER =			$28
CHAR_E_LOWER =			$29
CHAR_F_LOWER =			$2A
CHAR_G_LOWER =			$2B
CHAR_H_LOWER =			$2C
CHAR_I_LOWER =			$2D
CHAR_J_LOWER =			$2E
CHAR_K_LOWER =			$2F
CHAR_L_LOWER =			$30
CHAR_M_LOWER =			$31
CHAR_N_LOWER =			$32
CHAR_O_LOWER =			$33
CHAR_P_LOWER =			$34
CHAR_Q_LOWER =			$35
CHAR_R_LOWER =			$36
CHAR_S_LOWER =			$37
CHAR_T_LOWER =			$38
CHAR_U_LOWER =			$39
CHAR_V_LOWER =			$3A
CHAR_W_LOWER =			$3B
CHAR_X_LOWER =			$3C
CHAR_Y_LOWER =			$3D
DRAW_Z_LOWER =			$3E

/* Drawing letters */
DRAW_DIAGONAL_DOWN =		$3F
DRAW_DIAGONAL_UP =		$40
DRAW_X =			$41
DRAW_TRIANGLE_DOWN =		$42
DRAW_TRIANGLE_UP =		$43
DRAW_CHECKERS =			$44
DRAW_CHECKERS_V =		$45
DRAW_CHECKERS_H =		$46
DRAW_SQUARE_TOP_LEFT =		$47
DRAW_SQUARE_TOP_RIGHT =		$48
DRAW_SQUARE_BOTTOM_LEFT =	$49
DRAW_SQUARE_BOTTOM_RIGHT =	$4A
DRAW_HEART =			$4B
DRAW_DIAMOND =			$4C
DRAW_CLUB =			$4D
DRAW_SPADE =			$4E
DRAW_BALL =			$4F
DRAW_LINE_V =			$50
DRAW_LINE_H =			$51
DRAW_BOX_TOP_LEFT =		$52
DRAW_BOX_TOP_RIGHT =		$53
DRAW_BOX_BOTTOM_LEFT =		$54
DRAW_BOX_BOTTOM_RIGHT =		$55
DRAW_BOX_TL_BR =		$56
DRAW_BOX_TR_BL =		$57
DRAW_BOX_LEFT =			$58
DRAW_BOX_RIGHT =		$59
DRAW_BOX_TOP =			$5A
DRAW_BOX_BOTTOM =		$5B
DRAW_PLUS =			$5C
DRAW_T =			$5D
DRAW_T_FLIPPED =		$5E
DRAW_T_LEFT =			$5F
DRAW_T_RIGHT =			$60
DRAW_WAVY_DOWN =		$61
DRAW_WAVY_UP =			$62
DRAW_WAVY_DOWN_B =		$63
DRAW_WAVY_UP_B =		$64
DRAW_LINE_BOTTOM =		$65
DRAW_LINE_TOP =			$66
DRAW_LINE_BOTTOM_B =		$67
DRAW_LINE_TOP_B =		$68
DRAW_LINE_LEFT =		$69
DRAW_LINE_LEFT_B =		$6A
DRAW_LINE_RIGHT =		$6B
DRAW_LINE_RIGHT_B =		$6C
DRAW_SQUARE_TL_B =		$6D
DRAW_SQUARE_TR_B =		$6E
DRAW_SQUARE_BL_B =		$6F
DRAW_SQUARE_BR_B =		$70
DRAW_SQUARE_TL_C =		$71
DRAW_SQUARE_TR_C =		$72
DRAW_SQUARE_BL_C =		$73
DRAW_SQUARE_BR_C =		$74
DRAW_T_B =			$75
DRAW_T_FLIPPED_B =		$76
DRAW_T_LEFT_B =			$77
DRAW_T_RIGHT_B =		$78

/* Punctuation */
CHAR_DOLLARS =			$79
CHAR_COLON =			$7A
CHAR_APOSTROPHE =		$7B
CHAR_PERIOD =			$7C
CHAR_COMMA =			$7D
CHAR_QUESTION =			$7E
CHAR_EXCLAMATION =		$7F

/* Punctuation (UK aliases) */
CHAR_DOT =			$7C
CHAR_TICK =			$7B
CHAR_BANG =			$7F




/*****************************************************************************/
/* SYSTEM ERROR CODES                                                        */
/*****************************************************************************/

ERROR_NONE =		$00	/* No error */
ERROR_INVALID_WAVE =	$01	/* Invalid sound wave type (valid values are
				the WAVE_* constants defined below) */
ERROR_INVALID_NOTE =	$02	/* Invalid sound note ("frequency"); valid
				values are the NOTE_* constants below */


/******************************************************************************/
/* SCREEN COLOR CONSTANTS                                                     */
/******************************************************************************/

/* BG = background, FG = foreground */
BG_BLACK =		$00
FG_BLACK =		$00
BG_WHITE =		$01
FG_WHITE =		$10
BG_RED =		$02
FG_RED =		$20
BG_GREEN =		$03
FG_GREEN =		$30
BG_BLUE =		$04
FG_BLUE =		$40
BG_YELLOW =		$05
FG_YELLOW =		$50
BG_CYAN =		$06
FG_CYAN =		$60
BG_MAGENTA =		$07
FG_MAGENTA =		$70
BG_GRAY =		$08
FG_GRAY =		$80
BG_SILVER =		$09
FG_SILVER =		$90
BG_DARK_RED =		$0A
FG_DARK_RED =		$A0
BG_DARK_GREEN =		$0B
FG_DARK_GREEN =		$B0
BG_DARK_BLUE =		$0C
FG_DARK_BLUE =		$C0
BG_DARK_YELLOW =	$0D
FG_DARK_YELLOW =	$D0
BG_DARK_CYAN =		$0E
FG_DARK_CYAN =		$E0
BG_DARK_MAGENTA =	$0F
FG_DARK_MAGENTA =	$F0

/* Aliases for some of the funkier colors */
BG_GOLD =		$0D
FG_GOLD =		$D0
BG_TEAL =		$0E
FG_TEAL =		$E0
BG_PURPLE =		$0F
FG_PURPLE =		$F0
BG_VIOLET =		$0F
FG_VIOLET =		$F0


/*****************************************************************************/
/* SOUND CHIP CONSTANTS                                                      */
/*****************************************************************************/

/* Wave forms */
WAVE_SQUARE =		$00
WAVE_TRIANGLE = 	$01
WAVE_SAWTOOTH =		$02
WAVE_SINE =		$03
WAVE_WHITE_NOISE =	$04
WAVE_BROWN_NOISE =	$05
WAVE_PINK_NOISE =	$06

/* Musical notes */
NOTE_C0 = 		$00
NOTE_CS0 =		$01
NOTE_D0 =		$02
NOTE_DS0 =		$03
NOTE_E0 =		$04
NOTE_F0 =		$05
NOTE_FS0 =		$06
NOTE_G0 =		$07
NOTE_GS0 =		$08
NOTE_A0 =		$09
NOTE_AS0 =		$0A
NOTE_B0 =		$0B
NOTE_C1 =		$0C
NOTE_CS1 =		$0D
NOTE_D1 =		$0E
NOTE_DS1 =		$0F
NOTE_E1 =		$10
NOTE_F1 =		$11
NOTE_FS1 =		$12
NOTE_G1 =		$13
NOTE_GS1 =		$14
NOTE_A1 =		$15
NOTE_AS1 =		$16
NOTE_B1 =		$17
NOTE_C2 =		$18
NOTE_CS2 =		$19
NOTE_D2 =		$1A
NOTE_DS2 =		$1B
NOTE_E2 =		$1C
NOTE_F2 =		$1D
NOTE_FS2 =		$1E
NOTE_G2 =		$1F
NOTE_GS2 =		$20
NOTE_A2 =		$21
NOTE_AS2 =		$22
NOTE_B2 =		$23
NOTE_C3 =		$24
NOTE_CS3 =		$25
NOTE_D3 =		$26
NOTE_DS3 =		$27
NOTE_E3 =		$28
NOTE_F3 =		$29
NOTE_FS3 =		$2A
NOTE_G3 =		$2B
/* TO-DO: Finish note constants all the way up to 108 */


/*****************************************************************************/
/* INPUT CONSTANTS                                                      */
/*****************************************************************************/

JOYSTICK_UP = 1
JOYSTICK_DOWN = 2
JOYSTICK_LEFT = 4
JOYSTICK_RIGHT = 8
BUTTON_1 = 1
BUTTON_2 = 2
BUTTON_3 = 4
BUTTON_4 = 8
BUTTON_5 = 16
BUTTON_6 = 32
BUTTON_7 = 64
BUTTON_8 = 128


/*****************************************************************************/
/* TEXT-TO-SPEECH (TTS) STATUS CODES                                         */
/*****************************************************************************/

TTS_NOT_SPEAKING =		0 /* Not speaking */
TTS_START_SPEAKING =		1 /* Tell the system to start talking immediately, canceling any speech that may already be going on */
TTS_SPEECH_IN_PROGRESS =	2 /* Speech is currently in progress */
