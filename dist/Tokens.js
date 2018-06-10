"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
exports.WS = chevrotain_1.createToken({
    group: chevrotain_1.Lexer.SKIPPED,
    name: 'WS',
    pattern: /[\s\t]+/
});
exports.IDENTIFIER = chevrotain_1.createToken({ name: 'IDENTIFIER', pattern: /([A-Za-z_]+[A-Za-z0-9_]*)/ });
const keyword = (words, opts = {}) => {
    if (!Array.isArray(words)) {
        words = [words];
    }
    const term = words[0].toLowerCase();
    const name = words.map((word) => word.toUpperCase()).join('_');
    const re = new RegExp(`\\b${words.join('[ \\t]*')}\\b`, 'iy');
    const pattern = (text, startOffset) => {
        re.lastIndex = startOffset;
        return re.exec(text);
    };
    const hint = term.substr(0, 1);
    const start_chars_hint = hint.toUpperCase() === hint.toLowerCase() ? [hint.toUpperCase()] : [hint.toUpperCase(), hint.toLowerCase()];
    return chevrotain_1.createToken(Object.assign({ name, pattern, longer_alt: exports.IDENTIFIER, start_chars_hint }, opts));
};
exports.BASE_TYPE = chevrotain_1.createToken({ name: 'BASE_TYPE', pattern: chevrotain_1.Lexer.NA });
exports.LITERAL = chevrotain_1.createToken({ name: 'LITERAL', pattern: chevrotain_1.Lexer.NA });
exports.RELATIONAL_OPERATOR = chevrotain_1.createToken({ name: 'RELATIONAL_OPERATOR', pattern: chevrotain_1.Lexer.NA });
exports.EQUALITY_OPERATOR = chevrotain_1.createToken({ name: 'EQUALITY_OPERATOR', pattern: chevrotain_1.Lexer.NA });
exports.PRINT = chevrotain_1.createToken({ name: 'PRINT', pattern: chevrotain_1.Lexer.NA });
exports.PUNCTUATION = chevrotain_1.createToken({ name: 'PUNCTUATION', pattern: chevrotain_1.Lexer.NA });
exports.LOGIC_OPERATOR = chevrotain_1.createToken({ name: 'LOGIC_OPERATOR', pattern: chevrotain_1.Lexer.NA, categories: exports.PUNCTUATION });
exports.SHIFT_OPERATOR = chevrotain_1.createToken({ name: 'SHIFT_OPERATOR', pattern: chevrotain_1.Lexer.NA, categories: exports.PUNCTUATION });
exports.MULTI_OPERATOR = chevrotain_1.createToken({ name: 'MULTI_OPERATOR', pattern: chevrotain_1.Lexer.NA, categories: exports.PUNCTUATION });
exports.TERMINATOR = chevrotain_1.createToken({ name: 'TERMINATOR', pattern: chevrotain_1.Lexer.NA });
exports.UNARY = chevrotain_1.createToken({ name: 'UNARY', pattern: chevrotain_1.Lexer.NA, categories: exports.PUNCTUATION });
exports.POSTFIX = chevrotain_1.createToken({ name: 'POSTFIX', pattern: chevrotain_1.Lexer.NA, categories: exports.PUNCTUATION });
exports.ADDICTIVE_OPERATOR = chevrotain_1.createToken({
    categories: exports.PUNCTUATION,
    name: 'ADDICTIVE_OPERATOR',
    pattern: chevrotain_1.Lexer.NA
});
exports.ATTRIBUTE = chevrotain_1.createToken({ name: 'ATTRIBUTE', pattern: '@' });
exports.BACK_SLASH = chevrotain_1.createToken({ name: 'BACK_SLASH', pattern: '\\', categories: exports.MULTI_OPERATOR });
exports.COMMENT_QUOTE = chevrotain_1.createToken({ name: 'COMMENT_QUOTE', pattern: /'[^\n\r]*/ });
exports.COMMENT_REM = chevrotain_1.createToken({ name: 'COMMENT_REM', pattern: /\b(rem|REM|Rem)\b[^\n\r]*/i });
exports.CONDITIONAL_IF = chevrotain_1.createToken({ name: 'CONDITIONAL_IF', pattern: /#\bif\b/ });
exports.CONDITIONAL_ELSE = chevrotain_1.createToken({ name: 'CONDITIONAL_ELSE', pattern: /#\else\b/ });
exports.CONDITIONAL_ELSE_IF = chevrotain_1.createToken({ name: 'CONDITIONAL_ELSE_IF', pattern: /#\belse[ ]*if\b/ });
exports.CONDITIONAL_END_IF = chevrotain_1.createToken({ name: 'CONDITIONAL_END_IF', pattern: /#\bend[ ]*if\b/ });
exports.CONDITIONAL_ERROR = chevrotain_1.createToken({ name: 'CONDITIONAL_ERROR', pattern: /#\berror\b[^\n\r]+/ });
exports.CONDITIONAL_CONST = chevrotain_1.createToken({ name: 'CONDITIONAL_CONST', pattern: /#\bconst\b/ });
exports.ELSE_IF = keyword(['Else', 'If']);
exports.END_FOR = keyword(['End', 'For']);
exports.END_FUNCTION = keyword(['End', 'Function']);
exports.END_IF = keyword(['End', 'If']);
exports.END_SUB = keyword(['End', 'Sub']);
exports.END_WHILE = keyword(['End', 'While']);
exports.AS = keyword('As');
exports.EVAL = keyword('Eval');
exports.EXIT = keyword('Exit');
exports.FOR = keyword('For');
exports.GOTO = keyword('Goto');
exports.LET = keyword('Let');
exports.LIBRARY = keyword('Library');
exports.LINE_NUM = keyword('LINE_NUM');
exports.ELSE = keyword('Else');
exports.END = keyword('End');
exports.DIM = keyword('Dim');
exports.EACH = keyword('Each');
exports.IF = keyword('If');
exports.IN = keyword('In');
exports.NEXT = keyword('Next');
exports.EXIT_FOR = keyword(['Exit', 'For']);
exports.EXIT_WHILE = keyword(['Exit', 'While']);
exports.TYPE_DECLARATION = chevrotain_1.createToken({
    name: 'TYPE_DECLARATION',
    pattern: /[\$%!#&]/
});
exports.OPEN_BRACKET = chevrotain_1.createToken({ name: 'OPEN_BRACKET', pattern: '[' });
exports.OPEN_CURLY_BRACE = chevrotain_1.createToken({ name: 'OPEN_CURLY_BRACE', pattern: '{' });
exports.OPEN_PAREN = chevrotain_1.createToken({ name: 'OPEN_PAREN', pattern: '(' });
exports.CLOSE_BRACKET = chevrotain_1.createToken({ name: 'CLOSE_BRACKET', pattern: ']' });
exports.CLOSE_CURLY_BRACE = chevrotain_1.createToken({ name: 'CLOSE_CURLY_BRACE', pattern: '}' });
exports.CLOSE_PAREN = chevrotain_1.createToken({ name: 'CLOSE_PAREN', pattern: ')' });
exports.PERIOD = chevrotain_1.createToken({ name: 'PERIOD', pattern: '.' });
exports.FULL_PRINT = keyword('Print', { name: 'FULL_PRINT', categories: exports.PRINT });
exports.SHORT_PRINT = chevrotain_1.createToken({ pattern: '?', name: 'SHORT_PRINT', categories: exports.PRINT });
exports.RETURN = keyword('return');
exports.STEP = keyword('step');
exports.STOP = keyword('stop');
exports.BOOLEAN = keyword('Boolean', { categories: exports.BASE_TYPE });
exports.INTEGER = keyword('Integer', { categories: exports.BASE_TYPE });
exports.LONGINTEGER = keyword('LongInteger', { categories: exports.BASE_TYPE });
exports.FLOAT = keyword('Float', { categories: exports.BASE_TYPE });
exports.DOUBLE = keyword('Double', { categories: exports.BASE_TYPE });
exports.STRING = keyword('String', { categories: exports.BASE_TYPE });
exports.OBJECT = keyword('Object', { categories: exports.BASE_TYPE });
exports.FUNCTION = keyword('Function', { categories: exports.BASE_TYPE });
exports.INTERFACE = keyword('Interface', { categories: exports.BASE_TYPE });
exports.INVALID = keyword('Invalid', { categories: [exports.BASE_TYPE, exports.LITERAL] });
exports.DYNAMIC = keyword('Dynamic', { categories: exports.BASE_TYPE });
exports.VOID = keyword('Void', { categories: exports.BASE_TYPE });
exports.SUB = keyword('Sub');
exports.THEN = keyword('Then');
exports.TO = keyword('To');
exports.WHILE = keyword('While');
exports.STRING_LITERAL = chevrotain_1.createToken({
    categories: exports.LITERAL,
    name: 'STRING_LITERAL',
    pattern: /"([^"]|"")*"/
});
exports.BOOLEAN_LITERAL = chevrotain_1.createToken({ name: 'BOOLEAN_LITERAL', pattern: chevrotain_1.Lexer.NA, categories: exports.LITERAL });
exports.TRUE = keyword('true', { categories: exports.BOOLEAN_LITERAL });
exports.FALSE = keyword('false', { categories: exports.BOOLEAN_LITERAL });
exports.NUMBER_LITERAL = chevrotain_1.createToken({
    categories: exports.LITERAL,
    name: 'NUMBER_LITERAL',
    pattern: /(?:\d*\.?\d+|\d+\.?\d*)(?:[eEdD][-+]?\d+)?/
});
exports.HEX_LITERAL = chevrotain_1.createToken({
    categories: exports.LITERAL,
    name: 'HEX_LITERAL',
    pattern: /&[hHFf0-9EeDdCcBbAa]+&?/
});
exports.GREATER_THAN = chevrotain_1.createToken({ name: 'GREATER_THAN', pattern: '>', categories: exports.RELATIONAL_OPERATOR });
exports.GREATER_THAN_EQUAL = chevrotain_1.createToken({
    categories: exports.RELATIONAL_OPERATOR,
    name: 'GREATER_THAN_EQUAL',
    pattern: '>='
});
exports.LESS_THAN = chevrotain_1.createToken({ name: 'LESS_THAN', pattern: '<', categories: exports.RELATIONAL_OPERATOR });
exports.LESS_THAN_EQUAL = chevrotain_1.createToken({ name: 'LESS_THAN_EQUAL', pattern: '<=', categories: exports.RELATIONAL_OPERATOR });
exports.NOT_EQUAL = chevrotain_1.createToken({ name: 'NOT_EQUAL', pattern: '<>', categories: exports.RELATIONAL_OPERATOR });
exports.EQUAL = chevrotain_1.createToken({ name: 'EQUAL', pattern: '=', categories: exports.EQUALITY_OPERATOR });
exports.OP_ASSIGNMENT_ADD = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_ADD',
    pattern: '+='
});
exports.OP_ASSIGNMENT_BITSHIFT_LEFT = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_BITSHIFT_LEFT',
    pattern: '<<='
});
exports.OP_ASSIGNMENT_BITSHIFT_RIGHT = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_BITSHIFT_RIGHT',
    pattern: '>>='
});
exports.OP_ASSIGNMENT_DIVISION = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_DIVISION',
    pattern: '/='
});
exports.OP_ASSIGNMENT_INTEGER_DIVISION = chevrotain_1.createToken({ name: 'OP_ASSIGNMENT_INTEGER_DIVISION', pattern: '\\=', categories: exports.EQUALITY_OPERATOR });
exports.OP_ASSIGNMENT_MULTIPLY = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_MULTIPLY',
    pattern: '*='
});
exports.OP_ASSIGNMENT_SUBTRACT = chevrotain_1.createToken({
    categories: exports.EQUALITY_OPERATOR,
    name: 'OP_ASSIGNMENT_SUBTRACT',
    pattern: '-='
});
exports.COMMA = chevrotain_1.createToken({ name: 'COMMA', pattern: ',' });
exports.COLON = chevrotain_1.createToken({ name: 'COLON', pattern: ':', categories: exports.TERMINATOR });
exports.NEWLINE = chevrotain_1.createToken({
    categories: exports.TERMINATOR,
    line_breaks: true,
    name: 'NEWLINE',
    pattern: /\s*[\n\r]+/
});
exports.MOD = keyword('Mod', { categories: exports.LOGIC_OPERATOR });
exports.OR = keyword('Or', { categories: exports.LOGIC_OPERATOR });
exports.NOT = keyword('Not', { categories: [exports.LOGIC_OPERATOR, exports.UNARY] });
exports.AND = keyword('And', { categories: exports.LOGIC_OPERATOR });
exports.SEMICOLON = chevrotain_1.createToken({ name: 'SEMICOLON', pattern: ';', categories: exports.TERMINATOR });
exports.DECREMENT = chevrotain_1.createToken({ name: 'DECREMENT', pattern: '--', categories: [exports.UNARY, exports.POSTFIX] });
exports.INCREMENT = chevrotain_1.createToken({ name: 'INCREMENT', pattern: '++', categories: [exports.UNARY, exports.POSTFIX] });
exports.BITSHIFT_LEFT = chevrotain_1.createToken({ name: 'BITSHIFT_LEFT', pattern: '<<', categories: exports.SHIFT_OPERATOR });
exports.BITSHIFT_RIGHT = chevrotain_1.createToken({ name: 'BITSHIFT_RIGHT', pattern: '>>', categories: exports.SHIFT_OPERATOR });
exports.OP_DIVIDE = chevrotain_1.createToken({ name: 'OP_DIVIDE', pattern: '/', categories: exports.MULTI_OPERATOR });
exports.OP_MULTIPLE = chevrotain_1.createToken({ name: 'OP_MULTIPLE', pattern: '*', categories: exports.MULTI_OPERATOR });
exports.OP_PLUS = chevrotain_1.createToken({ name: 'OP_PLUS', pattern: '+', categories: [exports.ADDICTIVE_OPERATOR, exports.UNARY] });
exports.OP_MINUS = chevrotain_1.createToken({ name: 'OP_MINUS', pattern: '-', categories: [exports.ADDICTIVE_OPERATOR, exports.UNARY] });
exports.OP_EXPONENT = chevrotain_1.createToken({ name: 'OP_EXPONENT', pattern: '^', categories: exports.MULTI_OPERATOR });
exports.ALL_TOKENS = [
    exports.NEWLINE,
    exports.WS,
    exports.COMMENT_QUOTE,
    exports.COMMENT_REM,
    exports.LITERAL,
    exports.STRING_LITERAL,
    exports.BOOLEAN_LITERAL,
    exports.TRUE,
    exports.FALSE,
    exports.HEX_LITERAL,
    exports.NUMBER_LITERAL,
    exports.AS,
    exports.OP_ASSIGNMENT_ADD,
    exports.OP_ASSIGNMENT_MULTIPLY,
    exports.OP_ASSIGNMENT_SUBTRACT,
    exports.OP_MULTIPLE,
    exports.OP_ASSIGNMENT_INTEGER_DIVISION,
    exports.OP_ASSIGNMENT_DIVISION,
    exports.OP_ASSIGNMENT_BITSHIFT_LEFT,
    exports.OP_ASSIGNMENT_BITSHIFT_RIGHT,
    exports.LOGIC_OPERATOR,
    exports.EQUALITY_OPERATOR,
    exports.RELATIONAL_OPERATOR,
    exports.SHIFT_OPERATOR,
    exports.ADDICTIVE_OPERATOR,
    exports.MULTI_OPERATOR,
    exports.PUNCTUATION,
    exports.ATTRIBUTE,
    exports.BACK_SLASH,
    exports.OP_EXPONENT,
    exports.CLOSE_BRACKET,
    exports.CLOSE_CURLY_BRACE,
    exports.CLOSE_PAREN,
    exports.TERMINATOR,
    exports.COLON,
    exports.COMMA,
    exports.CONDITIONAL_CONST,
    exports.CONDITIONAL_ERROR,
    exports.CONDITIONAL_ELSE_IF,
    exports.CONDITIONAL_END_IF,
    exports.CONDITIONAL_ELSE,
    exports.CONDITIONAL_IF,
    exports.DIM,
    exports.END_FOR,
    exports.END_FUNCTION,
    exports.END_IF,
    exports.END_SUB,
    exports.END_WHILE,
    exports.ELSE_IF,
    exports.ELSE,
    exports.END,
    exports.EACH,
    exports.NOT_EQUAL,
    exports.EXIT_FOR,
    exports.EXIT_WHILE,
    exports.EXIT,
    exports.FOR,
    exports.DECREMENT,
    exports.INCREMENT,
    exports.OP_DIVIDE,
    exports.OP_PLUS,
    exports.OP_MINUS,
    exports.UNARY,
    exports.POSTFIX,
    exports.FUNCTION,
    exports.GOTO,
    exports.GREATER_THAN_EQUAL,
    exports.BITSHIFT_RIGHT,
    exports.GREATER_THAN,
    exports.LESS_THAN_EQUAL,
    exports.BITSHIFT_LEFT,
    exports.LESS_THAN,
    exports.LET,
    exports.LIBRARY,
    exports.LINE_NUM,
    exports.MOD,
    exports.NEXT,
    exports.AND,
    exports.NOT,
    exports.OR,
    exports.BASE_TYPE,
    exports.BOOLEAN,
    exports.DOUBLE,
    exports.STRING,
    exports.INTEGER,
    exports.LONGINTEGER,
    exports.FLOAT,
    exports.DYNAMIC,
    exports.INTERFACE,
    exports.VOID,
    exports.OBJECT,
    exports.OPEN_BRACKET,
    exports.OPEN_CURLY_BRACE,
    exports.OPEN_PAREN,
    exports.IF,
    exports.IN,
    exports.PERIOD,
    exports.PRINT,
    exports.FULL_PRINT,
    exports.SHORT_PRINT,
    exports.RETURN,
    exports.SEMICOLON,
    exports.STEP,
    exports.STOP,
    exports.SUB,
    exports.THEN,
    exports.TO,
    exports.WHILE,
    exports.EQUAL,
    exports.IDENTIFIER,
    exports.TYPE_DECLARATION
];
