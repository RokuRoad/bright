import { ASTVisitor } from './ASTVisitor'
import { BaseASTWalker } from './ASTWalker'
import { parse, RokuBRSParser } from './Parser'
import { ALL_TOKENS } from './Tokens'

import { visitorKeys } from './VisitorKeys'

const visitor = new ASTVisitor()

/**
 * Build an AST from source
 * @param source BrightScript sources
 * @param type Node to start with
 */
const ast = (source: string, type = 'Program') => {
  const { value, tokens, parseErrors, lexErrors } = parse(source, type)
  const props = { tokens, parseErrors, lexErrors }

  const tree = visitor.visit(value, props)

  if (parseErrors.length) {
    const { message, token } = parseErrors[0]

    const column = token.startColumn
    const line = token.startLine

    const err = new SyntaxError(`${message} at ${line}:${column}`)

    err.lineNumber = line
    err.column = column

    throw err
  }

  return tree
}

export { RokuBRSParser, ASTVisitor, ALL_TOKENS, parse, ast, visitorKeys, BaseASTWalker }
