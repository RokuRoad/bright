import { NumericDictionary } from 'lodash';
import { ASTNode, ContextProps, Location, NodeContext, Position } from './types/AST';
declare const Visitor: new (...args: any[]) => import("../node_modules/chevrotain/lib/chevrotain").ICstVisitor<any, any>;
export declare class BaseVisitor extends Visitor {
    constructor();
    visit(cstNode: NodeContext, param?: ContextProps): any;
    protected byLine(elements?: ASTNode[]): NumericDictionary<ASTNode>;
    protected asArray(value?: ASTNode | ASTNode[]): ASTNode[];
    protected mergeTrailing(elements?: ASTNode[], trailing?: ASTNode[]): ASTNode[];
    protected Location(head: ASTNode, tail: ASTNode): Location;
    protected RenderNode(node: any): ASTNode;
    protected mergeOperands(from?: any[], to?: any[], dividers?: any[]): ASTNode[];
    protected flatListExpression(type: string, operator: ASTNode, left: ASTNode, right: ASTNode): ASTNode;
    protected mapArguments(ctx: NodeContext, cb: (_: {
        [key: string]: ASTNode;
    }) => ASTNode): ASTNode | null;
    protected isToken(node: ASTNode): boolean;
    protected singleNode(ctx: NodeContext): ASTNode;
    protected singleArgument(ctx: NodeContext): ASTNode | false;
    protected Position(line: number, column: number): Position;
    protected RenderToken(node: any): ASTNode | ASTNode[];
    protected asNode(data: ASTNode, _: NodeContext): ASTNode;
}
export {};
