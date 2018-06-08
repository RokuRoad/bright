import { filter, first, isArray, last } from 'lodash'

import { BaseVisitor } from './BaseVisitor'
import { ASTNode, ContextProps, NodeContext, ProgramNode } from './types'

export class ASTVisitor extends BaseVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  public Program(ctx: NodeContext, props: ContextProps = { tokens: [] }): ASTNode {
    return this.mapArguments(ctx, ({ Declaration = [], Empty }: ProgramNode) => {
      const body = isArray(Declaration) ? Declaration : [ Declaration ]

      const head = body.length ? first(body) : first(Empty)
      const tail = body.length ? last(body) : last(Empty)

      return this.asNode(
        {
          ...this.Location(head, tail),
          body,
          comments: [],
          // empty: Empty,
          sourceType: 'module',
          tokens: props ? props.tokens : [],
          type: 'Program'
        },
        ctx
      )
    })
  }

  public EndOfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ TERMINATOR, Comment }) => {
      return Comment ? Comment : TERMINATOR
    })
  }

  public LibraryStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ LIBRARY, path }) => {
      return this.asNode(
        {
          ...this.Location(LIBRARY, path),
          path,
          type: 'LibraryStatement'
        },
        ctx
      )
    })
  }

  public FunctionDeclaration(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ FUNCTION, END_FUNCTION, id, ReturnType, params, body }) => {
      return this.asNode(
        { type: 'FunctionDeclaration', id, ReturnType, params, body, ...this.Location(FUNCTION, END_FUNCTION) },
        ctx
      )
    })
  }

  public BlockStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ body }) => {
      const bodyArray = this.asArray(body)

      const head = first(bodyArray)
      const tail = last(bodyArray)

      return this.asNode(
        {
          ...this.Location(head, tail),
          body: filter(body, (node) => node && node.type !== 'NEWLINE'),
          type: 'BlockStatement'
        },
        ctx
      )
    })
  }

  public Statement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ trailingComments, Empty, Statement }) => ({
      trailingComments,
      ...Statement || Empty
    }))
  }

  public ExpressionStatement(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public EmptyStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ NEWLINE }) => {
      return { type: 'EmptyStatement', ...this.Location(NEWLINE, NEWLINE) }
    })
  }

  public ArrayExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ OPEN_BRACKET, CLOSE_BRACKET, elements = [], trailingComments }) => {
      const elementsAsArray = this.asArray(elements)
      const trailingCommentsAsArray = this.asArray(trailingComments)

      return this.asNode(
        {
          ...this.Location(OPEN_BRACKET, CLOSE_BRACKET),
          elements: this.mergeTrailing(elementsAsArray, trailingCommentsAsArray),
          type: 'ArrayExpression'
        },
        ctx
      )
    })
  }

  public ObjectExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE, properties = [], trailingComments = [] }) => {
      const propsAsArray = this.asArray(properties)
      const trailingCommentsAsArray = this.asArray(trailingComments)

      return this.asNode(
        {
          ...this.Location(OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE),
          properties: this.mergeTrailing(propsAsArray, trailingCommentsAsArray),
          trailingComments,
          type: 'ObjectExpression'
        },
        ctx
      )
    })
  }

  public GoToStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ GOTO, Identifier }) => {
      return this.asNode({ type: 'GoToStatement', id: Identifier, ...this.Location(GOTO, Identifier) }, ctx)
    })
  }

  public LabeledStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ COLON, label }) => {
      return this.asNode({ type: 'LabeledStatement', label, ...this.Location(label, COLON) }, ctx)
    })
  }

  public Property(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ key, value }) => {
      return this.asNode({ type: 'Property', key, value, ...this.Location(key, value) }, ctx)
    })
  }

  public ArrayElement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ value, trailingComments = [] }) => {
      return this.asNode({ type: 'ArrayElement', value, trailingComments, ...this.Location(value, value) }, ctx)
    })
  }

  public PropertyName(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public DimStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ DIM, Identifier, ArrayExpression }) => {
      return this.asNode(
        { type: 'DimStatement', id: Identifier, ArrayExpression, ...this.Location(DIM, ArrayExpression) },
        ctx
      )
    })
  }

  public ExitStatement(ctx: NodeContext): ASTNode {
    return this.asNode({ type: 'ExitStatement', ...this.singleNode(ctx) }, ctx)
  }

  public IfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ IF, END_IF, test, alternate, consequent }) => {
      const bodyArray = this.asArray(consequent)

      const tail = END_IF ? END_IF : last(bodyArray)

      return this.asNode({ type: 'IfStatement', test, alternate, consequent, ...this.Location(IF, tail) }, ctx)
    })
  }

  public ElseIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ ELSE_IF, body = [], test }) => {
      const bodyArray = this.asArray(body)
      const tail = bodyArray.length ? last(bodyArray) : ELSE_IF

      return this.asNode({ type: 'ElseIfStatement', test, body, ...this.Location(ELSE_IF, tail) }, ctx)
    })
  }

  public ElseStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ ELSE, body = [] }) => {
      const bodyArray = this.asArray(body)
      const tail = bodyArray.length ? last(bodyArray) : ELSE

      return this.asNode({ type: 'ElseStatement', body, ...this.Location(ELSE, tail) }, ctx)
    })
  }

  public ForStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ FOR, END_FOR, init, test, update, body }) => {
      const tail = first(filter([ END_FOR, last(this.asArray(body)) ]))
      return this.asNode({ type: 'ForStatement', init, test, update, body, ...this.Location(FOR, tail) }, ctx)
    })
  }

  public ForEachStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ FOR, END_FOR, countExpression, body }) => {
      const tail = first(filter([ END_FOR, last(this.asArray(body)) ]))
      return this.asNode({ type: 'ForEachStatement', countExpression, body, ...this.Location(FOR, tail) }, ctx)
    })
  }

  public NextStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ NEXT }) => {
      return this.asNode(
        {
          ...this.Location(NEXT, NEXT),
          type: 'NextStatement'
        },
        ctx
      )
    })
  }

  public PrintStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ PRINT, value }) => {
      const valueAsArray = this.asArray(value)

      const tail = valueAsArray.length ? last(valueAsArray) : PRINT

      return this.asNode(
        {
          ...this.Location(PRINT, tail),
          type: 'PrintStatement',
          value
        },
        ctx
      )
    })
  }

  public ReturnStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ RETURN, argument }) => {
      return this.asNode(
        {
          ...this.Location(RETURN, argument ? argument : RETURN),
          argument,
          type: 'ReturnStatement'
        },
        ctx
      )
    })
  }

  public StopStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ STOP }) => {
      return this.asNode(
        {
          ...this.Location(STOP, STOP),
          type: 'StopStatement'
        },
        ctx
      )
    })
  }

  public WhileStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ WHILE, END_WHILE, test, body }) => {
      return this.asNode({ type: 'WhileStatement', test, body, ...this.Location(WHILE, END_WHILE) }, ctx)
    })
  }

  public FunctionExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ FUNCTION, END_FUNCTION, body = [], params = [], ReturnType }) => {
      return this.asNode(
        { type: 'FunctionExpression', body, params, ReturnType, ...this.Location(FUNCTION, END_FUNCTION) },
        ctx
      )
    })
  }

  public SubExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ SUB, END_SUB, body, params }) => {
      return this.asNode({ type: 'SubExpression', body, params, ...this.Location(SUB, END_SUB) }, ctx)
    })
  }

  public SubDeclaration(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ SUB, END_SUB, id, params, ReturnType, body }) => {
      return this.asNode({ type: 'SubDeclaration', id, params, body, ReturnType, ...this.Location(SUB, END_SUB) }, ctx)
    })
  }

  public AssignmentExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public AdditionExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ ADDICTIVE_OPERATOR, left, right }) =>
        this.flatListExpression('AdditionExpression', ADDICTIVE_OPERATOR, left, right)
      )
    )
  }

  public MultiplicationExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ MULTI_OPERATOR, left, right }) =>
        this.flatListExpression('MultiplicationExpression', MULTI_OPERATOR, left, right)
      )
    )
  }

  public ShiftExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public RelationExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ RELATIONAL_OPERATOR, left, right }) =>
        this.flatListExpression('RelationExpression', RELATIONAL_OPERATOR, left, right)
      )
    )
  }

  public EqualityExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ EQUALITY_OPERATOR, left, right }) => {
        const head = first(this.asArray(left))
        const tail = last(this.asArray(right))

        return this.asNode(
          {
            ...this.Location(head, tail),
            left,
            operator: EQUALITY_OPERATOR,
            right,
            type: 'AssignmentExpression'
          },
          ctx
        )
      })
    )
  }

  public LogicExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ LOGIC_OPERATOR, left, right }) =>
        this.flatListExpression('LogicExpression', LOGIC_OPERATOR, left, right)
      )
    )
  }

  public UnaryExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ UNARY, right }) => {
        return this.asNode(
          { type: 'UnaryExpression', operator: UNARY, argument: right, ...this.Location(UNARY, right) },
          ctx
        )
      })
    )
  }

  public Arguments(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ OPEN_PAREN, CLOSE_PAREN, param = [] }) => {
      return this.asNode({ type: 'Arguments', param, ...this.Location(OPEN_PAREN, CLOSE_PAREN) }, ctx)
    })
  }

  public PostfixExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ POSTFIX, left }) => {
        return this.asNode(
          { type: 'PostfixExpression', operator: POSTFIX, argument: left, ...this.Location(left, POSTFIX) },
          ctx
        )
      })
    )
  }

  public CallExpression({ id, args }: NodeContext) {
    return {
      ...this.Location(id, args),
      arguments: args,
      callee: id,
      type: 'CallExpression'
    }
  }

  public ObjectMemberExpression({ id, properties }: NodeContext): ASTNode {
    properties = this.asArray(properties)

    return {
      ...this.Location(id, last(properties)),
      computed: false,
      object: id,
      properties,
      type: 'MemberExpression'
    }
  }

  public MemberExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ id, properties = [], args = '' }) => {
        if (args) {
          return this.asNode(this.CallExpression({ id, args }), ctx)
        } else {
          return this.asNode(this.ObjectMemberExpression({ id, properties }), ctx)
        }
      })
    )
  }

  public MemberChunkExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ property, args }) => {
        if (args) {
          return this.CallExpression({ id: property, args })
        } else {
          return this.ObjectMemberExpression({ id: property, properties: [] })
        }
      })
    )
  }

  public BoxMemberExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.mapArguments(ctx, ({ OPEN_BRACKET, CLOSE_BRACKET, innerExpression }) => {
        return this.asNode(
          { type: 'BoxMemberExpression', innerExpression, ...this.Location(OPEN_BRACKET, CLOSE_BRACKET) },
          ctx
        )
      })
    )
  }

  public DotMemberExpression(ctx: NodeContext): ASTNode {
    return (
      this.singleArgument(ctx) ||
      this.asNode(
        this.mapArguments(ctx, ({ operator, right }) => ({
          ...this.Location(operator, right),
          operator,
          right,
          type: 'DotMemberExpression'
        })),
        ctx
      )
    )
  }

  public PrimaryExpression(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public ParenthesisExpression(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ OPEN_PAREN, CLOSE_PAREN, innerExpression }) => {
      return this.asNode(
        {
          ...this.Location(OPEN_PAREN, CLOSE_PAREN),
          expression: innerExpression,
          type: 'ParenthesisExpression'
        },
        ctx
      )
    })
  }

  public Literal(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ LITERAL }) => {
      const { loc, range } = LITERAL

      return this.asNode({ type: 'Literal', range, raw: loc.source, value: loc.source, loc }, ctx)
    })
  }

  public ReservedWord(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public ConditionalCompilationStatement(ctx: NodeContext): ASTNode {
    return this.singleNode(ctx)
  }

  public ConditionalConst(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ left, right, operator }) => {
      return this.flatListExpression('ConditionalConst', operator, left, right)
    })
  }

  public ConditionalError(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_ERROR }) => {
      return this.asNode(
        { type: 'ConditionalError', error: CONDITIONAL_ERROR, ...this.Location(CONDITIONAL_ERROR, CONDITIONAL_ERROR) },
        ctx
      )
    })
  }

  public ConditionalIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_IF, CONDITIONAL_END_IF, body, test, alternate }) => {
      return this.asNode(
        {
          alternate,
          body,
          test,
          type: 'ConditionalIfStatement',
          ...this.Location(CONDITIONAL_IF, CONDITIONAL_END_IF)
        },
        ctx
      )
    })
  }

  public ConditionalElseIfStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_ELSE_IF, test, body, trailingComments = [] }) => {
      const tail = last(this.asArray(body))

      return this.asNode(
        {
          body,
          test,
          trailingComments,
          type: 'ConditionalElseIfStatement',
          ...this.Location(CONDITIONAL_ELSE_IF, tail)
        },
        ctx
      )
    })
  }

  public ConditionalElseStatement(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ CONDITIONAL_ELSE, body }) => {
      const tail = last(this.asArray(body))

      return this.asNode(
        {
          body,
          type: 'ConditionalElseStatement',
          ...this.Location(CONDITIONAL_ELSE, tail)
        },
        ctx
      )
    })
  }

  public UnTypedIdentifier(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ IDENTIFIER }) => {
      const { loc, range } = IDENTIFIER
      return this.asNode({ type: 'UnTypedIdentifier', name: loc.source, loc, range }, ctx)
    })
  }

  public ParameterList(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ Parameter, OPEN_PAREN, CLOSE_PAREN }) => {
      return this.asNode(
        {
          ...this.Location(OPEN_PAREN, CLOSE_PAREN),
          arguments: this.asArray(Parameter),
          type: 'ParameterList'
        },
        ctx
      )
    })
  }

  public Parameter(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ Identifier, TypeAnnotation, value }) => {
      const tail = last(filter([ Identifier, TypeAnnotation, value ]))

      return this.asNode(
        { type: 'Parameter', name: Identifier, TypeAnnotation, value, ...this.Location(Identifier, tail) },
        ctx
      )
    })
  }

  public Identifier(ctx: NodeContext): ASTNode {
    return this.mapArguments(ctx, ({ asType = '', id }) => {
      return this.asNode({ asType, ...id, type: 'Identifier' }, ctx)
    })
  }

  public TypeAnnotation(ctx: NodeContext): ASTNode {
    const { loc, range } = this.singleNode(ctx)
    return this.asNode({ loc, range, value: loc.source, type: 'TypeAnnotation' }, ctx)
  }

  public Comment(ctx: NodeContext): ASTNode {
    const COMMENT = this.singleNode(ctx) as ASTNode

    let value = null

    if (COMMENT.type === 'COMMENT_QUOTE') {
      value = COMMENT.loc.source.substr(1).trim()
    } else {
      value = COMMENT.loc.source.substr(3).trim()
    }

    return this.asNode({ type: 'Comment', value, ...this.Location(COMMENT, COMMENT) }, ctx)
  }
}
