import { EOF, IToken, Lexer, Parser } from 'chevrotain'

import {
  ADDICTIVE_OPERATOR,
  ALL_TOKENS,
  AS,
  ATTRIBUTE,
  BASE_TYPE,
  BOOLEAN,
  CLOSE_BRACKET,
  CLOSE_CURLY_BRACE,
  CLOSE_PAREN,
  COLON,
  COMMA,
  COMMENT_QUOTE,
  COMMENT_REM,
  CONDITIONAL_CONST,
  CONDITIONAL_ELSE,
  CONDITIONAL_ELSE_IF,
  CONDITIONAL_END_IF,
  CONDITIONAL_ERROR,
  CONDITIONAL_IF,
  DIM,
  EACH,
  ELSE,
  ELSE_IF,
  END,
  END_FOR,
  END_FUNCTION,
  END_IF,
  END_SUB,
  END_WHILE,
  EQUAL,
  EQUALITY_OPERATOR,
  EXIT_FOR,
  EXIT_WHILE,
  FOR,
  FUNCTION,
  GOTO,
  IDENTIFIER,
  IF,
  IN,
  INTEGER,
  LIBRARY,
  LITERAL,
  LOGIC_OPERATOR,
  LONGINTEGER,
  MULTI_OPERATOR,
  NEWLINE,
  NEXT,
  NUMBER_LITERAL,
  OBJECT,
  OPEN_BRACKET,
  OPEN_CURLY_BRACE,
  OPEN_PAREN,
  PERIOD,
  POSTFIX,
  PRINT,
  RELATIONAL_OPERATOR,
  RETURN,
  SEMICOLON,
  SHIFT_OPERATOR,
  STEP,
  STOP,
  STRING,
  STRING_LITERAL,
  SUB,
  TERMINATOR,
  THEN,
  TO,
  TYPE_DECLARATION,
  UNARY,
  WHILE
} from './Tokens'

const BRSLexer = new Lexer(ALL_TOKENS, {
  deferDefinitionErrorsHandling: true,
  ensureOptimizations: true,
  positionTracking: 'full'
})

const operator = { LABEL: 'operator' }
const right = { LABEL: 'right' }
const left = { LABEL: 'left' }
const body = { LABEL: 'body' }
const Declaration = { LABEL: 'Declaration' }
const Empty = { LABEL: 'Empty' }

const Statement = { LABEL: 'Statement' }

export class RokuBRSParser extends Parser {
  public Program = this.RULE('Program', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.FunctionDeclaration, Declaration) },
        { ALT: () => this.SUBRULE(this.LibraryStatement, Declaration) },
        { ALT: () => this.SUBRULE(this.SubDeclaration, Declaration) },
        { ALT: () => this.SUBRULE(this.ConditionalCompilationStatement, Declaration) },
        { ALT: () => this.SUBRULE(this.EmptyStatement, Empty) },
        { ALT: () => this.SUBRULE(this.Comment, Declaration) }
      ])
    })

    this.OPTION(() => {
      this.CONSUME(EOF)
    })
  })

  protected BlockStatement = this.RULE('BlockStatement', () => {
    this.MANY(() => {
      this.OR([ { ALT: () => this.SUBRULE(this.Statement, body) }, { ALT: () => this.CONSUME(TERMINATOR) } ])
    })
  })

  protected Statement = this.RULE('Statement', () => {
    this.OR2(
      this.cacheStatement ||
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
        ])
    )

    this.OPTION(() => {
      this.SUBRULE2(this.Comment, { LABEL: 'trailingComments' })
    })
  })

  protected ArrayExpression = this.RULE('ArrayExpression', () => {
    this.CONSUME(OPEN_BRACKET)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.ArrayElement, { LABEL: 'elements' }) },
        { ALT: () => this.CONSUME(COMMA) },
        { ALT: () => this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' }) }
        //
      ])
    })
    this.CONSUME(CLOSE_BRACKET)
  })

  protected ObjectExpression = this.RULE('ObjectExpression', () => {
    this.CONSUME(OPEN_CURLY_BRACE)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.Property, { LABEL: 'properties' }) },
        { ALT: () => this.CONSUME(COMMA) },
        { ALT: () => this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' }) }
        //
      ])
    })
    this.CONSUME(CLOSE_CURLY_BRACE)
  })

  protected Property = this.RULE('Property', () => {
    this.SUBRULE(this.PropertyName, { LABEL: 'key' })
    this.CONSUME(COLON)
    this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' })
  })

  protected ArrayElement = this.RULE('ArrayElement', () => {
    this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' })
    this.OPTION(() => {
      this.CONSUME(COMMA)
    })
  })

  protected PropertyName = this.RULE('PropertyName', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.Identifier) },
      { ALT: () => this.SUBRULE(this.ReservedWord) },
      { ALT: () => this.CONSUME(STRING_LITERAL) },
      { ALT: () => this.CONSUME(NUMBER_LITERAL) }
    ])
  })

  protected DimStatement = this.RULE('DimStatement', () => {
    this.CONSUME(DIM)
    this.SUBRULE(this.Identifier)
    this.SUBRULE(this.ArrayExpression)
  })

  protected EmptyStatement = this.RULE('EmptyStatement', () => {
    this.OPTION(() => {
      this.SUBRULE2(this.Comment, { LABEL: 'trailingComments' })
    })
    this.CONSUME(NEWLINE)
  })

  protected ExitStatement = this.RULE('ExitStatement', () => {
    this.OR([
      { ALT: () => this.CONSUME(EXIT_WHILE) },
      { ALT: () => this.CONSUME(EXIT_FOR) }
      //
    ])
  })

  protected IfStatement = this.RULE('IfStatement', () => {
    let isBlock = false

    this.CONSUME(IF)
    this.SUBRULE1(this.ExpressionStatement, { LABEL: 'test' })

    this.OPTION1(() => {
      this.CONSUME(THEN)
    })

    this.OPTION2(() => {
      this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
      isBlock = true
    })

    this.OPTION4(() => {
      if (isBlock) {
        this.SUBRULE2(this.BlockStatement, { LABEL: 'consequent' })
      } else {
        this.SUBRULE2(this.Statement, { LABEL: 'consequent' })
      }
    })

    this.MANY(() => {
      this.SUBRULE(this.ElseIfStatement, { LABEL: 'alternate' })
    })

    this.OPTION5(() => {
      this.SUBRULE(this.ElseStatement, { LABEL: 'alternate' })
    })

    this.OPTION6(() => {
      this.CONSUME(END_IF)
    })
  })

  protected ElseIfStatement = this.RULE('ElseIfStatement', () => {
    this.CONSUME(ELSE_IF)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' })

    this.OPTION1(() => {
      this.CONSUME(THEN)
    })
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.OPTION5(() => {
      this.SUBRULE2(this.BlockStatement, body)
    })
  })

  protected ElseStatement = this.RULE('ElseStatement', () => {
    let isBlock = false

    this.CONSUME(ELSE)

    this.OPTION1(() => {
      this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
      isBlock = true
    })

    this.OPTION2(() => {
      if (isBlock) {
        this.SUBRULE2(this.BlockStatement, body)
      } else {
        this.SUBRULE2(this.Statement, body)
      }
    })
  })

  protected ForStatement = this.RULE('ForStatement', () => {
    this.CONSUME(FOR)
    this.SUBRULE1(this.Identifier, { LABEL: 'counter' })
    this.CONSUME(EQUAL)
    this.SUBRULE(this.AssignmentExpression, { LABEL: 'init' })
    this.CONSUME(TO)
    this.SUBRULE2(this.ExpressionStatement, { LABEL: 'test' })

    this.OPTION(() => {
      this.CONSUME(STEP)
      this.SUBRULE3(this.ExpressionStatement, { LABEL: 'update' })
    })

    this.SUBRULE4(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.OPTION5(() => {
      this.SUBRULE5(this.BlockStatement, body)
    })

    this.OPTION1(() => {
      this.SUBRULE(this.NextStatement)
    })

    this.OPTION2(() => {
      this.CONSUME(END_FOR)
    })
  })

  protected ForEachStatement = this.RULE('ForEachStatement', () => {
    this.CONSUME(FOR)
    this.CONSUME(EACH)
    this.SUBRULE1(this.Identifier, { LABEL: 'counter' })
    this.CONSUME(IN)
    this.SUBRULE2(this.ExpressionStatement, { LABEL: 'countExpression' })
    this.SUBRULE3(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.SUBRULE(this.BlockStatement, body)

    this.OPTION1(() => {
      this.SUBRULE(this.NextStatement)
    })
    this.OPTION2(() => {
      this.CONSUME(END_FOR)
    })
  })

  protected GoToStatement = this.RULE('GoToStatement', () => {
    this.CONSUME(GOTO)
    this.SUBRULE1(this.Identifier)
  })

  protected LabeledStatement = this.RULE('LabeledStatement', () => {
    this.SUBRULE(this.Identifier, { LABEL: 'label' })
    this.CONSUME(COLON)
    this.CONSUME(NEWLINE)
  })

  protected LibraryStatement = this.RULE('LibraryStatement', () => {
    this.CONSUME(LIBRARY)
    this.CONSUME(STRING_LITERAL, { LABEL: 'path' })
  })

  protected NextStatement = this.RULE('NextStatement', () => {
    this.CONSUME(NEXT)
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
  })

  protected PrintStatement = this.RULE('PrintStatement', () => {
    this.CONSUME(PRINT)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.ExpressionStatement, { LABEL: 'value' }) },
        { ALT: () => this.CONSUME(COMMA) },
        { ALT: () => this.CONSUME(SEMICOLON) }
        //
      ])
    })
  })

  protected ReturnStatement = this.RULE('ReturnStatement', () => {
    this.CONSUME(RETURN)
    this.OPTION1(() => {
      this.SUBRULE(this.ExpressionStatement, { LABEL: 'argument' })
    })
  })

  protected StopStatement = this.RULE('StopStatement', () => {
    this.CONSUME(STOP)
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
  })

  protected WhileStatement = this.RULE('WhileStatement', () => {
    this.CONSUME(WHILE)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' })
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
    this.SUBRULE(this.BlockStatement, body)
    this.CONSUME(END_WHILE)
  })

  protected FunctionExpression = this.RULE('FunctionExpression', () => {
    this.CONSUME(FUNCTION)

    this.OPTION(() => {
      this.SUBRULE(this.ParameterList, { LABEL: 'params' })
    })

    this.OPTION1(() => {
      this.CONSUME(AS)
      this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' })
    })

    this.OPTION2(() => {
      this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
    })

    this.OPTION3(() => {
      this.SUBRULE(this.BlockStatement, body)
    })

    this.CONSUME(END_FUNCTION)
  })

  protected FunctionDeclaration = this.RULE('FunctionDeclaration', () => {
    this.CONSUME(FUNCTION)
    this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' })

    this.OPTION(() => {
      this.SUBRULE(this.ParameterList, { LABEL: 'params' })
    })

    this.OPTION1(() => {
      this.CONSUME(AS)
      this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' })
    })

    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.OPTION3(() => {
      this.SUBRULE(this.BlockStatement, body)
    })
    this.CONSUME(END_FUNCTION)
  })

  protected SubExpression = this.RULE('SubExpression', () => {
    this.CONSUME(SUB)

    this.OPTION(() => {
      this.SUBRULE(this.ParameterList, { LABEL: 'params' })
    })

    this.OPTION1(() => {
      this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })
    })

    this.OPTION2(() => {
      this.SUBRULE(this.BlockStatement, body)
    })

    this.CONSUME(END_SUB)
  })

  protected SubDeclaration = this.RULE('SubDeclaration', () => {
    this.CONSUME(SUB)
    this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' })

    this.OPTION1(() => {
      this.SUBRULE(this.ParameterList, { LABEL: 'params' })
    })

    this.OPTION2(() => {
      this.CONSUME(AS)
      this.SUBRULE(this.TypeAnnotation, { LABEL: 'ReturnType' })
    })

    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.OPTION3(() => {
      this.SUBRULE(this.BlockStatement, body)
    })

    this.CONSUME(END_SUB)
  })

  protected ParameterList = this.RULE('ParameterList', () => {
    this.CONSUME(OPEN_PAREN)

    this.MANY_SEP({
      SEP: COMMA,
      DEF() {
        this.SUBRULE2(this.Parameter)
      }
    })

    this.CONSUME(CLOSE_PAREN)
  })

  protected Parameter = this.RULE('Parameter', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.Literal) },
      { ALT: () => this.SUBRULE(this.Identifier) },
      { ALT: () => this.SUBRULE(this.ReservedWord) }
      //
    ])

    this.OPTION(() => {
      this.OPTION1(() => {
        this.CONSUME(EQUAL)
        this.SUBRULE(this.AssignmentExpression, { LABEL: 'value' })
      })

      this.OPTION2(() => {
        this.CONSUME(AS)
        this.SUBRULE(this.TypeAnnotation)
      })
    })
  })

  protected TypeAnnotation = this.RULE('TypeAnnotation', () => {
    this.CONSUME(BASE_TYPE)
  })

  protected ExpressionStatement = this.RULE('ExpressionStatement', () => {
    this.SUBRULE(this.AssignmentExpression)
  })

  protected AssignmentExpression = this.RULE('AssignmentExpression', () => {
    this.SUBRULE(this.AdditionExpression)
  })

  protected AdditionExpression = this.RULE('AdditionExpression', () => {
    this.SUBRULE1(this.MultiplicationExpression, { LABEL: 'left' })
    this.MANY(() => {
      this.CONSUME(ADDICTIVE_OPERATOR)
      this.SUBRULE2(this.MultiplicationExpression, right)
    })
  })

  protected MultiplicationExpression = this.RULE('MultiplicationExpression', () => {
    this.SUBRULE1(this.ShiftExpression, left)
    this.MANY(() => {
      this.CONSUME(MULTI_OPERATOR)
      this.SUBRULE2(this.ShiftExpression, right)
    })
  })

  protected ShiftExpression = this.RULE('ShiftExpression', () => {
    this.SUBRULE1(this.RelationExpression, left)
    this.MANY(() => {
      this.CONSUME(SHIFT_OPERATOR)
      this.SUBRULE2(this.RelationExpression, right)
    })
  })

  protected RelationExpression = this.RULE('RelationExpression', () => {
    this.SUBRULE1(this.EqualityExpression, left)
    this.MANY(() => {
      this.CONSUME(RELATIONAL_OPERATOR)
      this.SUBRULE2(this.EqualityExpression, right)
    })
  })

  protected EqualityExpression = this.RULE('EqualityExpression', () => {
    this.SUBRULE1(this.LogicExpression, left)
    this.MANY(() => {
      this.CONSUME(EQUALITY_OPERATOR)
      this.SUBRULE2(this.LogicExpression, right)
    })
  })

  protected LogicExpression = this.RULE('LogicExpression', () => {
    this.SUBRULE1(this.UnaryExpression, left)
    this.MANY(() => {
      this.CONSUME(LOGIC_OPERATOR)
      this.SUBRULE2(this.UnaryExpression, right)
    })
  })

  protected UnaryExpression = this.RULE('UnaryExpression', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.PostfixExpression) },
      {
        ALT: () => {
          this.CONSUME(UNARY)
          this.SUBRULE(this.UnaryExpression, right)
        }
      }
    ])
  })

  protected Arguments = this.RULE('Arguments', () => {
    this.CONSUME(OPEN_PAREN)

    this.MANY_SEP({
      SEP: COMMA,
      DEF() {
        this.SUBRULE(this.AssignmentExpression, { LABEL: 'param' })
      }
    })

    this.CONSUME(CLOSE_PAREN)
  })

  protected PostfixExpression = this.RULE('PostfixExpression', () => {
    this.SUBRULE(this.MemberExpression, left)
    this.OPTION(() => this.CONSUME(POSTFIX))
  })

  protected MemberExpression = this.RULE('MemberExpression', () => {
    this.SUBRULE(this.PrimaryExpression, { LABEL: 'id' })
    this.OPTION1(() => this.SUBRULE1(this.Arguments, { LABEL: 'args' }))

    this.MANY(() => {
      this.SUBRULE(this.MemberChunkExpression, { LABEL: 'properties' })
    })
  })

  protected MemberChunkExpression = this.RULE('MemberChunkExpression', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.BoxMemberExpression, { LABEL: 'property' }) },
      { ALT: () => this.SUBRULE(this.DotMemberExpression, { LABEL: 'property' }) }
    ])

    this.OPTION2(() => this.SUBRULE2(this.Arguments, { LABEL: 'args' }))
  })

  protected BoxMemberExpression = this.RULE('BoxMemberExpression', () => {
    this.CONSUME(OPEN_BRACKET)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'innerExpression' })
    this.CONSUME(CLOSE_BRACKET)
  })

  protected DotMemberExpression = this.RULE('DotMemberExpression', () => {
    this.OR1([ { ALT: () => this.CONSUME(PERIOD, operator) }, { ALT: () => this.CONSUME(ATTRIBUTE, operator) } ])

    this.OR2([
      { ALT: () => this.SUBRULE(this.Identifier, right) },
      { ALT: () => this.SUBRULE(this.ArrayExpression, right) },
      { ALT: () => this.SUBRULE(this.ReservedWord, right) }
    ])
  })

  protected PrimaryExpression = this.RULE('PrimaryExpression', () => {
    this.OR(
      this.cachePrimaryExpression ||
        (this.cachePrimaryExpression = [
          { ALT: () => this.SUBRULE(this.ArrayExpression) },
          { ALT: () => this.SUBRULE(this.ObjectExpression) },
          { ALT: () => this.SUBRULE(this.FunctionExpression) },
          { ALT: () => this.SUBRULE(this.SubExpression) },
          { ALT: () => this.SUBRULE(this.ParenthesisExpression) },
          { ALT: () => this.SUBRULE(this.Identifier) },
          { ALT: () => this.SUBRULE(this.ReservedWord) },
          { ALT: () => this.SUBRULE(this.Literal) }
        ])
    )
  })

  protected ParenthesisExpression = this.RULE('ParenthesisExpression', () => {
    this.CONSUME(OPEN_PAREN)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'innerExpression' })
    this.CONSUME(CLOSE_PAREN)
  })

  protected Literal = this.RULE('Literal', () => {
    this.CONSUME(LITERAL)

    this.OPTION(() => {
      this.CONSUME(TYPE_DECLARATION)
    })
  })

  protected UnTypedIdentifier = this.RULE('UnTypedIdentifier', () => {
    this.CONSUME(IDENTIFIER)
  })

  protected Identifier = this.RULE('Identifier', () => {
    this.SUBRULE(this.UnTypedIdentifier, { LABEL: 'id' })
    this.OPTION(() => {
      this.CONSUME(TYPE_DECLARATION, { LABEL: 'asType' })
    })
  })

  protected ReservedWord = this.RULE('ReservedWord', () => {
    this.OR(
      this.cacheReservedWord ||
        (this.cacheReservedWord = [
          { ALT: () => this.CONSUME(END) },
          { ALT: () => this.CONSUME(OBJECT) },
          { ALT: () => this.CONSUME(STOP) },
          { ALT: () => this.CONSUME(NEXT) },
          { ALT: () => this.CONSUME(BOOLEAN) },
          { ALT: () => this.CONSUME(INTEGER) },
          { ALT: () => this.CONSUME(LONGINTEGER) },
          { ALT: () => this.CONSUME(STRING) }
          //
        ])
    )
  })

  protected ConditionalCompilationStatement = this.RULE('ConditionalCompilationStatement', () => {
    this.OR(
      this.cacheConditionalCompilationStatement ||
        (this.cacheConditionalCompilationStatement = [
          { ALT: () => this.SUBRULE(this.ConditionalConst) },
          { ALT: () => this.SUBRULE(this.ConditionalError) },
          { ALT: () => this.SUBRULE(this.ConditionalIfStatement) }
          //
        ])
    )
  })

  protected ConditionalConst = this.RULE('ConditionalConst', () => {
    this.CONSUME(CONDITIONAL_CONST)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'assignment' })
  })

  protected ConditionalError = this.RULE('ConditionalError', () => {
    this.CONSUME(CONDITIONAL_ERROR)
  })

  protected ConditionalIfStatement = this.RULE('ConditionalIfStatement', () => {
    this.CONSUME(CONDITIONAL_IF)
    this.SUBRULE1(this.ExpressionStatement, { LABEL: 'test' })
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.SUBRULE2(this.BlockStatement, body)

    this.MANY2(() => {
      this.SUBRULE(this.ConditionalElseIfStatement, { LABEL: 'alternate' })
    })

    this.OPTION3(() => {
      this.SUBRULE(this.ConditionalElseStatement, { LABEL: 'alternate' })
    })

    this.OPTION4(() => {
      this.CONSUME(CONDITIONAL_END_IF)
    })
  })

  protected ConditionalElseIfStatement = this.RULE('ConditionalElseIfStatement', () => {
    this.CONSUME(CONDITIONAL_ELSE_IF)
    this.SUBRULE(this.ExpressionStatement, { LABEL: 'test' })
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.SUBRULE2(this.BlockStatement, body)
  })

  protected ConditionalElseStatement = this.RULE('ConditionalElseStatement', () => {
    this.CONSUME(CONDITIONAL_ELSE)
    this.SUBRULE(this.EndOfStatement, { LABEL: 'trailingComments' })

    this.SUBRULE2(this.BlockStatement, body)
  })

  protected Comment = this.RULE('Comment', () => {
    this.OR([
      { ALT: () => this.CONSUME(COMMENT_QUOTE) },
      { ALT: () => this.CONSUME(COMMENT_REM) }
      //
    ])
  })

  protected EndOfStatement = this.RULE('EndOfStatement', () => {
    this.OPTION(() => {
      this.SUBRULE(this.Comment)
    })
    this.CONSUME(TERMINATOR)
  })

  private cacheStatement: any = undefined
  private cacheReservedWord: any = undefined
  private cachePrimaryExpression: any = undefined
  private cacheConditionalCompilationStatement: any = undefined

  constructor(input: IToken[]) {
    super(input, ALL_TOKENS, {
      outputCst: true,
      recoveryEnabled: false
    })
    Parser.performSelfAnalysis(this)
  }
}

export const parserInstance = new RokuBRSParser([])

const tokens = (list = []) => {
  return list.map((t) => {
    return {
      loc: { start: { column: t.startColumn, line: t.startLine }, end: { column: t.endColumn, line: t.endLine } },
      range: [ t.startOffset, t.endOffset ],
      type: t.tokenType.tokenName,
      value: t.image
    }
  })
}

export function parse(source, entryPoint = 'Program'){
  const lexingResult = BRSLexer.tokenize(source)
  parserInstance.input = lexingResult.tokens

  const value = parserInstance[entryPoint]()

  return {
    lexErrors: lexingResult.errors,
    parseErrors: parserInstance.errors,
    parserInstance,
    tokens: tokens(lexingResult.tokens),
    value
  }
}
