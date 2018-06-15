import { filter, first, isArray, isUndefined, keys, map, mapKeys, NumericDictionary, values } from 'lodash'
import { RokuBRSParser } from './Parser'
import { ASTNode, BinaryASTNode, ContextProps, Location, NodeContext, Position, TokenContext } from './types/AST'

const parser = new RokuBRSParser([])
const Visitor = parser.getBaseCstVisitorConstructor()

export class BaseVisitor extends Visitor {
  constructor() {
    super()
  }

  public visit(cstNode: NodeContext, param?: ContextProps) {
    if (isArray(cstNode)) {
      cstNode = cstNode[0]
    }

    if (isUndefined(cstNode)) {
      return undefined
    }

    return this[cstNode.fullName || cstNode.name](cstNode.children, param)
  }

  protected byLine(elements: ASTNode[] = []): NumericDictionary<ASTNode> {
    return mapKeys<ASTNode>(this.asArray(elements), (el: ASTNode): number => {
      return el.loc && el.loc.start.line
    })
  }

  protected asArray(value: ASTNode | ASTNode[] = []): ASTNode[] {
    if (!value) {
      return []
    }
    return isArray(value) ? filter(value) : [ value ]
  }

  protected mergeTrailing(elements: ASTNode[] = [], trailing: ASTNode[] = []): ASTNode[] {
    const linedElements = this.byLine(elements)
    const linedTrailing = this.byLine(trailing)

    const merger = (el: ASTNode, line: number): ASTNode => {
      if (linedTrailing[line]) {
        el.trailing = linedTrailing[line]
      }

      return el
    }

    return map<ASTNode>(linedElements, merger) as any
  }

  protected Location(head: ASTNode, tail: ASTNode): Location {
    if (!head || !tail) {
      return { loc: null, range: null }
    }

    const range: [number, number] = [ null, null ]
    const loc = { start: { line: null, column: null }, end: { line: null, column: null } }

    if (head.loc !== null) {
      loc.start = head.loc.start
    }

    if (tail.loc !== null) {
      loc.end = tail.loc.end
    }

    if (head.range !== null) {
      range[0] = head.range[0]
    }

    if (tail.range !== null) {
      range[1] = tail.range[1]
    }

    return { loc, range }
  }

  protected RenderNode(node): ASTNode {
    const visitor = (subNode) => {
      return this.visit(subNode)
    }
    const mapped = filter(map(node, (subNode) => visitor(subNode)))

    return mapped.length === 1 ? mapped[0] : mapped
  }

  protected mergeOperands(from = [], to = [], dividers = []): ASTNode[] {
    while (from.length) {
      to.push(dividers.shift())
      to.push(from.shift())
    }

    return filter(to)
  }

  protected flatListExpression(type: string, operator: ASTNode, left: ASTNode, right: ASTNode): ASTNode {
    const head = isArray(left) ? first(left) : left
    const tail = isArray(right) ? first(right) : right

    const binary: BinaryASTNode = { type, operator, left, right, ...this.Location(head, tail) }

    return this.asNode(binary, {})
  }

  protected mapArguments(ctx: NodeContext, cb: (_: { [key: string]: ASTNode }) => ASTNode): ASTNode | null {
    const _ = {}

    map(ctx, (node, key: string) => {
      this.isToken(node) ? (_[key] = this.RenderToken(node)) : (_[key] = this.RenderNode(node))
    })

    if (cb) {
      return cb(_)
    }

    return null
  }

  protected isToken(node: ASTNode): boolean {
    return node && node[0] && node[0].tokenType
  }

  protected singleNode(ctx: NodeContext): ASTNode {
    const data = this.singleArgument(ctx)
    return this.asNode(data as ASTNode, ctx)
  }

  protected singleArgument(ctx: NodeContext): ASTNode | false {
    const names = keys(ctx)

    if (names.length !== 1) {
      return false
    }

    return this.mapArguments(ctx, (nodes) => first(values(nodes)))
  }

  protected Position(line: number, column: number): Position {
    return { line, column }
  }

  protected RenderToken(node): ASTNode | ASTNode[] {
    const mapper = ({
      startLine,
      startColumn,
      image,
      endLine,
      endColumn,
      startOffset,
      endOffset,
      tokenType
    }: TokenContext): ASTNode => {
      const start = this.Position(startLine, startColumn)
      const end = this.Position(endLine, endColumn)

      return {
        loc: { source: image, start, end },
        range: [ startOffset, endOffset ],
        type: tokenType.tokenName
      }
    }

    const mapped = map(node, mapper)

    return mapped.length === 1 ? mapped[0] : mapped
  }

  protected asNode(data: ASTNode, _: NodeContext): ASTNode {
    return data
  }
}
