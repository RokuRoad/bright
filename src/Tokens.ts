import { createToken, Lexer } from "chevrotain";

export const WS = createToken({
  group: Lexer.SKIPPED,
  name: "WS",
  pattern: /[\s\t]+/,
});

export const IDENTIFIER = createToken({
  name: "IDENTIFIER",
  pattern: /([A-Za-z_]+[A-Za-z0-9_]*)/,
});

const keyword = (words: string | string[], opts = {}) => {
  if (!Array.isArray(words)) {
    words = [words];
  }

  const term = words[0].toLowerCase();

  const name = words.map((word) => word.toUpperCase()).join("_");
  const re = new RegExp(`\\b${words.join("[ \\t]*")}\\b`, "iy");

  const pattern = (text: string, startOffset: number) => {
    re.lastIndex = startOffset;
    return re.exec(text);
  };

  const hint = term.substr(0, 1);
  const startHint =
    hint.toUpperCase() === hint.toLowerCase()
      ? [hint.toUpperCase()]
      : [hint.toUpperCase(), hint.toLowerCase()];

  return createToken({
    name,
    pattern,
    longer_alt: IDENTIFIER,
    start_chars_hint: startHint,
    line_breaks: false,
    ...opts,
  });
};

export const BASE_TYPE = createToken({ name: "BASE_TYPE", pattern: Lexer.NA });
export const LITERAL = createToken({ name: "LITERAL", pattern: Lexer.NA });
export const RELATIONAL_OPERATOR = createToken({
  name: "RELATIONAL_OPERATOR",
  pattern: Lexer.NA,
});
export const EQUALITY_OPERATOR = createToken({
  name: "EQUALITY_OPERATOR",
  pattern: Lexer.NA,
});
export const PRINT = createToken({ name: "PRINT", pattern: Lexer.NA });

export const PUNCTUATION = createToken({
  name: "PUNCTUATION",
  pattern: Lexer.NA,
});

export const LOGIC_OPERATOR = createToken({
  name: "LOGIC_OPERATOR",
  pattern: Lexer.NA,
  categories: PUNCTUATION,
});
export const SHIFT_OPERATOR = createToken({
  name: "SHIFT_OPERATOR",
  pattern: Lexer.NA,
  categories: PUNCTUATION,
});
export const MULTI_OPERATOR = createToken({
  name: "MULTI_OPERATOR",
  pattern: Lexer.NA,
  categories: PUNCTUATION,
});

export const TERMINATOR = createToken({
  name: "TERMINATOR",
  pattern: Lexer.NA,
});

export const UNARY = createToken({
  name: "UNARY",
  pattern: Lexer.NA,
  categories: PUNCTUATION,
});
export const POSTFIX = createToken({
  name: "POSTFIX",
  pattern: Lexer.NA,
  categories: PUNCTUATION,
});
export const ADDICTIVE_OPERATOR = createToken({
  categories: PUNCTUATION,
  name: "ADDICTIVE_OPERATOR",
  pattern: Lexer.NA,
});

export const ATTRIBUTE = createToken({
  name: "ATTRIBUTE",
  pattern: "@",
  line_breaks: false,
});
export const BACK_SLASH = createToken({
  name: "BACK_SLASH",
  pattern: "\\",
  categories: MULTI_OPERATOR,
  line_breaks: false,
});

export const COMMENT_QUOTE = createToken({
  name: "COMMENT_QUOTE",
  pattern: /'[^\n\r]*/,
  line_breaks: false,
});
export const COMMENT_REM = createToken({
  name: "COMMENT_REM",
  pattern: /\b(rem|REM|Rem)\b[^\n\r]*/i,
  line_breaks: false,
});

export const CONDITIONAL_IF = createToken({
  name: "CONDITIONAL_IF",
  pattern: /#\bif\b/,
  line_breaks: false,
});

export const CONDITIONAL_ELSE = createToken({
  name: "CONDITIONAL_ELSE",
  pattern: /#\else\b/,
  line_breaks: false,
});
export const CONDITIONAL_ELSE_IF = createToken({
  name: "CONDITIONAL_ELSE_IF",
  pattern: /#\belse[ ]*if\b/,
});
export const CONDITIONAL_END_IF = createToken({
  name: "CONDITIONAL_END_IF",
  pattern: /#\bend[ ]*if\b/,
});
export const CONDITIONAL_ERROR = createToken({
  name: "CONDITIONAL_ERROR",
  pattern: /#\berror\b[^\n\r]+/,
});
export const CONDITIONAL_CONST = createToken({
  name: "CONDITIONAL_CONST",
  pattern: /#\bconst\b/,
});

export const ELSE_IF = keyword(["Else", "If"]);

export const END_FOR = keyword(["End", "For"]);
export const END_FUNCTION = keyword(["End", "Function"]);
export const END_IF = keyword(["End", "If"]);
export const END_SUB = keyword(["End", "Sub"]);
export const END_WHILE = keyword(["End", "While"]);

export const TRY = keyword("Try");
export const CATCH = keyword("Catch");
export const END_TRY = keyword(["End", "Try"]);
export const AS = keyword("As");
export const EVAL = keyword("Eval");
export const EXIT = keyword("Exit");
export const FOR = keyword("For");
export const GOTO = keyword("Goto");
export const LET = keyword("Let");
export const LIBRARY = keyword("Library");
export const LINE_NUM = keyword("LINE_NUM");
export const ELSE = keyword("Else");
export const END = keyword("End");
export const DIM = keyword("Dim");
export const EACH = keyword("Each");
export const IF = keyword("If");
export const IN = keyword("In");
export const NEXT = keyword("Next");

export const EXIT_FOR = keyword(["Exit", "For"]);
export const EXIT_WHILE = keyword(["Exit", "While"]);

export const TYPE_DECLARATION = createToken({
  name: "TYPE_DECLARATION",
  pattern: /[\$%!#&]/,
});

export const OPEN_BRACKET = createToken({
  name: "OPEN_BRACKET",
  pattern: "[",
  line_breaks: false,
});
export const OPEN_CURLY_BRACE = createToken({
  name: "OPEN_CURLY_BRACE",
  pattern: "{",
  line_breaks: false,
});
export const OPEN_PAREN = createToken({
  name: "OPEN_PAREN",
  pattern: "(",
  line_breaks: false,
});

export const CLOSE_BRACKET = createToken({
  name: "CLOSE_BRACKET",
  pattern: "]",
  line_breaks: false,
});
export const CLOSE_CURLY_BRACE = createToken({
  name: "CLOSE_CURLY_BRACE",
  pattern: "}",
  line_breaks: false,
});
export const CLOSE_PAREN = createToken({
  name: "CLOSE_PAREN",
  pattern: ")",
  line_breaks: false,
});

export const PERIOD = createToken({ name: "PERIOD", pattern: "." });

export const FULL_PRINT = keyword("Print", {
  name: "FULL_PRINT",
  categories: PRINT,
  line_breaks: false,
});
export const SHORT_PRINT = createToken({
  pattern: "?",
  name: "SHORT_PRINT",
  categories: PRINT,
  line_breaks: false,
});

export const RETURN = keyword("return");
export const STEP = keyword("step");
export const STOP = keyword("stop");

export const BOOLEAN = keyword("Boolean", { categories: BASE_TYPE });
export const INTEGER = keyword("Integer", { categories: BASE_TYPE });
export const LONGINTEGER = keyword("LongInteger", { categories: BASE_TYPE });
export const FLOAT = keyword("Float", { categories: BASE_TYPE });
export const DOUBLE = keyword("Double", { categories: BASE_TYPE });
export const STRING = keyword("String", { categories: BASE_TYPE });
export const OBJECT = keyword("Object", { categories: BASE_TYPE });
export const FUNCTION = keyword("Function", { categories: BASE_TYPE });
export const INTERFACE = keyword("Interface", { categories: BASE_TYPE });
export const INVALID = keyword("Invalid", { categories: [BASE_TYPE, LITERAL] });
export const DYNAMIC = keyword("Dynamic", { categories: BASE_TYPE });
export const VOID = keyword("Void", { categories: BASE_TYPE });

export const SUB = keyword("Sub");

export const THEN = keyword("Then");
export const TO = keyword("To");
export const WHILE = keyword("While");

export const STRING_LITERAL = createToken({
  categories: LITERAL,
  name: "STRING_LITERAL",
  pattern: /"([^"]|"")*"/,
});

export const BOOLEAN_LITERAL = createToken({
  name: "BOOLEAN_LITERAL",
  pattern: Lexer.NA,
  categories: LITERAL,
});
export const TRUE = keyword("true", { categories: BOOLEAN_LITERAL });
export const FALSE = keyword("false", { categories: BOOLEAN_LITERAL });

export const NUMBER_LITERAL = createToken({
  categories: LITERAL,
  name: "NUMBER_LITERAL",
  pattern: /(?:\d*\.?\d+|\d+\.?\d*)(?:[eEdD][-+]?\d+)?/,
});

export const HEX_LITERAL = createToken({
  categories: LITERAL,
  name: "HEX_LITERAL",
  pattern: /&[hHFf0-9EeDdCcBbAa]+&?/,
});

export const GREATER_THAN = createToken({
  name: "GREATER_THAN",
  pattern: ">",
  categories: RELATIONAL_OPERATOR,
});
export const GREATER_THAN_EQUAL = createToken({
  categories: RELATIONAL_OPERATOR,
  name: "GREATER_THAN_EQUAL",
  pattern: ">=",
});
export const LESS_THAN = createToken({
  name: "LESS_THAN",
  pattern: "<",
  categories: RELATIONAL_OPERATOR,
});
export const LESS_THAN_EQUAL = createToken({
  name: "LESS_THAN_EQUAL",
  pattern: "<=",
  categories: RELATIONAL_OPERATOR,
});
export const NOT_EQUAL = createToken({
  name: "NOT_EQUAL",
  pattern: "<>",
  categories: RELATIONAL_OPERATOR,
});

export const EQUAL = createToken({
  name: "EQUAL",
  pattern: "=",
  categories: EQUALITY_OPERATOR,
});
export const OP_ASSIGNMENT_ADD = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_ADD",
  pattern: "+=",
});
export const OP_ASSIGNMENT_BITSHIFT_LEFT = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_BITSHIFT_LEFT",
  pattern: "<<=",
});
export const OP_ASSIGNMENT_BITSHIFT_RIGHT = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_BITSHIFT_RIGHT",
  pattern: ">>=",
});

export const OP_ASSIGNMENT_DIVISION = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_DIVISION",
  pattern: "/=",
});

// prettier-ignore
export const OP_ASSIGNMENT_INTEGER_DIVISION = createToken({ name: 'OP_ASSIGNMENT_INTEGER_DIVISION', pattern: '\\=',   categories: EQUALITY_OPERATOR })

export const OP_ASSIGNMENT_MULTIPLY = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_MULTIPLY",
  pattern: "*=",
});
export const OP_ASSIGNMENT_SUBTRACT = createToken({
  categories: EQUALITY_OPERATOR,
  name: "OP_ASSIGNMENT_SUBTRACT",
  pattern: "-=",
});

export const COMMA = createToken({ name: "COMMA", pattern: "," });

export const COLON = createToken({
  name: "COLON",
  pattern: ":",
  categories: TERMINATOR,
});
export const NEWLINE = createToken({
  categories: TERMINATOR,
  line_breaks: true,
  name: "NEWLINE",
  pattern: /\s*[\n\r]+/,
});

export const MOD = keyword("Mod", { categories: LOGIC_OPERATOR });
export const OR = keyword("Or", { categories: LOGIC_OPERATOR });
export const NOT = keyword("Not", { categories: [LOGIC_OPERATOR, UNARY] });
export const AND = keyword("And", { categories: LOGIC_OPERATOR });

export const SEMICOLON = createToken({
  name: "SEMICOLON",
  pattern: ";",
  categories: TERMINATOR,
});

export const DECREMENT = createToken({
  name: "DECREMENT",
  pattern: "--",
  categories: [UNARY, POSTFIX],
});
export const INCREMENT = createToken({
  name: "INCREMENT",
  pattern: "++",
  categories: [UNARY, POSTFIX],
});
export const BITSHIFT_LEFT = createToken({
  name: "BITSHIFT_LEFT",
  pattern: "<<",
  categories: SHIFT_OPERATOR,
});
export const BITSHIFT_RIGHT = createToken({
  name: "BITSHIFT_RIGHT",
  pattern: ">>",
  categories: SHIFT_OPERATOR,
});
export const OP_DIVIDE = createToken({
  name: "OP_DIVIDE",
  pattern: "/",
  categories: MULTI_OPERATOR,
});
export const OP_MULTIPLE = createToken({
  name: "OP_MULTIPLE",
  pattern: "*",
  categories: MULTI_OPERATOR,
});
export const OP_PLUS = createToken({
  name: "OP_PLUS",
  pattern: "+",
  categories: [ADDICTIVE_OPERATOR, UNARY],
});
export const OP_MINUS = createToken({
  name: "OP_MINUS",
  pattern: "-",
  categories: [ADDICTIVE_OPERATOR, UNARY],
});
export const OP_EXPONENT = createToken({
  name: "OP_EXPONENT",
  pattern: "^",
  categories: MULTI_OPERATOR,
});

export const ALL_TOKENS = [
  // First
  NEWLINE,
  WS,
  COMMENT_QUOTE,
  COMMENT_REM,
  LITERAL,
  STRING_LITERAL,
  BOOLEAN_LITERAL,
  TRUE,
  FALSE,
  HEX_LITERAL,
  NUMBER_LITERAL,

  //

  AS,

  OP_ASSIGNMENT_ADD,
  OP_ASSIGNMENT_MULTIPLY,
  OP_ASSIGNMENT_SUBTRACT,
  OP_MULTIPLE,
  OP_ASSIGNMENT_INTEGER_DIVISION,
  OP_ASSIGNMENT_DIVISION,
  OP_ASSIGNMENT_BITSHIFT_LEFT,
  OP_ASSIGNMENT_BITSHIFT_RIGHT,

  LOGIC_OPERATOR,
  EQUALITY_OPERATOR,
  RELATIONAL_OPERATOR,
  SHIFT_OPERATOR,
  ADDICTIVE_OPERATOR,
  MULTI_OPERATOR,
  PUNCTUATION,

  ATTRIBUTE,
  BACK_SLASH,

  OP_EXPONENT,
  CLOSE_BRACKET,
  CLOSE_CURLY_BRACE,
  CLOSE_PAREN,

  TERMINATOR,
  COLON,
  COMMA,

  CONDITIONAL_CONST,
  CONDITIONAL_ERROR,

  CONDITIONAL_ELSE_IF,
  CONDITIONAL_END_IF,
  CONDITIONAL_ELSE,
  CONDITIONAL_IF,

  DIM,

  // DOUBLE_QUOTE,

  END_FOR,
  END_FUNCTION,
  END_IF,
  END_SUB,
  END_WHILE,
  TRY,
  CATCH,
  END_TRY,

  ELSE_IF,

  ELSE,
  END,
  EACH,

  NOT_EQUAL,

  EXIT_FOR,
  EXIT_WHILE,
  EXIT,
  FOR,

  DECREMENT,
  INCREMENT,

  OP_DIVIDE,
  OP_PLUS,
  OP_MINUS,

  UNARY,
  POSTFIX,
  FUNCTION,

  GOTO,
  GREATER_THAN_EQUAL,
  BITSHIFT_RIGHT,
  GREATER_THAN,

  LESS_THAN_EQUAL,
  BITSHIFT_LEFT,
  LESS_THAN,
  LET,
  LIBRARY,
  LINE_NUM,

  MOD,
  NEXT,

  AND,
  NOT,
  OR,

  BASE_TYPE,
  BOOLEAN,
  DOUBLE,
  STRING,
  INTEGER,
  LONGINTEGER,
  FLOAT,
  DYNAMIC,
  INTERFACE,
  VOID,
  OBJECT,

  OPEN_BRACKET,
  OPEN_CURLY_BRACE,
  OPEN_PAREN,

  IF,
  IN,

  PERIOD,

  PRINT,
  FULL_PRINT,
  SHORT_PRINT,

  RETURN,
  SEMICOLON,
  STEP,
  STOP,

  SUB,
  THEN,
  TO,

  WHILE,

  EQUAL,

  // Last
  IDENTIFIER,
  TYPE_DECLARATION,
];
