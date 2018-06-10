"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTVisitor_1 = require("./ASTVisitor");
exports.ASTVisitor = ASTVisitor_1.ASTVisitor;
const RokuBRSParser_1 = require("./RokuBRSParser");
exports.parse = RokuBRSParser_1.parse;
exports.RokuBRSParser = RokuBRSParser_1.RokuBRSParser;
const Tokens_1 = require("./Tokens");
exports.ALL_TOKENS = Tokens_1.ALL_TOKENS;
const VisitorKeys_1 = require("./VisitorKeys");
exports.visitorKeys = VisitorKeys_1.visitorKeys;
const visitor = new ASTVisitor_1.ASTVisitor();
const ast = (source) => {
    const { value, tokens, parseErrors, lexErrors } = RokuBRSParser_1.parse(source);
    const props = { tokens, parseErrors, lexErrors, parent: null };
    const tree = visitor.visit(value, props);
    if (parseErrors.length) {
        const { message, token } = parseErrors[0];
        const err = new SyntaxError(message);
        err.lineNumber = token.startLine;
        err.column = token.startColumn;
        throw err;
    }
    return tree;
};
exports.ast = ast;
