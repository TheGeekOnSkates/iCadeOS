/*
*  Original 6502 assembler and simulator in Javascript
*  (C)2006-2010 Stian Soreng - www.6502asm.com
* 
*  Adapted by Nick Morgan
*  https://github.com/skilldrick/6502js
*  
*  Later adapted by the Geek on Skates
*  http://www.geekonskates.com
*
*  Released under the GNU General Public License
*  see http://gnu.org/licenses/gpl.html
*/
let js6502 = {
	onStep: function() {}	// End-developers should override this.
};

/**
 * This stores an instance of the "Simulator"
 * object, which does the actual processing
 */
js6502.cpu = null;

/**
 * Called if the emulator encounters an error (users can redefine it)
 * @param {string} m The error message
 */
js6502.onError = function(m) { console.log(m); };

/**
 * Memory address to be used as a random
 * number generator (-1 means don't have one)
 */
js6502.RANDOM = -1;

/**
 * After calling init(), this is the 6502's
 * memory (technically both RAM and ROM, but
 * I used "ram" to avoid writing "memory"
 * over and over again, lol).
 */
js6502.ram = null;

/**
 * The 6502 can access up to 65536 bytes of
 * memory; however, most 8-bit consoles and
 * computers didn't have near that much to
 * work with.  So this can be set to something
 * lower (note that 1 KB = 1024 bytes here).
 */
js6502.SIZE = 65537;

/**
 * Sets up the 6502 processor (call this before running)
 * number generator, if the system uses one.
 * @param {number} [prng] Memory address of a pseudo-random
 * @param {number} [size] Total memory available, in bytes
 * (defaults to the full 64 KB, like the Commodore 64 had)
 * @param {number} [speed] How many instructions to run at a time
 * (defaults to 97 - see the original Simulator.execute in the
 * GitHub repo listed at the top of this page)
 */
js6502.init = function(prng, size, speed) {
	js6502.SIZE = size || 0x10000;
	js6502.ram = new Uint8Array(js6502.SIZE);
	js6502.RANDOM = prng || -1;
	js6502.cpu = new js6502.Simulator();
	js6502.cpu.speed = speed || 97;
};

/**
 * This does the heavy lifting - this is the actual
 * 6502-processing component (this is js6502.cpu).
 */
js6502.Simulator = function() {
	var regA = 0;
	var regX = 0;
	var regY = 0;
	var regP = 0;
	var regPC = 0x1600;
	var regSP = 0xff;
	var codeRunning = false;

	/**
	 * Runs a compiled (assembled) )program
	 * @param {number} addr The memory address where the program starts
	 */
	function runBinary(addr) {
		codeRunning = true;
		regPC = addr;
		setRandomByte();
		executeNextInstruction();
		if ((regPC === 0)) {
			codeRunning = false;
		}
	}

    //set zero and negative processor flags based on result
    function setNVflags(value) {
      if (value) {
        regP &= 0xfd;
      } else {
        regP |= 0x02;
      }
      if (value & 0x80) {
        regP |= 0x80;
      } else {
        regP &= 0x7f;
      }
    }

    function setCarryFlagFromBit0(value) {
      regP = (regP & 0xfe) | (value & 1);
    }

    function setCarryFlagFromBit7(value) {
      regP = (regP & 0xfe) | ((value >> 7) & 1);
    }

    function setNVflagsForRegA() {
      setNVflags(regA);
    }

    function setNVflagsForRegX() {
      setNVflags(regX);
    }

    function setNVflagsForRegY() {
      setNVflags(regY);
    }

    var ORA = setNVflagsForRegA;
    var AND = setNVflagsForRegA;
    var EOR = setNVflagsForRegA;
    var ASL = setNVflags;
    var LSR = setNVflags;
    var ROL = setNVflags;
    var ROR = setNVflags;
    var LDA = setNVflagsForRegA;
    var LDX = setNVflagsForRegX;
    var LDY = setNVflagsForRegY;

    function BIT(value) {
      if (value & 0x80) {
        regP |= 0x80;
      } else {
        regP &= 0x7f;
      }
      if (value & 0x40) {
        regP |= 0x40;
      } else {
        regP &= ~0x40;
      }
      if (regA & value) {
        regP &= 0xfd;
      } else {
        regP |= 0x02;
      }
    }

    function CLC() {
      regP &= 0xfe;
    }

    function SEC() {
      regP |= 1;
    }


    function CLV() {
      regP &= 0xbf;
    }

    function setOverflow() {
      regP |= 0x40;
    }

    function DEC(addr) {
      var value = js6502.ram[addr];
      value--;
      value &= 0xff;
      js6502.ram[addr] = value;
      setNVflags(value);
    }

    function INC(addr) {
      var value = js6502.ram[addr];
      value++;
      value &= 0xff;
      js6502.ram[addr] = value;
      setNVflags(value);
    }

    function jumpBranch(offset) {
      if (offset > 0x7f) {
        regPC = (regPC - (0x100 - offset));
      } else {
        regPC = (regPC + offset);
      }
    }

    function overflowSet() {
      return regP & 0x40;
    }

    function decimalMode() {
      return regP & 8;
    }

    function carrySet() {
      return regP & 1;
    }

    function negativeSet() {
      return regP & 0x80;
    }

    function zeroSet() {
      return regP & 0x02;
    }

    function doCompare(reg, val) {
      if (reg >= val) {
        SEC();
      } else {
        CLC();
      }
      val = (reg - val);
      setNVflags(val);
    }

    function testSBC(value) {
      var tmp, w;
      if ((regA ^ value) & 0x80) {
        setOverflow();
      } else {
        CLV();
      }

      if (decimalMode()) {
        tmp = 0xf + (regA & 0xf) - (value & 0xf) + carrySet();
        if (tmp < 0x10) {
          w = 0;
          tmp -= 6;
        } else {
          w = 0x10;
          tmp -= 0x10;
        }
        w += 0xf0 + (regA & 0xf0) - (value & 0xf0);
        if (w < 0x100) {
          CLC();
          if (overflowSet() && w < 0x80) { CLV(); }
          w -= 0x60;
        } else {
          SEC();
          if (overflowSet() && w >= 0x180) { CLV(); }
        }
        w += tmp;
      } else {
        w = 0xff + regA - value + carrySet();
        if (w < 0x100) {
          CLC();
          if (overflowSet() && w < 0x80) { CLV(); }
        } else {
          SEC();
          if (overflowSet() && w >= 0x180) { CLV(); }
        }
      }
      regA = w & 0xff;
      setNVflagsForRegA();
    }

function testADC(value) {
	var tmp;
	if ((regA ^ value) & 0x80) {
		CLV();
	} else setOverflow();

	if (decimalMode()) {
		tmp = (regA & 0xf) + (value & 0xf) + carrySet();
	if (tmp >= 10) {
		tmp = 0x10 | ((tmp + 6) & 0xf);
	}
        tmp += (regA & 0xf0) + (value & 0xf0);
        if (tmp >= 160) {
          SEC();
          if (overflowSet() && tmp >= 0x180) { CLV(); }
          tmp += 0x60;
        } else {
          CLC();
          if (overflowSet() && tmp < 0x80) { CLV(); }
        }
      } else {
        tmp = regA + value + carrySet();
        if (tmp >= 0x100) {
          SEC();
          if (overflowSet() && tmp >= 0x180) { CLV(); }
        } else {
          CLC();
          if (overflowSet() && tmp < 0x80) { CLV(); }
        }
      }
      regA = tmp & 0xff;
      setNVflagsForRegA();
    }

    var instructions = {
      i00: function () {
        codeRunning = false;
        //BRK
      },

      i01: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        var value = js6502.ram[addr];
        regA |= value;
        ORA();
      },

      i05: function () {
        var zp = popByte();
        regA |= js6502.ram[zp];
        ORA();
      },

      i06: function () {
        var zp = popByte();
        var value = js6502.ram[zp];
        setCarryFlagFromBit7(value);
        value = value << 1;
        js6502.ram[zp] = value;
        ASL(value);
      },

      i08: function () {
        stackPush(regP | 0x30);
        //PHP
      },

      i09: function () {
        regA |= popByte();
        ORA();
      },

      i0a: function () {
        setCarryFlagFromBit7(regA);
        regA = (regA << 1) & 0xff;
        ASL(regA);
      },

      i0d: function () {
        regA |= js6502.ram[popWord()];
        ORA();
      },

      i0e: function () {
        var addr = popWord();
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        js6502.ram[addr] = value;
        ASL(value);
      },

      i10: function () {
        var offset = popByte();
        if (!negativeSet()) { jumpBranch(offset); }
        //BPL
      },

      i11: function () {
        var zp = popByte();
        var value = getWord(zp) + regY;
        regA |= js6502.ram[value];
        ORA();
      },

      i15: function () {
        var addr = (popByte() + regX) & 0xff;
        regA |= js6502.ram[addr];
        ORA();
      },

      i16: function () {
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        js6502.ram[addr] = value;
        ASL(value);
      },

      i18: function () {
        CLC();
      },

      i19: function () {
        var addr = popWord() + regY;
        regA |= js6502.ram[addr];
        ORA();
      },

      i1d: function () {
        var addr = popWord() + regX;
        regA |= js6502.ram[addr];
        ORA();
      },

      i1e: function () {
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        js6502.ram[addr] = value;
        ASL(value);
      },

      i20: function () {
        var addr = popWord();
        var currAddr = regPC - 1;
        stackPush(((currAddr >> 8) & 0xff));
        stackPush((currAddr & 0xff));
        regPC = addr;
        //JSR
      },

      i21: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        var value = js6502.ram[addr];
        regA &= value;
        AND();
      },

      i24: function () {
        var zp = popByte();
        var value = js6502.ram[zp];
        BIT(value);
      },

      i25: function () {
        var zp = popByte();
        regA &= js6502.ram[zp];
        AND();
      },

      i26: function () {
        var sf = carrySet();
        var addr = popByte();
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        value |= sf;
        js6502.ram[addr] = value;
        ROL(value);
      },

      i28: function () {
        regP = stackPop() | 0x30; // There is no B bit!
        //PLP
      },

      i29: function () {
        regA &= popByte();
        AND();
      },

      i2a: function () {
        var sf = carrySet();
        setCarryFlagFromBit7(regA);
        regA = (regA << 1) & 0xff;
        regA |= sf;
        ROL(regA);
      },

      i2c: function () {
        var value = js6502.ram[popWord()];
        BIT(value);
      },

      i2d: function () {
        var value = js6502.ram[popWord()];
        regA &= value;
        AND();
      },

      i2e: function () {
        var sf = carrySet();
        var addr = popWord();
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        value |= sf;
        js6502.ram[addr] = value;
        ROL(value);
      },

      i30: function () {
        var offset = popByte();
        if (negativeSet()) { jumpBranch(offset); }
        //BMI
      },

      i31: function () {
        var zp = popByte();
        var value = getWord(zp) + regY;
        regA &= js6502.ram[value];
        AND();
      },

      i35: function () {
        var addr = (popByte() + regX) & 0xff;
        regA &= js6502.ram[addr];
        AND();
      },

      i36: function () {
        var sf = carrySet();
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        value |= sf;
        js6502.ram[addr] = value;
        ROL(value);
      },

      i38: function () {
        SEC();
      },

      i39: function () {
        var addr = popWord() + regY;
        var value = js6502.ram[addr];
        regA &= value;
        AND();
      },

      i3d: function () {
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        regA &= value;
        AND();
      },

      i3e: function () {
        var sf = carrySet();
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        setCarryFlagFromBit7(value);
        value = value << 1;
        value |= sf;
        js6502.ram[addr] = value;
        ROL(value);
      },

      i40: function () {
        regP = stackPop() | 0x30; // There is no B bit!
        regPC = stackPop() | (stackPop() << 8);
        //RTI
      },

      i41: function () {
        var zp = (popByte() + regX) & 0xff;
        var value = getWord(zp);
        regA ^= js6502.ram[value];
        EOR();
      },

      i45: function () {
        var addr = popByte() & 0xff;
        var value = js6502.ram[addr];
        regA ^= value;
        EOR();
      },

      i46: function () {
        var addr = popByte() & 0xff;
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        js6502.ram[addr] = value;
        LSR(value);
      },

      i48: function () {
        stackPush(regA);
        //PHA
      },

      i49: function () {
        regA ^= popByte();
        EOR();
      },

      i4a: function () {
        setCarryFlagFromBit0(regA);
        regA = regA >> 1;
        LSR(regA);
      },

      i4c: function () {
        regPC = popWord();
        //JMP
      },

      i4d: function () {
        var addr = popWord();
        var value = js6502.ram[addr];
        regA ^= value;
        EOR();
      },

      i4e: function () {
        var addr = popWord();
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        js6502.ram[addr] = value;
        LSR(value);
      },

      i50: function () {
        var offset = popByte();
        if (!overflowSet()) { jumpBranch(offset); }
        //BVC
      },

      i51: function () {
        var zp = popByte();
        var value = getWord(zp) + regY;
        regA ^= js6502.ram[value];
        EOR();
      },

      i55: function () {
        var addr = (popByte() + regX) & 0xff;
        regA ^= js6502.ram[addr];
        EOR();
      },

      i56: function () {
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        js6502.ram[addr] = value;
        LSR(value);
      },

      i58: function () {
        regP &= ~0x04;
        throw new Error("Interrupts not implemented");
        //CLI
      },

      i59: function () {
        var addr = popWord() + regY;
        var value = js6502.ram[addr];
        regA ^= value;
        EOR();
      },

      i5d: function () {
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        regA ^= value;
        EOR();
      },

      i5e: function () {
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        js6502.ram[addr] = value;
        LSR(value);
      },

      i60: function () {
        regPC = (stackPop() | (stackPop() << 8)) + 1;
        //RTS
      },

      i61: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        var value = js6502.ram[addr];
        testADC(value);
        //ADC
      },

      i65: function () {
        var addr = popByte();
        var value = js6502.ram[addr];
        testADC(value);
        //ADC
      },

      i66: function () {
        var sf = carrySet();
        var addr = popByte();
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        if (sf) { value |= 0x80; }
        js6502.ram[addr] = value;
        ROR(value);
      },

      i68: function () {
        regA = stackPop();
        setNVflagsForRegA();
        //PLA
      },

      i69: function () {
        var value = popByte();
        testADC(value);
        //ADC
      },

      i6a: function () {
        var sf = carrySet();
        setCarryFlagFromBit0(regA);
        regA = regA >> 1;
        if (sf) { regA |= 0x80; }
        ROR(regA);
      },

      i6c: function () {
        regPC = getWord(popWord());
        //JMP
      },

      i6d: function () {
        var addr = popWord();
        var value = js6502.ram[addr];
        testADC(value);
        //ADC
      },

      i6e: function () {
        var sf = carrySet();
        var addr = popWord();
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        if (sf) { value |= 0x80; }
        js6502.ram[addr] = value;
        ROR(value);
      },

      i70: function () {
        var offset = popByte();
        if (overflowSet()) { jumpBranch(offset); }
        //BVS
      },

      i71: function () {
        var zp = popByte();
        var addr = getWord(zp);
        var value = js6502.ram[addr + regY];
        testADC(value);
        //ADC
      },

      i75: function () {
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        testADC(value);
        //ADC
      },

      i76: function () {
        var sf = carrySet();
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        if (sf) { value |= 0x80; }
        js6502.ram[addr] = value;
        ROR(value);
      },

      i78: function () {
        regP |= 0x04;
        throw new Error("Interrupts not implemented");
        //SEI
      },

      i79: function () {
        var addr = popWord();
        var value = js6502.ram[addr + regY];
        testADC(value);
        //ADC
      },

      i7d: function () {
        var addr = popWord();
        var value = js6502.ram[addr + regX]
        testADC(value);
        //ADC
      },

      i7e: function () {
        var sf = carrySet();
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        setCarryFlagFromBit0(value);
        value = value >> 1;
        if (sf) { value |= 0x80; }
        js6502.ram[addr] = value;
        ROR(value);
      },

      i81: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        js6502.ram[addr] = regA;
        //STA
      },

      i84: function () {
        js6502.ram[popByte()] = regY;
        //STY
      },

      i85: function () {
        js6502.ram[popByte()] = regA;
        //STA
      },

      i86: function () {
        js6502.ram[popByte()] = regX;
        //STX
      },

      i88: function () {
        regY = (regY - 1) & 0xff;
        setNVflagsForRegY();
        //DEY
      },

      i8a: function () {
        regA = regX & 0xff;
        setNVflagsForRegA();
        //TXA
      },

      i8c: function () {
        js6502.ram[popWord()] = regY;
        //STY
      },

      i8d: function () {
        js6502.ram[popWord()] = regA;
        //STA
      },

      i8e: function () {
        js6502.ram[popWord()] = regX;
        //STX
      },

      i90: function () {
        var offset = popByte();
        if (!carrySet()) { jumpBranch(offset); }
        //BCC
      },

      i91: function () {
        var zp = popByte();
        var addr = getWord(zp) + regY;
        js6502.ram[addr] = regA;
        //STA
      },

      i94: function () {
        js6502.ram[(popByte() + regX) & 0xff] = regY;
        //STY
      },

      i95: function () {
        js6502.ram[(popByte() + regX) & 0xff] = regA;
        //STA
      },

      i96: function () {
        js6502.ram[(popByte() + regY) & 0xff] = regX;
        //STX
      },

      i98: function () {
        regA = regY & 0xff;
        setNVflagsForRegA();
        //TYA
      },

      i99: function () {
        js6502.ram[popWord() + regY] = regA;
        //STA
      },

      i9a: function () {
        regSP = regX & 0xff;
        //TXS
      },

      i9d: function () {
        var addr = popWord();
        js6502.ram[addr + regX] = regA;
        //STA
      },

      ia0: function () {
        regY = popByte();
        LDY();
      },

      ia1: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        regA = js6502.ram[addr];
        LDA();
      },

      ia2: function () {
        regX = popByte();
        LDX();
      },

      ia4: function () {
        regY = js6502.ram[popByte()];
        LDY();
      },

      ia5: function () {
        regA = js6502.ram[popByte()];
        LDA();
      },

      ia6: function () {
        regX = js6502.ram[popByte()];
        LDX();
      },

      ia8: function () {
        regY = regA & 0xff;
        setNVflagsForRegY();
        //TAY
      },

      ia9: function () {
        regA = popByte();
        LDA();
      },

      iaa: function () {
        regX = regA & 0xff;
        setNVflagsForRegX();
        //TAX
      },

      iac: function () {
        regY = js6502.ram[popWord()];
        LDY();
      },

      iad: function () {
        regA = js6502.ram[popWord()];
        LDA();
      },

      iae: function () {
        regX = js6502.ram[popWord()];
        LDX();
      },

      ib0: function () {
        var offset = popByte();
        if (carrySet()) { jumpBranch(offset); }
        //BCS
      },

      ib1: function () {
        var zp = popByte();
        var addr = getWord(zp) + regY;
        regA = js6502.ram[addr];
        LDA();
      },

      ib4: function () {
        regY = js6502.ram[(popByte() + regX) & 0xff];
        LDY();
      },

      ib5: function () {
        regA = js6502.ram[(popByte() + regX) & 0xff];
        LDA();
      },

      ib6: function () {
        regX = js6502.ram[(popByte() + regY) & 0xff];
        LDX();
      },

      ib8: function () {
        CLV();
      },

      ib9: function () {
        var addr = popWord() + regY;
        regA = js6502.ram[addr];
        LDA();
      },

      iba: function () {
        regX = regSP & 0xff;
        LDX();
        //TSX
      },

      ibc: function () {
        var addr = popWord() + regX;
        regY = js6502.ram[addr];
        LDY();
      },

      ibd: function () {
        var addr = popWord() + regX;
        regA = js6502.ram[addr];
        LDA();
      },

      ibe: function () {
        var addr = popWord() + regY;
        regX = js6502.ram[addr];
        LDX();
      },

      ic0: function () {
        var value = popByte();
        doCompare(regY, value);
        //CPY
      },

      ic1: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        var value = js6502.ram[addr];
        doCompare(regA, value);
        //CPA
      },

      ic4: function () {
        var value = js6502.ram[popByte()];
        doCompare(regY, value);
        //CPY
      },

      ic5: function () {
        var value = js6502.ram[popByte()];
        doCompare(regA, value);
        //CPA
      },

      ic6: function () {
        var zp = popByte();
        DEC(zp);
      },

      ic8: function () {
        regY = (regY + 1) & 0xff;
        setNVflagsForRegY();
        //INY
      },

      ic9: function () {
        var value = popByte();
        doCompare(regA, value);
        //CMP
      },

      ica: function () {
        regX = (regX - 1) & 0xff;
        setNVflagsForRegX();
        //DEX
      },

      icc: function () {
        var value = js6502.ram[popWord()];
        doCompare(regY, value);
        //CPY
      },

      icd: function () {
        var value = js6502.ram[popWord()];
        doCompare(regA, value);
        //CPA
      },

      ice: function () {
        var addr = popWord();
        DEC(addr);
      },

      id0: function () {
        var offset = popByte();
        if (!zeroSet()) { jumpBranch(offset); }
        //BNE
      },

      id1: function () {
        var zp = popByte();
        var addr = getWord(zp) + regY;
        var value = js6502.ram[addr];
        doCompare(regA, value);
        //CMP
      },

      id5: function () {
        var value = js6502.ram[(popByte() + regX) & 0xff];
        doCompare(regA, value);
        //CMP
      },

      id6: function () {
        var addr = (popByte() + regX) & 0xff;
        DEC(addr);
      },

      id8: function () {
        regP &= 0xf7;
        //CLD
      },

      id9: function () {
        var addr = popWord() + regY;
        var value = js6502.ram[addr];
        doCompare(regA, value);
        //CMP
      },

      idd: function () {
        var addr = popWord() + regX;
        var value = js6502.ram[addr];
        doCompare(regA, value);
        //CMP
      },

      ide: function () {
        var addr = popWord() + regX;
        DEC(addr);
      },

      ie0: function () {
        var value = popByte();
        doCompare(regX, value);
        //CPX
      },

      ie1: function () {
        var zp = (popByte() + regX) & 0xff;
        var addr = getWord(zp);
        var value = js6502.ram[addr];
        testSBC(value);
        //SBC
      },

      ie4: function () {
        var value = js6502.ram[popByte()];
        doCompare(regX, value);
        //CPX
      },

      ie5: function () {
        var addr = popByte();
        var value = js6502.ram[addr];
        testSBC(value);
        //SBC
      },

      ie6: function () {
        var zp = popByte();
        INC(zp);
      },

      ie8: function () {
        regX = (regX + 1) & 0xff;
        setNVflagsForRegX();
        //INX
      },

      ie9: function () {
        var value = popByte();
        testSBC(value);
        //SBC
      },

      iea: function () {
        //NOP
      },

      iec: function () {
        var value = js6502.ram[popWord()];
        doCompare(regX, value);
        //CPX
      },

      ied: function () {
        var addr = popWord();
        var value = js6502.ram[addr];
        testSBC(value);
        //SBC
      },

      iee: function () {
        var addr = popWord();
        INC(addr);
      },

      if0: function () {
        var offset = popByte();
        if (zeroSet()) { jumpBranch(offset); }
        //BEQ
      },

      if1: function () {
        var zp = popByte();
        var addr = getWord(zp);
        var value = js6502.ram[addr + regY];
        testSBC(value);
        //SBC
      },

      if5: function () {
        var addr = (popByte() + regX) & 0xff;
        var value = js6502.ram[addr];
        testSBC(value);
        //SBC
      },

      if6: function () {
        var addr = (popByte() + regX) & 0xff;
        INC(addr);
      },

      if8: function () {
        regP |= 8;
        //SED
      },

      if9: function () {
        var addr = popWord();
        var value = js6502.ram[addr + regY];
        testSBC(value);
        //SBC
      },

      ifd: function () {
        var addr = popWord();
        var value = js6502.ram[addr + regX]
        testSBC(value);
        //SBC
      },

      ife: function () {
        var addr = popWord() + regX;
        INC(addr);
      },

		ierr: function () {
			js6502.onError("Address $" + addr2hex(regPC) + " - unknown opcode: " + addr2hex(js6502.ram[regPC]));
			codeRunning = false;
		}
	};

	function stackPush(value) {
		js6502.ram[(regSP & 0xff) + 0x100] = value & 0xff;
		regSP--;
		if (regSP < 0) {
			regSP &= 0xff;
			js6502.onError("6502 Stack filled! Wrapping...");
		}
	}

	function stackPop() {
		var value;
		regSP++;
		if (regSP >= 0x100) {
			regSP &= 0xff;
			js6502.onError("6502 Stack emptied! Wrapping...");
		}
		value = js6502.ram[regSP + 0x100];
		return value;
	}

	/**
	 * Gets a byte from RAM
	 * @returns The byte
	 * @todo Figure out why the "& 0xff"
	 */
	function popByte() {
		return (js6502.ram[regPC++] & 0xff);
	}
	
	/**
	 * Gets a "word" (16-bit number) from two bytes in memory
	 * @param {number} addr The location of the first byte
	 * @returns The 16-bit number you get from the byte passed
	 * above and the byte following it
	 * @todo Add an error-check if addr = 65535 (lol)
	 */
	function getWord(addr) {
		return js6502.ram[addr] + (js6502.ram[addr + 1] << 8);
	}

	/**
	 * Converts two 8-bit numbers to a 16-bit number
	 * @returns The "word" (16-bit memory address)
	 */
	function popWord() {
		return popByte() + (popByte() << 8);
	}

	function executeNextInstruction() {
		setRandomByte();
		js6502.onStep();
		if (!codeRunning) { return; }
		var instructionName = popByte().toString(16).toLowerCase();
		if (instructionName.length === 1) {
			instructionName = '0' + instructionName;
		}
		var instruction = instructions['i' + instructionName];
		if (instruction) {
			instruction();
		} else {
			instructions.ierr();
		}
	}

	/**
	 * If using a pseudo-random number generator,
	 * this updates its contents to be a new number
	 * (called in the main loop)
	 */
	function setRandomByte() {
		if (js6502.RANDOM == -1) return;
		js6502.ram[js6502.RANDOM] = Math.floor(Math.random() * 256);
    }
    
	/**
	 * Loads a program into memory
	 * @param {number} start Program code starts here (PC goes here)
	 * @param {Array<number>} code Program code
	 * @param {number} [offset] Optional "header" (some assemblers create binaries where the first few bytes store info about i.e. where to load the program counter etc.)
	 */
	function load(start, code, offset) {
		if (code.length > js6502.SIZE)
			throw "Program is too big";
		reset();
		offset = offset || 0;
		for (let i=0; i<code.length; i++) {
			js6502.ram[start + i] = code[i + offset];
		}
		runBinary(start);
	}

	/**
	 * Resets the CPU and memory
	 */
	function reset() {
		for (var i = 0; i < js6502.SIZE; i++) { // clear ZP, stack and screen
			js6502.ram[i] = 0x00;
		}
		regA = regX = regY = 0;
		regPC = 0x600;
		regSP = 0xff;
		regP = 0x30;
	}

	function addr2hex(addr) {
		return num2hex((addr >> 8) & 0xff) + num2hex(addr & 0xff);
	};
	
	/**
	 * Executes a step (or however many the emulated system needs based
	 * on its speed).  Note that the speed problem is one I've been
	 * fighting with for a long time; leave it at one step per frame and
	 * it runs slower than a turtle in a tarpit; too many and you get a
	 * weird sort of "race condition" where i.e. calling getA() doesn't
	 * accurately reflect what's in the A-register (if JS code needs to
	 * even know about the A-register)
	 */
	function step() {
		for (let i=0; i<js6502.cpu.speed; i++) {
			executeNextInstruction();
		}
	}
	
	/**
	 * Formats a number as a hex string
	 * @param {number} nr The number to be formatted
	 * @returns {string} The number in hexadecimal format
	 */
	function num2hex(nr) {
		var str = "0123456789abcdef";
		var hi = ((nr & 0xf0) >> 4);
		var lo = (nr & 15);
		return str.substring(hi, hi + 1) + str.substring(lo, lo + 1);
	};
	
	return {
		getA: function() { return regA; },
		getX: function() { return regX; },
		getY: function() { return regY; },
		getPC: function() { return regPC; },
		getSP: function() { return regSP; },
		getFlags: function() { return regP; },
		load: load,
		run: runBinary,
		step: step,
		reset: reset,
		stop: stop
	};
};

/**
 * A data-dump function I created to test my code
 * @param {number} from Dump data from here
 * @param {number} to Dump data up to here
 * @todo Looking at the original code, I see they had a debugger
 * and monitor.  I didn't know what those things were when I re-
 * worked their code, but I might want to consider re-adding those
 * features.  idk tho, those should probably be software that runs
 * on the emulated hardware (like the Apple 1 and Commodore PET had).
 * That way if (and Lord willing WHEN) this system is ready to share,
 * who won't be writing code won't have to download all that extra
 * stuff.  Don't forget, this should run on low-resource devices :D
 */
js6502.dump = function(from, to) {
	let data = "";
	for (var i=from; i<to; i++) data += ("0" + js6502.ram[i].toString(16)).slice(-2) + " ";
	alert(data);
}
