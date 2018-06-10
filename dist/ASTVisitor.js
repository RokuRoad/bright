"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const BaseVisitor_1 = require("./BaseVisitor");
class ASTVisitor extends BaseVisitor_1.BaseVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    Program(ctx, props = { tokens: [] }) {
        return this.mapArguments(ctx, ({ Declaration = [], Empty }) => {
            const body = lodash_1.isArray(Declaration) ? Declaration : [Declaration];
            const head = body.length ? lodash_1.first(body) : lodash_1.first(Empty);
            const tail = body.length ? lodash_1.last(body) : lodash_1.last(Empty);
            return this.asNode(Object.assign({}, this.Location(head, tail), { body, comments: [], sourceType: 'module', tokens: props ? props.tokens : [], type: 'Program' }), ctx);
        });
    }
    EndOfStatement(ctx) {
        return this.mapArguments(ctx, ({ TERMINATOR, Comment }) => {
            return Comment ? Comment : TERMINATOR;
        });
    }
    LibraryStatement(ctx) {
        return this.mapArguments(ctx, ({ LIBRARY, path }) => {
            return this.asNode(Object.assign({}, this.Location(LIBRARY, path), { path, type: 'LibraryStatement' }), ctx);
        });
    }
    FunctionDeclaration(ctx) {
        return this.mapArguments(ctx, ({ FUNCTION, END_FUNCTION, id, ReturnType, params, body }) => {
            return this.asNode(Object.assign({ type: 'FunctionDeclaration', id, ReturnType, params, body }, this.Location(FUNCTION, END_FUNCTION)), ctx);
        });
    }
    BlockStatement(ctx) {
        return this.mapArguments(ctx, ({ body }) => {
            const bodyArray = this.asArray(body);
            const head = lodash_1.first(bodyArray);
            const tail = lodash_1.last(bodyArray);
            return this.asNode(Object.assign({}, this.Location(head, tail), { body: lodash_1.filter(body, (node) => node && node.type !== 'NEWLINE'), type: 'BlockStatement' }), ctx);
        });
    }
    Statement(ctx) {
        return this.mapArguments(ctx, ({ trailingComments, Empty, Statement }) => (Object.assign({ trailingComments }, Statement || Empty)));
    }
    ExpressionStatement(ctx) {
        return this.singleNode(ctx);
    }
    EmptyStatement(ctx) {
        return this.mapArguments(ctx, ({ NEWLINE }) => {
            return Object.assign({ type: 'EmptyStatement' }, this.Location(NEWLINE, NEWLINE));
        });
    }
    ArrayExpression(ctx) {
        return this.mapArguments(ctx, ({ OPEN_BRACKET, CLOSE_BRACKET, elements = [], trailingComments }) => {
            const elementsAsArray = this.asArray(elements);
            const trailingCommentsAsArray = this.asArray(trailingComments);
            return this.asNode(Object.assign({}, this.Location(OPEN_BRACKET, CLOSE_BRACKET), { elements: this.mergeTrailing(elementsAsArray, trailingCommentsAsArray), type: 'ArrayExpression' }), ctx);
        });
    }
    ObjectExpression(ctx) {
        return this.mapArguments(ctx, ({ OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE, properties = [], trailingComments = [] }) => {
            const propsAsArray = this.asArray(properties);
            const trailingCommentsAsArray = this.asArray(trailingComments);
            return this.asNode(Object.assign({}, this.Location(OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE), { properties: this.mergeTrailing(propsAsArray, trailingCommentsAsArray), trailingComments, type: 'ObjectExpression' }), ctx);
        });
    }
    GoToStatement(ctx) {
        return this.mapArguments(ctx, ({ GOTO, Identifier }) => {
            return this.asNode(Object.assign({ type: 'GoToStatement', id: Identifier }, this.Location(GOTO, Identifier)), ctx);
        });
    }
    LabeledStatement(ctx) {
        return this.mapArguments(ctx, ({ COLON, label }) => {
            return this.asNode(Object.assign({ type: 'LabeledStatement', label }, this.Location(label, COLON)), ctx);
        });
    }
    Property(ctx) {
        return this.mapArguments(ctx, ({ key, value }) => {
            return this.asNode(Object.assign({ type: 'Property', key, value }, this.Location(key, value)), ctx);
        });
    }
    ArrayElement(ctx) {
        return this.mapArguments(ctx, ({ value, trailingComments = [] }) => {
            return this.asNode(Object.assign({ type: 'ArrayElement', value, trailingComments }, this.Location(value, value)), ctx);
        });
    }
    PropertyName(ctx) {
        return this.singleNode(ctx);
    }
    DimStatement(ctx) {
        return this.mapArguments(ctx, ({ DIM, Identifier, ArrayExpression }) => {
            return this.asNode(Object.assign({ type: 'DimStatement', id: Identifier, ArrayExpression }, this.Location(DIM, ArrayExpression)), ctx);
        });
    }
    ExitStatement(ctx) {
        return this.asNode(Object.assign({ type: 'ExitStatement' }, this.singleNode(ctx)), ctx);
    }
    IfStatement(ctx) {
        return this.mapArguments(ctx, ({ IF, END_IF, test, alternate, consequent }) => {
            const bodyArray = this.asArray(consequent);
            const tail = END_IF ? END_IF : lodash_1.last(bodyArray);
            return this.asNode(Object.assign({ type: 'IfStatement', test, alternate, consequent }, this.Location(IF, tail)), ctx);
        });
    }
    ElseIfStatement(ctx) {
        return this.mapArguments(ctx, ({ ELSE_IF, body = [], test }) => {
            const bodyArray = this.asArray(body);
            const tail = bodyArray.length ? lodash_1.last(bodyArray) : ELSE_IF;
            return this.asNode(Object.assign({ type: 'ElseIfStatement', test, body }, this.Location(ELSE_IF, tail)), ctx);
        });
    }
    ElseStatement(ctx) {
        return this.mapArguments(ctx, ({ ELSE, body = [] }) => {
            const bodyArray = this.asArray(body);
            const tail = bodyArray.length ? lodash_1.last(bodyArray) : ELSE;
            return this.asNode(Object.assign({ type: 'ElseStatement', body }, this.Location(ELSE, tail)), ctx);
        });
    }
    ForStatement(ctx) {
        return this.mapArguments(ctx, ({ FOR, END_FOR, init, test, update, body }) => {
            const tail = lodash_1.first(lodash_1.filter([END_FOR, lodash_1.last(this.asArray(body))]));
            return this.asNode(Object.assign({ type: 'ForStatement', init, test, update, body }, this.Location(FOR, tail)), ctx);
        });
    }
    ForEachStatement(ctx) {
        return this.mapArguments(ctx, ({ FOR, END_FOR, countExpression, body }) => {
            const tail = lodash_1.first(lodash_1.filter([END_FOR, lodash_1.last(this.asArray(body))]));
            return this.asNode(Object.assign({ type: 'ForEachStatement', countExpression, body }, this.Location(FOR, tail)), ctx);
        });
    }
    NextStatement(ctx) {
        return this.mapArguments(ctx, ({ NEXT }) => {
            return this.asNode(Object.assign({}, this.Location(NEXT, NEXT), { type: 'NextStatement' }), ctx);
        });
    }
    PrintStatement(ctx) {
        return this.mapArguments(ctx, ({ PRINT, value }) => {
            const valueAsArray = this.asArray(value);
            const tail = valueAsArray.length ? lodash_1.last(valueAsArray) : PRINT;
            return this.asNode(Object.assign({}, this.Location(PRINT, tail), { type: 'PrintStatement', value }), ctx);
        });
    }
    ReturnStatement(ctx) {
        return this.mapArguments(ctx, ({ RETURN, argument }) => {
            return this.asNode(Object.assign({}, this.Location(RETURN, argument ? argument : RETURN), { argument, type: 'ReturnStatement' }), ctx);
        });
    }
    StopStatement(ctx) {
        return this.mapArguments(ctx, ({ STOP }) => {
            return this.asNode(Object.assign({}, this.Location(STOP, STOP), { type: 'StopStatement' }), ctx);
        });
    }
    WhileStatement(ctx) {
        return this.mapArguments(ctx, ({ WHILE, END_WHILE, test, body }) => {
            return this.asNode(Object.assign({ type: 'WhileStatement', test, body }, this.Location(WHILE, END_WHILE)), ctx);
        });
    }
    FunctionExpression(ctx) {
        return this.mapArguments(ctx, ({ FUNCTION, END_FUNCTION, body = [], params = [], ReturnType }) => {
            return this.asNode(Object.assign({ type: 'FunctionExpression', body, params, ReturnType }, this.Location(FUNCTION, END_FUNCTION)), ctx);
        });
    }
    SubExpression(ctx) {
        return this.mapArguments(ctx, ({ SUB, END_SUB, body, params }) => {
            return this.asNode(Object.assign({ type: 'SubExpression', body, params }, this.Location(SUB, END_SUB)), ctx);
        });
    }
    SubDeclaration(ctx) {
        return this.mapArguments(ctx, ({ SUB, END_SUB, id, params, ReturnType, body }) => {
            return this.asNode(Object.assign({ type: 'SubDeclaration', id, params, body, ReturnType }, this.Location(SUB, END_SUB)), ctx);
        });
    }
    AssignmentExpression(ctx) {
        return this.singleNode(ctx);
    }
    AdditionExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ ADDICTIVE_OPERATOR, left, right }) => this.flatListExpression('AdditionExpression', ADDICTIVE_OPERATOR, left, right)));
    }
    MultiplicationExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ MULTI_OPERATOR, left, right }) => this.flatListExpression('MultiplicationExpression', MULTI_OPERATOR, left, right)));
    }
    ShiftExpression(ctx) {
        return this.singleNode(ctx);
    }
    RelationExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ RELATIONAL_OPERATOR, left, right }) => this.flatListExpression('RelationExpression', RELATIONAL_OPERATOR, left, right)));
    }
    EqualityExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ EQUALITY_OPERATOR, left, right }) => {
                const head = lodash_1.first(this.asArray(left));
                const tail = lodash_1.last(this.asArray(right));
                return this.asNode(Object.assign({}, this.Location(head, tail), { left, operator: EQUALITY_OPERATOR, right, type: 'AssignmentExpression' }), ctx);
            }));
    }
    LogicExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ LOGIC_OPERATOR, left, right }) => this.flatListExpression('LogicExpression', LOGIC_OPERATOR, left, right)));
    }
    UnaryExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ UNARY, right }) => {
                return this.asNode(Object.assign({ type: 'UnaryExpression', operator: UNARY, argument: right }, this.Location(UNARY, right)), ctx);
            }));
    }
    Arguments(ctx) {
        return this.mapArguments(ctx, ({ OPEN_PAREN, CLOSE_PAREN, param = [] }) => {
            return this.asNode(Object.assign({ type: 'Arguments', param }, this.Location(OPEN_PAREN, CLOSE_PAREN)), ctx);
        });
    }
    PostfixExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ POSTFIX, left }) => {
                return this.asNode(Object.assign({ type: 'PostfixExpression', operator: POSTFIX, argument: left }, this.Location(left, POSTFIX)), ctx);
            }));
    }
    CallExpression({ id, args }) {
        return Object.assign({}, this.Location(id, args), { arguments: args, callee: id, type: 'CallExpression' });
    }
    ObjectMemberExpression({ id, properties }) {
        properties = this.asArray(properties);
        return Object.assign({}, this.Location(id, lodash_1.last(properties)), { computed: false, object: id, properties, type: 'MemberExpression' });
    }
    MemberExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ id, properties = [], args = '' }) => {
                if (args) {
                    return this.asNode(this.CallExpression({ id, args }), ctx);
                }
                else {
                    return this.asNode(this.ObjectMemberExpression({ id, properties }), ctx);
                }
            }));
    }
    MemberChunkExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ property, args }) => {
                if (args) {
                    return this.CallExpression({ id: property, args });
                }
                else {
                    return this.ObjectMemberExpression({ id: property, properties: [] });
                }
            }));
    }
    BoxMemberExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.mapArguments(ctx, ({ OPEN_BRACKET, CLOSE_BRACKET, innerExpression }) => {
                return this.asNode(Object.assign({ type: 'BoxMemberExpression', innerExpression }, this.Location(OPEN_BRACKET, CLOSE_BRACKET)), ctx);
            }));
    }
    DotMemberExpression(ctx) {
        return (this.singleArgument(ctx) ||
            this.asNode(this.mapArguments(ctx, ({ operator, right }) => (Object.assign({}, this.Location(operator, right), { operator,
                right, type: 'DotMemberExpression' }))), ctx));
    }
    PrimaryExpression(ctx) {
        return this.singleNode(ctx);
    }
    ParenthesisExpression(ctx) {
        return this.mapArguments(ctx, ({ OPEN_PAREN, CLOSE_PAREN, innerExpression }) => {
            return this.asNode(Object.assign({}, this.Location(OPEN_PAREN, CLOSE_PAREN), { expression: innerExpression, type: 'ParenthesisExpression' }), ctx);
        });
    }
    Literal(ctx) {
        return this.mapArguments(ctx, ({ LITERAL }) => {
            const { loc, range } = LITERAL;
            return this.asNode({ type: 'Literal', range, raw: loc.source, value: loc.source, loc }, ctx);
        });
    }
    ReservedWord(ctx) {
        return this.singleNode(ctx);
    }
    ConditionalCompilationStatement(ctx) {
        return this.singleNode(ctx);
    }
    ConditionalConst(ctx) {
        return this.mapArguments(ctx, ({ left, right, operator }) => {
            return this.flatListExpression('ConditionalConst', operator, left, right);
        });
    }
    ConditionalError(ctx) {
        return this.mapArguments(ctx, ({ CONDITIONAL_ERROR }) => {
            return this.asNode(Object.assign({ type: 'ConditionalError', error: CONDITIONAL_ERROR }, this.Location(CONDITIONAL_ERROR, CONDITIONAL_ERROR)), ctx);
        });
    }
    ConditionalIfStatement(ctx) {
        return this.mapArguments(ctx, ({ CONDITIONAL_IF, CONDITIONAL_END_IF, body, test, alternate }) => {
            return this.asNode(Object.assign({ alternate,
                body,
                test, type: 'ConditionalIfStatement' }, this.Location(CONDITIONAL_IF, CONDITIONAL_END_IF)), ctx);
        });
    }
    ConditionalElseIfStatement(ctx) {
        return this.mapArguments(ctx, ({ CONDITIONAL_ELSE_IF, test, body, trailingComments = [] }) => {
            const tail = lodash_1.last(this.asArray(body));
            return this.asNode(Object.assign({ body,
                test,
                trailingComments, type: 'ConditionalElseIfStatement' }, this.Location(CONDITIONAL_ELSE_IF, tail)), ctx);
        });
    }
    ConditionalElseStatement(ctx) {
        return this.mapArguments(ctx, ({ CONDITIONAL_ELSE, body }) => {
            const tail = lodash_1.last(this.asArray(body));
            return this.asNode(Object.assign({ body, type: 'ConditionalElseStatement' }, this.Location(CONDITIONAL_ELSE, tail)), ctx);
        });
    }
    UnTypedIdentifier(ctx) {
        return this.mapArguments(ctx, ({ IDENTIFIER }) => {
            const { loc, range } = IDENTIFIER;
            return this.asNode({ type: 'UnTypedIdentifier', name: loc.source, loc, range }, ctx);
        });
    }
    ParameterList(ctx) {
        return this.mapArguments(ctx, ({ Parameter, OPEN_PAREN, CLOSE_PAREN }) => {
            return this.asNode(Object.assign({}, this.Location(OPEN_PAREN, CLOSE_PAREN), { arguments: this.asArray(Parameter), type: 'ParameterList' }), ctx);
        });
    }
    Parameter(ctx) {
        return this.mapArguments(ctx, ({ Identifier, TypeAnnotation, value }) => {
            const tail = lodash_1.last(lodash_1.filter([Identifier, TypeAnnotation, value]));
            return this.asNode(Object.assign({ type: 'Parameter', name: Identifier, TypeAnnotation, value }, this.Location(Identifier, tail)), ctx);
        });
    }
    Identifier(ctx) {
        return this.mapArguments(ctx, ({ asType = '', id }) => {
            return this.asNode(Object.assign({ asType }, id, { type: 'Identifier' }), ctx);
        });
    }
    TypeAnnotation(ctx) {
        const { loc, range } = this.singleNode(ctx);
        return this.asNode({ loc, range, value: loc.source, type: 'TypeAnnotation' }, ctx);
    }
    Comment(ctx) {
        const COMMENT = this.singleNode(ctx);
        let value = null;
        if (COMMENT.type === 'COMMENT_QUOTE') {
            value = COMMENT.loc.source.substr(1).trim();
        }
        else {
            value = COMMENT.loc.source.substr(3).trim();
        }
        return this.asNode(Object.assign({ type: 'Comment', value }, this.Location(COMMENT, COMMENT)), ctx);
    }
}
exports.ASTVisitor = ASTVisitor;
