export interface ASTNode extends Location {
  type: string
  trailing?: ASTNode[] | ASTNode | string

  [key: string]: any
}

export interface BinaryASTNode extends ASTNode {
  left: ASTNode
  right: ASTNode
  operator: ASTNode
}

export interface ContextProps {
  tokens: Token[]
}

export interface Token {}

export interface NodeContext {
  [key: string]: any
}

export interface ProgramNode extends NodeContext {
  Declaration: ASTNode[]
  Empty: ASTNode[]
}

export interface TokenContext {
  startLine: number
  startColumn: number
  image: string
  endLine: number
  endColumn: number
  startOffset: number
  endOffset: number
  tokenType: {
    tokenName: string
  }
}

export interface Location {
  loc: {
    start: Position
    end: Position
    source?: string
  }
  range?: [number, number]
}
export interface Position {
  line: number
  column: number
}

declare global {
  interface SyntaxError {
    lineNumber: number
    column: number
  }
}
