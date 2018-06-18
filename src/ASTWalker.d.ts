export interface ASTWalker<ASTNode> {
  Program(ctx): ASTNode
  LibraryStatement(ctx): ASTNode
  UnTypedIdentifier({ name }): ASTNode
  STRING_LITERAL(ctx): ASTNode
  ParameterList(ctx): ASTNode
  AdditionExpression(ctx): ASTNode
  AssignmentExpression(ctx): ASTNode
  MultiplicationExpression(ctx): ASTNode
  LogicExpression(ctx): ASTNode
  ParenthesisExpression(ctx): ASTNode
  ArrayElement(ctx): ASTNode
  ArrayExpression(ctx): ASTNode
  CallExpression(ctx): ASTNode
  ConditionalConst(ctx): ASTNode
  ConditionalElseIfStatement(ctx): ASTNode
  ConditionalElseStatement(ctx): ASTNode
  ConditionalError(ctx): ASTNode
  ConditionalIfStatement(ctx): ASTNode
  DimStatement(ctx): ASTNode
  DotMemberExpression(ctx): ASTNode
  ElseIfStatement(ctx): ASTNode
  ElseStatement(ctx): ASTNode
  EmptyStatement(ctx): ASTNode
  Comment({ value, trailingComments }): ASTNode
  ForEachStatement(ctx): ASTNode
  ForStatement(ctx): ASTNode
  FunctionDeclaration(ctx): ASTNode
  FunctionExpression(ctx): ASTNode
  GoToStatement(ctx): ASTNode
  IfStatement(ctx): ASTNode
  Literal({ value }): ASTNode
  MemberExpression(ctx): ASTNode
  NextStatement(ctx): ASTNode
  PostfixExpression(ctx): ASTNode
  PrintStatement(ctx): ASTNode
  RelationExpression(ctx): ASTNode
  ReturnStatement(ctx): ASTNode
  StopStatement(ctx): ASTNode
  SubDeclaration(ctx): ASTNode
  SubExpression(ctx): ASTNode
  UnaryExpression(ctx): ASTNode
  WhileStatement(ctx): ASTNode
  BlockStatement(ctx): ASTNode
  TypeAnnotation({ value }): ASTNode
  ObjectExpression(ctx): ASTNode
  Parameter(ctx): ASTNode
  Identifier(ctx): ASTNode
  Property(ctx): ASTNode
  Arguments(ctx): ASTNode
  visit(ctx): { [key: string]: ASTNode | ASTNode[] }
  asArray(value: ASTNode[] | ASTNode): ASTNode[]
  binary(ctx): ASTNode[]
  mergeOperands(from: ASTNode[], to: ASTNode[], dividers: ASTNode[]): ASTNode[]
}
