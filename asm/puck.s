 ORG $0FD1	/* for now */
 PROCESSOR 6502
 include "iCadeOS.s"

	LDA #50
	STA TTS_RATE
	LDA #100
	STA TTS_VOLUME
	STA TTS_PITCH
	LDA #<PUCK
	STA TTS_BUFFER_START
	LDA #>PUCK
	STA TTS_BUFFER_START + 1
	LDA #TTS_START_SPEAKING
	STA TTS_STATUS
	BRK

PUCK:
	BYTE "What A GEEK!!", 0
