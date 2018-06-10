import { ASTVisitor } from './ASTVisitor'
import { parse, RokuBRSParser } from './Parser'
import { ALL_TOKENS } from './Tokens'

import { visitorKeys } from './VisitorKeys'

const visitor = new ASTVisitor()

const ast = (source) => {
  const { value, tokens, parseErrors, lexErrors } = parse(source)
  const props = { tokens, parseErrors, lexErrors, parent: null }

  const tree = visitor.visit(value, props)

  if (parseErrors.length) {
    const { message, token } = parseErrors[0]

    const err = new SyntaxError(message)

    err.lineNumber = token.startLine
    err.column = token.startColumn

    throw err
  }

  return tree
}

export { RokuBRSParser, ASTVisitor, ALL_TOKENS, parse, ast, visitorKeys }
