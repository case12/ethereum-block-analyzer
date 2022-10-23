function createEscapeCode(code1, code2) {
  return "\033[" + code1 + ";" + code2 + "m";
}

const Colors = {
  Black: createEscapeCode(0, 30),
  Red: createEscapeCode(0, 31),
  Green: createEscapeCode(0, 32),
  Brown_Orange: createEscapeCode(0, 33),
  Blue: createEscapeCode(0, 34),
  Purple: createEscapeCode(0, 35),
  Cyan: createEscapeCode(0, 36),
  Light_Gray: createEscapeCode(0, 37),
  Light_Red: createEscapeCode(1, 31),
  Light_Green: createEscapeCode(1, 32),
  Yellow: createEscapeCode(1, 33),
  Light_Blue: createEscapeCode(1, 34),
  Light_Purple: createEscapeCode(1, 35),
  Light_Cyan: createEscapeCode(1, 36),
  White: createEscapeCode(1, 37),
  No_Color: "\033[0m",
};

module.exports = { Colors };

("\033[0;31m");
