"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const Tokens_1 = require("./Tokens");
const BRSLexer = new chevrotain_1.Lexer(Tokens_1.ALL_TOKENS, {
    deferDefinitionErrorsHandling: true,
    ensureOptimizations: true,
    positionTracking: 'full'
});
const operator = { LABEL: 'operator' };
const right = { LABEL: 'right' };
const left = { LABEL: 'left' };
const body = { LABEL: 'body' };
const Declaration = { LABEL: 'Declaration' };
const Empty = { LABEL: 'Empty' };
const Statement = { LABEL: 'Statement' };
class RokuBRSParser extends chevrotain_1.Parser {
    constructor(input) {
        super(input, Tokens_1.ALL_TOKENS, {
            outputCst: true,
            recoveryEnabled: false
        });
        this.Program = this.RULE('Program', () => {
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.FunctionDeclaration, Declaration) },
                    { ALT: () => this.SUBRULE(this.LibraryStatement, Declaration) },
                    { ALT: () => this.SUBRULE(this.SubDeclaration, Declaration) },
                    { ALT: () => this.SUBRULE(this.ConditionalCompilationStatement, Declaration) },
                    { ALT: () => this.SUBRULE(this.EmptyStatement, Empty) },
                    { ALT: () => this.SUBRULE(this.Comment, Declaration) }
                ]);
            });
            this.OPTION(() => {
                this.CONSUME(chevrotain_1.EOF);
            });
        });
        this.BlockStatement = this.RULE('BlockStatement', () => {
            this.MANY(() => {
                this.OR([{ ALT: () => this.SUBRULE(this.Statement, body) }, { ALT: () => this.CONSUME(Tokens_1.TERMINATOR) }]);
            });
        });
        this.Statement = this.RULE('Statement', () => {
            this.OR2(this.cacheStatement ||
                (this.cacheStatement = [
                    { ALT: () => this.SUBRULE(this.EmptyStatement, Empty) },
                    { ALT: () => this.SUBRULE(this.ForStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.IfStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.ForEachStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.WhileStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.PrintStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.ReturnStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.StopStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.GoToStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.LabeledStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.ConditionalCompilationStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.DimStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.NextStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.ExitStatement, Statement) },
                    { ALT: () => this.SUBRULE(this.ExpressionStatement, Statement) }
                ]));
            this.OPTION(() => {
                this.SUBRULE2(this.Comment, { LABEL: 'trailingComments' });
            });
        });
        this.ArrayExpression = this.RULE('ArrayExpression', () => {
            this.CONSUME(Tokens_1.OPEN_BRACKET);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.ArrayElement, { LABEL: 'elements' }) },
                    { ALT: () => this.CONSUME(Tokens_1.COMMA) },
                    { ALT: () => this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' }) }
                ]);
            });
            this.CONSUME(Tokens_1.CLOSE_BRACKET);
        });
        this.ObjectExpression = this.RULE('ObjectExpression', () => {
            this.CONSUME(Tokens_1.OPEN_CURLY_BRACE);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.Property, { LABEL: 'properties' }) },
                    { ALT: () => this.CONSUME(Tokens_1.COMMA) },
                    { ALT: () => this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' }) }
                ]);
            });
            this.CONSUME(Tokens_1.CLOSE_CURLY_BRACE);
        });
        this.Property = this.RULE('Property', () => {
            this.SUBRULE(this.PropertyName, { LABEL: 'key' });
            this.CONSUME(Tokens_1.COLON);
            this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' });
        });
        this.ArrayElement = this.RULE('ArrayElement', () => {
            this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' });
            this.OPTION(() => {
                this.CONSUME(Tokens_1.COMMA);
            });
        });
        this.PropertyName = this.RULE('PropertyName', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.Identifier) },
                { ALT: () => this.SUBRULE(this.ReservedWord) },
                { ALT: () => this.CONSUME(Tokens_1.STRING_LITERAL) },
                { ALT: () => this.CONSUME(Tokens_1.NUMBER_LITERAL) }
            ]);
        });
        this.DimStatement = this.RULE('DimStatement', () => {
            this.CONSUME(Tokens_1.DIM);
            this.SUBRULE(this.Identifier);
            this.SUBRULE(this.ArrayExpression);
        });
        this.EmptyStatement = this.RULE('EmptyStatement', () => {
            this.OPTION(() => {
                this.SUBRULE2(this.Comment, { LABEL: 'trailingComments' });
            });
            this.CONSUME(Tokens_1.NEWLINE);
        });
        this.ExitStatement = this.RULE('ExitStatement', () => {
            this.OR([
                { ALT: () => this.CONSUME(Tokens_1.EXIT_WHILE) },
                { ALT: () => this.CONSUME(Tokens_1.EXIT_FOR) }
            ]);
        });
        this.IfStatement = this.RULE('IfStatement', () => {
            let isBlock = false;
            this.CONSUME(Tokens_1.IF);
            this.SUBRULE1(this.ExpressionStatement, { LABEL: 'test' });
            this.OPTION1(() => {
                this.CONSUME(Tokens_1.THEN);
            });
            this.OPTION2(() => {
                this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
                isBlock = true;
            });
            this.OPTION4(() => {
                if (isBlock) {
                    this.SUBRULE2(this.BlockStatement, { LABEL: 'consequent' });
                }
                else {
                    this.SUBRULE2(this.Statement, { LABEL: 'consequent' });
                }
            });
            this.MANY(() => {
                this.SUBRULE(this.ElseIfStatement, { LABEL: 'alternate' });
            });
            this.OPTION5(() => {
                this.SUBRULE(this.ElseStatement, { LABEL: 'alternate' });
            });
            this.OPTION6(() => {
                this.CONSUME(Tokens_1.END_IF);
            });
        });
        this.ElseIfStatement = this.RULE('ElseIfStatement', () => {
            this.CONSUME(Tokens_1.ELSE_IF);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' });
            this.OPTION1(() => {
                this.CONSUME(Tokens_1.THEN);
            });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.OPTION5(() => {
                this.SUBRULE2(this.BlockStatement, body);
            });
        });
        this.ElseStatement = this.RULE('ElseStatement', () => {
            let isBlock = false;
            this.CONSUME(Tokens_1.ELSE);
            this.OPTION1(() => {
                this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
                isBlock = true;
            });
            this.OPTION2(() => {
                if (isBlock) {
                    this.SUBRULE2(this.BlockStatement, body);
                }
                else {
                    this.SUBRULE2(this.Statement, body);
                }
            });
        });
        this.ForStatement = this.RULE('ForStatement', () => {
            this.CONSUME(Tokens_1.FOR);
            this.SUBRULE1(this.Identifier, { LABEL: 'counter' });
            this.CONSUME(Tokens_1.EQUAL);
            this.SUBRULE(this.AssignmentExpression, { LABEL: 'init' });
            this.CONSUME(Tokens_1.TO);
            this.SUBRULE2(this.ExpressionStatement, { LABEL: 'test' });
            this.OPTION(() => {
                this.CONSUME(Tokens_1.STEP);
                this.SUBRULE3(this.ExpressionStatement, { LABEL: 'update' });
            });
            this.SUBRULE4(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.OPTION5(() => {
                this.SUBRULE5(this.BlockStatement, body);
            });
            this.OPTION1(() => {
                this.SUBRULE(this.NextStatement);
            });
            this.OPTION2(() => {
                this.CONSUME(Tokens_1.END_FOR);
            });
        });
        this.ForEachStatement = this.RULE('ForEachStatement', () => {
            this.CONSUME(Tokens_1.FOR);
            this.CONSUME(Tokens_1.EACH);
            this.SUBRULE1(this.Identifier, { LABEL: 'counter' });
            this.CONSUME(Tokens_1.IN);
            this.SUBRULE2(this.ExpressionStatement, { LABEL: 'countExpression' });
            this.SUBRULE3(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.SUBRULE(this.BlockStatement, body);
            this.OPTION1(() => {
                this.SUBRULE(this.NextStatement);
            });
            this.OPTION2(() => {
                this.CONSUME(Tokens_1.END_FOR);
            });
        });
        this.GoToStatement = this.RULE('GoToStatement', () => {
            this.CONSUME(Tokens_1.GOTO);
            this.SUBRULE1(this.Identifier);
        });
        this.LabeledStatement = this.RULE('LabeledStatement', () => {
            this.SUBRULE(this.Identifier, { LABEL: 'label' });
            this.CONSUME(Tokens_1.COLON);
            this.CONSUME(Tokens_1.NEWLINE);
        });
        this.LibraryStatement = this.RULE('LibraryStatement', () => {
            this.CONSUME(Tokens_1.LIBRARY);
            this.CONSUME(Tokens_1.STRING_LITERAL, { LABEL: 'path' });
        });
        this.NextStatement = this.RULE('NextStatement', () => {
            this.CONSUME(Tokens_1.NEXT);
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
        });
        this.PrintStatement = this.RULE('PrintStatement', () => {
            this.CONSUME(Tokens_1.PRINT);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.ExpressionStatement, { LABEL: 'value' }) },
                    { ALT: () => this.CONSUME(Tokens_1.COMMA) },
                    { ALT: () => this.CONSUME(Tokens_1.SEMICOLON) }
                ]);
            });
        });
        this.ReturnStatement = this.RULE('ReturnStatement', () => {
            this.CONSUME(Tokens_1.RETURN);
            this.OPTION1(() => {
                this.SUBRULE(this.ExpressionStatement, { LABEL: 'argument' });
            });
        });
        this.StopStatement = this.RULE('StopStatement', () => {
            this.CONSUME(Tokens_1.STOP);
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
        });
        this.WhileStatement = this.RULE('WhileStatement', () => {
            this.CONSUME(Tokens_1.WHILE);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.SUBRULE(this.BlockStatement, body);
            this.CONSUME(Tokens_1.END_WHILE);
        });
        this.FunctionExpression = this.RULE('FunctionExpression', () => {
            this.CONSUME(Tokens_1.FUNCTION);
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList, { LABEL: 'params' });
            });
            this.OPTION1(() => {
                this.CONSUME(Tokens_1.AS);
                this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' });
            });
            this.OPTION2(() => {
                this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            });
            this.OPTION3(() => {
                this.SUBRULE(this.BlockStatement, body);
            });
            this.CONSUME(Tokens_1.END_FUNCTION);
        });
        this.FunctionDeclaration = this.RULE('FunctionDeclaration', () => {
            this.CONSUME(Tokens_1.FUNCTION);
            this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' });
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList, { LABEL: 'params' });
            });
            this.OPTION1(() => {
                this.CONSUME(Tokens_1.AS);
                this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' });
            });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.OPTION3(() => {
                this.SUBRULE(this.BlockStatement, body);
            });
            this.CONSUME(Tokens_1.END_FUNCTION);
        });
        this.SubExpression = this.RULE('SubExpression', () => {
            this.CONSUME(Tokens_1.SUB);
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList, { LABEL: 'params' });
            });
            this.OPTION1(() => {
                this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            });
            this.OPTION2(() => {
                this.SUBRULE(this.BlockStatement, body);
            });
            this.CONSUME(Tokens_1.END_SUB);
        });
        this.SubDeclaration = this.RULE('SubDeclaration', () => {
            this.CONSUME(Tokens_1.SUB);
            this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' });
            this.OPTION1(() => {
                this.SUBRULE(this.ParameterList, { LABEL: 'params' });
            });
            this.OPTION2(() => {
                this.CONSUME(Tokens_1.AS);
                this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' });
            });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.OPTION3(() => {
                this.SUBRULE(this.BlockStatement, body);
            });
            this.CONSUME(Tokens_1.END_SUB);
        });
        this.ParameterList = this.RULE('ParameterList', () => {
            this.CONSUME(Tokens_1.OPEN_PAREN);
            this.MANY_SEP({
                SEP: Tokens_1.COMMA,
                DEF() {
                    this.SUBRULE2(this.Parameter);
                }
            });
            this.CONSUME(Tokens_1.CLOSE_PAREN);
        });
        this.Parameter = this.RULE('Parameter', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.Literal) },
                { ALT: () => this.SUBRULE(this.Identifier) },
                { ALT: () => this.SUBRULE(this.ReservedWord) }
            ]);
            this.OPTION(() => {
                this.OPTION1(() => {
                    this.CONSUME(Tokens_1.EQUAL);
                    this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' });
                });
                this.OPTION2(() => {
                    this.CONSUME(Tokens_1.AS);
                    this.SUBRULE(this.TypeAnnotation);
                });
            });
        });
        this.TypeAnnotation = this.RULE('TypeAnnotation', () => {
            this.CONSUME(Tokens_1.BASE_TYPE);
        });
        this.ExpressionStatement = this.RULE('ExpressionStatement', () => {
            this.SUBRULE(this.AssignmentExpression);
        });
        this.AssignmentExpression = this.RULE('AssignmentExpression', () => {
            this.SUBRULE(this.AdditionExpression);
        });
        this.AdditionExpression = this.RULE('AdditionExpression', () => {
            this.SUBRULE1(this.MultiplicationExpression, { LABEL: 'left' });
            this.MANY(() => {
                this.CONSUME(Tokens_1.ADDICTIVE_OPERATOR);
                this.SUBRULE2(this.MultiplicationExpression, right);
            });
        });
        this.MultiplicationExpression = this.RULE('MultiplicationExpression', () => {
            this.SUBRULE1(this.ShiftExpression, left);
            this.MANY(() => {
                this.CONSUME(Tokens_1.MULTI_OPERATOR);
                this.SUBRULE2(this.ShiftExpression, right);
            });
        });
        this.ShiftExpression = this.RULE('ShiftExpression', () => {
            this.SUBRULE1(this.RelationExpression, left);
            this.MANY(() => {
                this.CONSUME(Tokens_1.SHIFT_OPERATOR);
                this.SUBRULE2(this.RelationExpression, right);
            });
        });
        this.RelationExpression = this.RULE('RelationExpression', () => {
            this.SUBRULE1(this.EqualityExpression, left);
            this.MANY(() => {
                this.CONSUME(Tokens_1.RELATIONAL_OPERATOR);
                this.SUBRULE2(this.EqualityExpression, right);
            });
        });
        this.EqualityExpression = this.RULE('EqualityExpression', () => {
            this.SUBRULE1(this.LogicExpression, left);
            this.MANY(() => {
                this.CONSUME(Tokens_1.EQUALITY_OPERATOR);
                this.SUBRULE2(this.LogicExpression, right);
            });
        });
        this.LogicExpression = this.RULE('LogicExpression', () => {
            this.SUBRULE1(this.UnaryExpression, left);
            this.MANY(() => {
                this.CONSUME(Tokens_1.LOGIC_OPERATOR);
                this.SUBRULE2(this.UnaryExpression, right);
            });
        });
        this.UnaryExpression = this.RULE('UnaryExpression', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.PostfixExpression) },
                {
                    ALT: () => {
                        this.CONSUME(Tokens_1.UNARY);
                        this.SUBRULE(this.UnaryExpression, right);
                    }
                }
            ]);
        });
        this.Arguments = this.RULE('Arguments', () => {
            this.CONSUME(Tokens_1.OPEN_PAREN);
            this.MANY_SEP({
                SEP: Tokens_1.COMMA,
                DEF() {
                    this.SUBRULE(this.AssignmentExpression, { LABEL: 'param' });
                }
            });
            this.CONSUME(Tokens_1.CLOSE_PAREN);
        });
        this.PostfixExpression = this.RULE('PostfixExpression', () => {
            this.SUBRULE(this.MemberExpression, left);
            this.OPTION(() => this.CONSUME(Tokens_1.POSTFIX));
        });
        this.MemberExpression = this.RULE('MemberExpression', () => {
            this.SUBRULE(this.PrimaryExpression, { LABEL: 'id' });
            this.OPTION1(() => this.SUBRULE1(this.Arguments, { LABEL: 'args' }));
            this.MANY(() => {
                this.SUBRULE(this.MemberChunkExpression, { LABEL: 'properties' });
            });
        });
        this.MemberChunkExpression = this.RULE('MemberChunkExpression', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.BoxMemberExpression, { LABEL: 'property' }) },
                { ALT: () => this.SUBRULE(this.DotMemberExpression, { LABEL: 'property' }) }
            ]);
            this.OPTION2(() => this.SUBRULE2(this.Arguments, { LABEL: 'args' }));
        });
        this.BoxMemberExpression = this.RULE('BoxMemberExpression', () => {
            this.CONSUME(Tokens_1.OPEN_BRACKET);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'innerExpression' });
            this.CONSUME(Tokens_1.CLOSE_BRACKET);
        });
        this.DotMemberExpression = this.RULE('DotMemberExpression', () => {
            this.OR1([{ ALT: () => this.CONSUME(Tokens_1.PERIOD, operator) }, { ALT: () => this.CONSUME(Tokens_1.ATTRIBUTE, operator) }]);
            this.OR2([
                { ALT: () => this.SUBRULE(this.Identifier, right) },
                { ALT: () => this.SUBRULE(this.ArrayExpression, right) },
                { ALT: () => this.SUBRULE(this.ReservedWord, right) }
            ]);
        });
        this.PrimaryExpression = this.RULE('PrimaryExpression', () => {
            this.OR(this.cachePrimaryExpression ||
                (this.cachePrimaryExpression = [
                    { ALT: () => this.SUBRULE(this.ArrayExpression) },
                    { ALT: () => this.SUBRULE(this.ObjectExpression) },
                    { ALT: () => this.SUBRULE(this.FunctionExpression) },
                    { ALT: () => this.SUBRULE(this.SubExpression) },
                    { ALT: () => this.SUBRULE(this.ParenthesisExpression) },
                    { ALT: () => this.SUBRULE(this.Identifier) },
                    { ALT: () => this.SUBRULE(this.ReservedWord) },
                    { ALT: () => this.SUBRULE(this.Literal) }
                ]));
        });
        this.ParenthesisExpression = this.RULE('ParenthesisExpression', () => {
            this.CONSUME(Tokens_1.OPEN_PAREN);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'innerExpression' });
            this.CONSUME(Tokens_1.CLOSE_PAREN);
        });
        this.Literal = this.RULE('Literal', () => {
            this.CONSUME(Tokens_1.LITERAL);
            this.OPTION(() => {
                this.CONSUME(Tokens_1.TYPE_DECLARATION);
            });
        });
        this.UnTypedIdentifier = this.RULE('UnTypedIdentifier', () => {
            this.CONSUME(Tokens_1.IDENTIFIER);
        });
        this.Identifier = this.RULE('Identifier', () => {
            this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' });
            this.OPTION(() => {
                this.CONSUME(Tokens_1.TYPE_DECLARATION, { LABEL: 'asType' });
            });
        });
        this.ReservedWord = this.RULE('ReservedWord', () => {
            this.OR(this.cacheReservedWord ||
                (this.cacheReservedWord = [
                    { ALT: () => this.CONSUME(Tokens_1.END) },
                    { ALT: () => this.CONSUME(Tokens_1.OBJECT) },
                    { ALT: () => this.CONSUME(Tokens_1.STOP) },
                    { ALT: () => this.CONSUME(Tokens_1.NEXT) },
                    { ALT: () => this.CONSUME(Tokens_1.BOOLEAN) },
                    { ALT: () => this.CONSUME(Tokens_1.INTEGER) },
                    { ALT: () => this.CONSUME(Tokens_1.LONGINTEGER) },
                    { ALT: () => this.CONSUME(Tokens_1.STRING) }
                ]));
        });
        this.ConditionalCompilationStatement = this.RULE('ConditionalCompilationStatement', () => {
            this.OR(this.cacheConditionalCompilationStatement ||
                (this.cacheConditionalCompilationStatement = [
                    { ALT: () => this.SUBRULE(this.ConditionalConst) },
                    { ALT: () => this.SUBRULE(this.ConditionalError) },
                    { ALT: () => this.SUBRULE(this.ConditionalIfStatement) }
                ]));
        });
        this.ConditionalConst = this.RULE('ConditionalConst', () => {
            this.CONSUME(Tokens_1.CONDITIONAL_CONST);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'assignment' });
        });
        this.ConditionalError = this.RULE('ConditionalError', () => {
            this.CONSUME(Tokens_1.CONDITIONAL_ERROR);
        });
        this.ConditionalIfStatement = this.RULE('ConditionalIfStatement', () => {
            this.CONSUME(Tokens_1.CONDITIONAL_IF);
            this.SUBRULE1(this.ExpressionStatement, { LABEL: 'test' });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.SUBRULE2(this.BlockStatement, body);
            this.MANY2(() => {
                this.SUBRULE(this.ConditionalElseIfStatement, { LABEL: 'alternate' });
            });
            this.OPTION3(() => {
                this.SUBRULE(this.ConditionalElseStatement, { LABEL: 'alternate' });
            });
            this.OPTION4(() => {
                this.CONSUME(Tokens_1.CONDITIONAL_END_IF);
            });
        });
        this.ConditionalElseIfStatement = this.RULE('ConditionalElseIfStatement', () => {
            this.CONSUME(Tokens_1.CONDITIONAL_ELSE_IF);
            this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' });
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.SUBRULE2(this.BlockStatement, body);
        });
        this.ConditionalElseStatement = this.RULE('ConditionalElseStatement', () => {
            this.CONSUME(Tokens_1.CONDITIONAL_ELSE);
            this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' });
            this.SUBRULE2(this.BlockStatement, body);
        });
        this.Comment = this.RULE('Comment', () => {
            this.OR([
                { ALT: () => this.CONSUME(Tokens_1.COMMENT_QUOTE) },
                { ALT: () => this.CONSUME(Tokens_1.COMMENT_REM) }
            ]);
        });
        this.EndOfStatement = this.RULE('EndOfStatement', () => {
            this.OPTION(() => {
                this.SUBRULE(this.Comment);
            });
            this.CONSUME(Tokens_1.TERMINATOR);
        });
        this.cacheStatement = undefined;
        this.cacheReservedWord = undefined;
        this.cachePrimaryExpression = undefined;
        this.cacheConditionalCompilationStatement = undefined;
        chevrotain_1.Parser.performSelfAnalysis(this);
    }
}
exports.RokuBRSParser = RokuBRSParser;
exports.parserInstance = new RokuBRSParser([]);
const tokens = (list = []) => {
    return list.map((t) => {
        return {
            loc: { start: { column: t.startColumn, line: t.startLine }, end: { column: t.endColumn, line: t.endLine } },
            range: [t.startOffset, t.endOffset],
            type: t.tokenType.tokenName,
            value: t.image
        };
    });
};
function parse(source, entryPoint = 'Program') {
    const lexingResult = BRSLexer.tokenize(source);
    exports.parserInstance.input = lexingResult.tokens;
    const value = exports.parserInstance[entryPoint]();
    return {
        lexErrors: lexingResult.errors,
        parseErrors: exports.parserInstance.errors,
        parserInstance: exports.parserInstance,
        tokens: tokens(lexingResult.tokens),
        value
    };
}
exports.parse = parse;
