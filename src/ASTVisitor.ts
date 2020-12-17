import { filter, first, last } from "lodash";

import { ASTNode, ContextProps, NodeContext, ProgramNode } from "./AST";
import { BaseVisitor } from "./BaseVisitor";

/**
 *
 *
 * @export
 * @class ASTVisitor
 * @extends {BaseVisitor}
 */
export class ASTVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @param {ContextProps} [props={ tokens: [] }]
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Program(
    ctx: NodeContext,
    props: ContextProps = { tokens: [] }
  ): ASTNode {
    return this.mapArguments(ctx, ({ Declaration = [] }: ProgramNode) => {
      const body = this.asArray(Declaration);

      const head = first(body);
      const tail = last(body);

      return this.asNode(
        {
          ...this.Location(head, tail),
          body,
          comments: [],
          sourceType: "module",
          tokens: props ? props.tokens : [],
          type: "Program",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public EndOfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ TERMINATOR, Comment }) => {
      return Comment ? Comment : TERMINATOR;
    });
  }
  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public LibraryStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ LIBRARY, path }) => {
      return this.asNode(
        {
          ...this.Location(LIBRARY, path),
          path,
          type: "LibraryStatement",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public FunctionDeclaration(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({
        FUNCTION,
        END_FUNCTION,
        id,
        ReturnType,
        params,
        body,
        trailingComments,
      }) => {
        trailingComments = this.hasComment(trailingComments);
        return this.asNode(
          {
            type: "FunctionDeclaration",
            id,
            ReturnType,
            params,
            trailingComments,
            body,
            ...this.Location(FUNCTION, END_FUNCTION),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public BlockStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ body }) => {
      const bodyArray = this.asArray(body);

      const head = first(bodyArray);
      const tail = last(bodyArray);

      return this.asNode(
        {
          ...this.Location(head, tail),
          body: filter(bodyArray, (node) => node && node.type !== "NEWLINE"),
          type: "BlockStatement",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Statement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ trailingComments, Empty, Statement }) => {
      trailingComments = this.hasComment(trailingComments);
      const node = this.asNode(
        {
          trailingComments,
          ...(Statement || Empty),
        },
        ctx
      );

      return node;
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ExpressionStatement(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public EmptyStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ NEWLINE, trailingComments }) => {
      if (trailingComments) {
        return trailingComments;
      }

      return { type: "EmptyStatement", ...this.Location(NEWLINE, NEWLINE) };
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ArrayExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ OPEN_BRACKET, CLOSE_BRACKET, elements = [], trailingComments }) => {
        const elementsAsArray = this.asArray(elements);
        const trailingCommentsAsArray = this.asArray(trailingComments);

        return this.asNode(
          {
            ...this.Location(OPEN_BRACKET, CLOSE_BRACKET),
            elements: this.mergeTrailing(
              elementsAsArray,
              trailingCommentsAsArray
            ),
            type: "ArrayExpression",
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ObjectExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({
        OPEN_CURLY_BRACE,
        CLOSE_CURLY_BRACE,
        properties = [],
        trailingComments = [],
      }) => {
        const propsAsArray = this.asArray(properties);
        const trailingCommentsAsArray = this.asArray(trailingComments);

        return this.asNode(
          {
            ...this.Location(OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE),
            properties: this.mergeTrailing(
              propsAsArray,
              trailingCommentsAsArray
            ),
            trailingComments,
            type: "ObjectExpression",
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public GoToStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ GOTO, Identifier }) => {
      return this.asNode(
        {
          type: "GoToStatement",
          id: Identifier,
          ...this.Location(GOTO, Identifier),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public LabeledStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ COLON, label, body }) => {
      return this.asNode(
        {
          type: "LabeledStatement",
          label,
          body,
          ...this.Location(label, COLON),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Property(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ key, value }) => {
      return this.asNode(
        { type: "Property", key, value, ...this.Location(key, value) },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ArrayElement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ value, trailingComments = [] }) => {
      trailingComments = this.hasComment(trailingComments);
      return this.asNode(
        {
          type: "ArrayElement",
          value,
          trailingComments,
          ...this.Location(value, value),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public PropertyName(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public DimStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ DIM, Identifier, ArrayExpression }) => {
      return this.asNode(
        {
          type: "DimStatement",
          id: Identifier,
          ArrayExpression,
          ...this.Location(DIM, ArrayExpression),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ExitStatement(ctx: NodeContext): ASTNode {
    return this.asNode({ type: "ExitStatement", ...this.singleNode(ctx) }, ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public IfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ IF, END_IF, test, alternate, consequent }) => {
        const bodyArray = this.asArray(consequent);

        const tail = END_IF ? END_IF : last(bodyArray);

        return this.asNode(
          {
            type: "IfStatement",
            test,
            alternate,
            consequent,
            ...this.Location(IF, tail),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ElseIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ ELSE_IF, body = [], test }) => {
      const bodyArray = this.asArray(body);
      const tail = bodyArray.length ? last(bodyArray) : ELSE_IF;

      return this.asNode(
        {
          type: "ElseIfStatement",
          test,
          body,
          ...this.Location(ELSE_IF, tail),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ElseStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ ELSE, body = [] }) => {
      const bodyArray = this.asArray(body);
      const tail = bodyArray.length ? last(bodyArray) : ELSE;

      return this.asNode(
        { type: "ElseStatement", body, ...this.Location(ELSE, tail) },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ForStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({
        FOR,
        END_FOR,
        init,
        test,
        counter,
        update,
        body,
        trailingComments,
      }) => {
        const tail = first(filter([END_FOR, last(this.asArray(body))]));
        trailingComments = this.hasComment(trailingComments);

        return this.asNode(
          {
            type: "ForStatement",
            init,
            test,
            update,
            counter,
            body,
            trailingComments,
            ...this.Location(FOR, tail),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ForEachStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ FOR, END_FOR, countExpression, body, trailingComments, counter }) => {
        const tail = first(filter([END_FOR, last(this.asArray(body))]));
        trailingComments = this.hasComment(trailingComments);

        return this.asNode(
          {
            type: "ForEachStatement",
            countExpression,
            trailingComments,
            counter,
            body,
            ...this.Location(FOR, tail),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public NextStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ NEXT }) => {
      return this.asNode(
        {
          ...this.Location(NEXT, NEXT),
          type: "NextStatement",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public PrintStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ PRINT, value }) => {
      const valueAsArray = this.asArray(value);

      const tail = valueAsArray.length ? last(valueAsArray) : PRINT;

      return this.asNode(
        {
          ...this.Location(PRINT, tail),
          type: "PrintStatement",
          value,
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ReturnStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ RETURN, argument }) => {
      return this.asNode(
        {
          ...this.Location(RETURN, argument ? argument : RETURN),
          argument,
          type: "ReturnStatement",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public StopStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ STOP }) => {
      return this.asNode(
        {
          ...this.Location(STOP, STOP),
          type: "StopStatement",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public WhileStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ WHILE, END_WHILE, test, body }) => {
      return this.asNode(
        {
          type: "WhileStatement",
          test,
          body,
          ...this.Location(WHILE, END_WHILE),
        },
        ctx
      );
    });
  }
  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public TryStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ TRY, END_TRY, body, trailingComments, exception, onError }) => {
        return this.asNode(
          {
            type: "TryStatement",
            body,
            trailingComments,
            exception,
            onError,
            ...this.Location(TRY, END_TRY),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public FunctionExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ FUNCTION, END_FUNCTION, body = [], params = [], ReturnType }) => {
        return this.asNode(
          {
            type: "FunctionExpression",
            body,
            params,
            ReturnType,
            ...this.Location(FUNCTION, END_FUNCTION),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public SubExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ SUB, END_SUB, body, params }) => {
      return this.asNode(
        { type: "SubExpression", body, params, ...this.Location(SUB, END_SUB) },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public SubDeclaration(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ SUB, END_SUB, id, params, ReturnType, body }) => {
        return this.asNode(
          {
            type: "SubDeclaration",
            id,
            params,
            body,
            ReturnType,
            ...this.Location(SUB, END_SUB),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public AssignmentExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public AdditionExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ ADDICTIVE_OPERATOR, left, right }) =>
        this.flatListExpression(
          "AdditionExpression",
          ADDICTIVE_OPERATOR,
          left,
          right
        )
      )
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public MultiplicationExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ MULTI_OPERATOR, left, right }) =>
        this.flatListExpression(
          "MultiplicationExpression",
          MULTI_OPERATOR,
          left,
          right
        )
      )
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ShiftExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public RelationExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ RELATIONAL_OPERATOR, left, right }) =>
        this.flatListExpression(
          "RelationExpression",
          RELATIONAL_OPERATOR,
          left,
          right
        )
      )
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public EqualityExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ EQUALITY_OPERATOR, left, right }) => {
        const head = first(this.asArray(left));
        const tail = last(this.asArray(right));

        return this.asNode(
          {
            ...this.Location(head, tail),
            left,
            operator: EQUALITY_OPERATOR,
            right,
            type: "AssignmentExpression",
          },
          ctx
        );
      })
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public LogicExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ LOGIC_OPERATOR, left, right }) =>
        this.flatListExpression("LogicExpression", LOGIC_OPERATOR, left, right)
      )
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public UnaryExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ UNARY, right }) => {
        return this.asNode(
          {
            type: "UnaryExpression",
            operator: UNARY,
            argument: right,
            ...this.Location(UNARY, right),
          },
          ctx
        );
      })
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Arguments(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ OPEN_PAREN, CLOSE_PAREN, param = [] }) => {
      return this.asNode(
        { type: "Arguments", param, ...this.Location(OPEN_PAREN, CLOSE_PAREN) },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public PostfixExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ POSTFIX, left }) => {
        return this.asNode(
          {
            type: "PostfixExpression",
            operator: POSTFIX,
            argument: left,
            ...this.Location(left, POSTFIX),
          },
          ctx
        );
      })
    );
  }

  /**
   *
   *
   * @param {NodeContext} { id, args }
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public CallMemberExpression({ id, args }: NodeContext): ASTNode {
    return {
      ...this.Location(id, args),
      args,
      callee: id,
      type: "CallExpression",
    };
  }
  public CallExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ id, args }) => {
      return this.asNode(
        {
          ...this.Location(id, args),
          args,
          callee: id,
          type: "CallExpression",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} { id, properties }
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ObjectMemberExpression({ id, properties = [] }: NodeContext): ASTNode {
    properties = this.asArray(properties);

    return {
      ...this.Location(id, last(properties)),
      computed: false,
      object: id,
      properties,
      type: "MemberExpression",
    };
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public MemberExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ id, properties = [], args = "" }) => {
        if (args) {
          return this.asNode(this.CallMemberExpression({ id, args }), ctx);
        } else {
          return this.asNode(
            this.ObjectMemberExpression({ id, properties }),
            ctx
          );
        }
      })
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public MemberChunkExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ property, args }) => {
        if (args) {
          return this.CallMemberExpression({ id: property, args });
        } else {
          return this.ObjectMemberExpression({ id: property, properties: [] });
        }
      })
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public DotMemberExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.asNode(
        this.mapArguments(ctx, ({ operator, right }) => ({
          ...this.Location(operator, right),
          operator,
          right,
          type: "DotMemberExpression",
        })),
        ctx
      )
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public PrimaryExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ParenthesisExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ OPEN_PAREN, CLOSE_PAREN, innerExpression }) => {
        return this.asNode(
          {
            ...this.Location(OPEN_PAREN, CLOSE_PAREN),
            expression: innerExpression,
            type: "ParenthesisExpression",
          },
          ctx
        );
      }
    );
  }
  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Literal(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ LITERAL }) => {
      const { loc, range } = LITERAL;

      return this.asNode(
        { type: "Literal", range, raw: loc.source, value: loc.source, loc },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ReservedWord(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalCompilationStatement(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx);
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalConst(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_CONST, assignment }) => {
      return this.asNode(
        {
          type: "ConditionalConst",
          assignment,
          ...this.Location(CONDITIONAL_CONST, assignment),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalError(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_ERROR }) => {
      return this.asNode(
        {
          type: "ConditionalError",
          error: CONDITIONAL_ERROR,
          ...this.Location(CONDITIONAL_ERROR, CONDITIONAL_ERROR),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ CONDITIONAL_IF, CONDITIONAL_END_IF, body, test, alternate }) => {
        return this.asNode(
          {
            alternate,
            body,
            test,
            type: "ConditionalIfStatement",
            ...this.Location(CONDITIONAL_IF, CONDITIONAL_END_IF),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalElseIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(
      ctx,
      ({ CONDITIONAL_ELSE_IF, test, body, trailingComments = [] }) => {
        const tail = last(this.asArray(body));
        trailingComments = this.hasComment(trailingComments);

        return this.asNode(
          {
            body,
            test,
            trailingComments,
            type: "ConditionalElseIfStatement",
            ...this.Location(CONDITIONAL_ELSE_IF, tail),
          },
          ctx
        );
      }
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ConditionalElseStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_ELSE, body }) => {
      const tail = last(this.asArray(body));

      return this.asNode(
        {
          body,
          type: "ConditionalElseStatement",
          ...this.Location(CONDITIONAL_ELSE, tail),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public UnTypedIdentifier(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ IDENTIFIER }) => {
      const { loc, range } = IDENTIFIER;
      return this.asNode(
        { type: "UnTypedIdentifier", name: loc.source, loc, range },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public ParameterList(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ Parameter, OPEN_PAREN, CLOSE_PAREN }) => {
      return this.asNode(
        {
          ...this.Location(OPEN_PAREN, CLOSE_PAREN),
          args: this.asArray(Parameter),
          type: "ParameterList",
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Parameter(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ Identifier, TypeAnnotation, value }) => {
      const tail = last(filter([Identifier, TypeAnnotation, value]));

      return this.asNode(
        {
          type: "Parameter",
          name: Identifier,
          TypeAnnotation,
          value,
          ...this.Location(Identifier, tail),
        },
        ctx
      );
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Identifier(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ asType = "", id }) => {
      return this.asNode({ asType, ...id, type: "Identifier" }, ctx);
    });
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public TypeAnnotation(ctx: NodeContext): ASTNode {
    const { loc, range } = this.singleNode(ctx);
    return this.asNode(
      { loc, range, value: loc.source, type: "TypeAnnotation" },
      ctx
    );
  }

  /**
   *
   *
   * @param {NodeContext} ctx
   * @returns {ASTNode}
   *
   * @memberOf ASTVisitor
   */
  public Comment(ctx: NodeContext): ASTNode {
    const COMMENT = this.singleNode(ctx) as ASTNode;

    let value = null;

    if (COMMENT.type === "COMMENT_QUOTE") {
      value = COMMENT.loc.source.substr(1).trim();
    } else {
      value = COMMENT.loc.source.substr(3).trim();
    }

    return this.asNode(
      { type: "Comment", value, ...this.Location(COMMENT, COMMENT) },
      ctx
    );
  }

  /**
   *
   *
   * @param {NodeContext} trailingComments
   * @returns
   *
   * @memberOf ASTVisitor
   */
  public hasComment(trailingComments) {
    if (trailingComments && trailingComments.type === "Comment") {
      return trailingComments;
    }

    return "";
  }
}
