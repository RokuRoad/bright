import { ASTNode } from "./AST";
import { ASTWalker } from "./ASTWalker";

import { isArray, map, zipObject } from "lodash";
import { visitorKeys } from "./VisitorKeys";

/**
 * Checks if method should be represented as visitor
 * @param method
 */
const shouldBeVisitor = (method: string) => {
  return visitorKeys[method] && method.toUpperCase() !== method;
};

/**
 *
 * @export
 * @class BaseASTWalker
 * @implements {(ASTWalker<ASTNode | ASTNode[]>)}
 */
export class BaseASTWalker implements ASTWalker<ASTNode | ASTNode[]> {
  public Program(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public LibraryStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public UnTypedIdentifier(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ParameterList(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public AdditionExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public AssignmentExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public MultiplicationExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public LogicExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ParenthesisExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ArrayElement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ArrayExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public CallExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ConditionalConst(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ConditionalElseIfStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ConditionalElseStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ConditionalError(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ConditionalIfStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public DimStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public DotMemberExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ElseIfStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ElseStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public EmptyStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Comment(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ForEachStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ForStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public FunctionDeclaration(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public FunctionExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public GoToStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public IfStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Literal(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public MemberExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public NextStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public PostfixExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public PrintStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public RelationExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ReturnStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public StopStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public SubDeclaration(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public SubExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public UnaryExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public WhileStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public RokuTryStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public BlockStatement(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public TypeAnnotation(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public ObjectExpression(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Parameter(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Identifier(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Property(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public Arguments(): ASTNode | ASTNode[] {
    throw new Error("Method not implemented.");
  }
  public STRING_LITERAL(ctx): ASTNode {
    return ctx.loc.source;
  }

  /**
   * Renders ASTNode using this class methods
   * @param {ASTNode} ctx
   * @returns {({ [key: string]: ASTNode | ASTNode[] })}
   *
   * @memberOf BaseASTWalker
   */
  public visit(ctx: ASTNode): { [key: string]: ASTNode | ASTNode[] } {
    if (!ctx.type) {
      return null;
    }

    const keysToVisit = visitorKeys[ctx.type];
    const mapped = map(keysToVisit, (key) => {
      if (!ctx[key]) {
        return ctx[key];
      }

      if (ctx[key].type) {
        const method = ctx[key].type;

        if (!this[method]) {
          if (shouldBeVisitor(method)) {
            // tslint:disable-next-line:no-console
            console.warn(method);
          } else {
            return this.STRING_LITERAL(ctx[key]);
          }
        } else {
          return this[method](ctx[key]);
        }
      } else {
        if (isArray(ctx[key])) {
          return map(ctx[key], (element) => {
            const method = element.type;

            if (!this[method]) {
              if (shouldBeVisitor(method)) {
                // tslint:disable-next-line:no-console
                console.warn(method);
              } else {
                return this.STRING_LITERAL(element);
              }
            } else {
              return this[method](element);
            }
          });
        }
      }
    });

    return zipObject(keysToVisit, mapped);
  }

  /**
   * Converts value to array if it is a single element
   *
   * @protected
   * @param {(ASTNode[] | ASTNode)} value
   * @returns {ASTNode[]}
   *
   * @memberOf BaseASTWalker
   */
  public asArray(value: ASTNode[] | ASTNode): ASTNode[] {
    if (!value) {
      return [];
    }
    return isArray(value) ? value : [value];
  }

  /**
   * Build expression from left, right and operator.
   * Converts to array as necessary
   *
   * @protected
   * @param {left, right, operator} ctx
   * @returns Array of elements
   *
   * @memberOf BaseASTWalker
   */
  public binary(ctx: any) {
    let { left, right, operator } = this.visit(ctx);

    left = this.asArray(left);
    right = this.asArray(right);
    operator = this.asArray(operator);

    return this.mergeOperands(right, left, operator);
  }

  /**
   * Merge left, right and operator arrays.
   * Useful in situation when
   * 5 + 4  + 8 is represented as
   * left       [5]
   * right      [4, 8]
   * operators  [+, +]
   *
   * @protected
   * @param {ASTNode[]} [from=[]]
   * @param {ASTNode[]} [to=[]]
   * @param {ASTNode[]} [dividers=[]]
   * @returns
   *
   * @memberOf BaseASTWalker
   */
  public mergeOperands(
    from: ASTNode[] = [],
    to: ASTNode[] = [],
    dividers: ASTNode[] = []
  ) {
    while (from.length) {
      to.push(dividers.shift());
      to.push(from.shift());
    }

    return to;
  }
}
