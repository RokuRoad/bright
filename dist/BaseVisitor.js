"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Parser_1 = require("./Parser");
const parser = new Parser_1.RokuBRSParser([]);
const Visitor = parser.getBaseCstVisitorConstructor();
class BaseVisitor extends Visitor {
    constructor() {
        super();
    }
    visit(cstNode, param) {
        if (lodash_1.isArray(cstNode)) {
            cstNode = cstNode[0];
        }
        if (lodash_1.isUndefined(cstNode)) {
            return undefined;
        }
        return this[cstNode.fullName || cstNode.name](cstNode.children, param);
    }
    byLine(elements = []) {
        return lodash_1.mapKeys(this.asArray(elements), (el) => {
            return el.loc && el.loc.start.line;
        });
    }
    asArray(value = []) {
        if (!value) {
            return [];
        }
        return lodash_1.isArray(value) ? lodash_1.filter(value) : [value];
    }
    mergeTrailing(elements = [], trailing = []) {
        const linedElements = this.byLine(elements);
        const linedTrailing = this.byLine(trailing);
        const merger = (el, line) => {
            if (linedTrailing[line]) {
                el.trailing = linedTrailing[line];
            }
            return el;
        };
        return lodash_1.map(linedElements, merger);
    }
    Location(head, tail) {
        if (!head || !tail) {
            return { loc: null, range: null };
        }
        const range = [null, null];
        const loc = { start: { line: null, column: null }, end: { line: null, column: null } };
        if (head.loc !== null) {
            loc.start = head.loc.start;
        }
        if (tail.loc !== null) {
            loc.end = tail.loc.end;
        }
        if (head.range !== null) {
            range[0] = head.range[0];
        }
        if (tail.range !== null) {
            range[1] = tail.range[1];
        }
        return { loc, range };
    }
    RenderNode(node) {
        const visitor = (subNode) => {
            return this.visit(subNode);
        };
        const mapped = lodash_1.filter(lodash_1.map(node, (subNode) => visitor(subNode)));
        return mapped.length === 1 ? mapped[0] : mapped;
    }
    mergeOperands(from = [], to = [], dividers = []) {
        while (from.length) {
            to.push(dividers.shift());
            to.push(from.shift());
        }
        return lodash_1.filter(to);
    }
    flatListExpression(type, operator, left, right) {
        const head = lodash_1.isArray(left) ? lodash_1.first(left) : left;
        const tail = lodash_1.isArray(right) ? lodash_1.first(right) : right;
        const binary = Object.assign({ type, operator, left, right }, this.Location(head, tail));
        return this.asNode(binary, {});
    }
    mapArguments(ctx, cb) {
        const _ = {};
        lodash_1.map(ctx, (node, key) => {
            this.isToken(node) ? (_[key] = this.RenderToken(node)) : (_[key] = this.RenderNode(node));
        });
        if (cb) {
            return cb(_);
        }
        return null;
    }
    isToken(node) {
        return node && node[0] && node[0].tokenType;
    }
    singleNode(ctx) {
        const data = this.singleArgument(ctx);
        return this.asNode(data, ctx);
    }
    singleArgument(ctx) {
        const names = lodash_1.keys(ctx);
        if (names.length !== 1) {
            return false;
        }
        return this.mapArguments(ctx, (nodes) => lodash_1.first(lodash_1.values(nodes)));
    }
    Position(line, column) {
        return { line, column };
    }
    RenderToken(node) {
        const mapper = ({ startLine, startColumn, image, endLine, endColumn, startOffset, endOffset, tokenType }) => {
            const start = this.Position(startLine, startColumn);
            const end = this.Position(endLine, endColumn);
            return {
                loc: { source: image, start, end },
                range: [startOffset, endOffset],
                type: tokenType.tokenName
            };
        };
        const mapped = lodash_1.map(node, mapper);
        return mapped.length === 1 ? mapped[0] : mapped;
    }
    asNode(data, _) {
        return data;
    }
}
exports.BaseVisitor = BaseVisitor;
