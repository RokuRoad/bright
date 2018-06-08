import { mapValues } from 'lodash'
import * as TOKENS from './Tokens'

const IGNORED_TOKENS = mapValues(TOKENS, () => [])

const visitorKeys = {
  ...IGNORED_TOKENS,
  AdditionExpression: [ 'left', 'right', 'operator' ],
  Arguments: [ 'param' ],
  ArrayElement: [ 'value', 'trailingComments' ],
  ArrayExpression: [ 'elements' ],
  AssignmentExpression: [ 'left', 'right', 'operator' ],
  BlockStatement: [ 'body' ],
  BoxMemberExpression: [ 'innerExpression' ],
  CallExpression: [ 'arguments', 'callee' ],
  Comment: [],
  ConditionalElseStatement: [ 'body' ],
  ConditionalIfStatement: [ 'alternate', 'body', 'test' ],
  DotMemberExpression: [ 'operator', 'right' ],
  ElseIfStatement: [ 'test', 'body' ],
  ElseStatement: [ 'body' ],
  EmptyStatement: [],
  ForEachStatement: [ 'countExpression', 'body' ],
  ForStatement: [ 'init', 'test', 'update', 'body' ],
  FunctionDeclaration: [ 'id', 'ReturnType', 'params', 'body' ],
  FunctionExpression: [ 'body', 'params', 'ReturnType' ],
  Identifier: [ 'asType', 'name' ],
  IfStatement: [ 'test', 'consequent', 'alternate' ],
  LibraryStatement: [],
  Literal: [],
  LogicExpression: [ 'operator', 'left', 'right' ],
  MemberExpression: [ 'computed', 'object', 'properties' ],
  MultiplicationExpression: [ 'operator', 'left', 'right' ],
  NextStatement: [],
  ObjectExpression: [ 'properties', 'trailingComments' ],
  Parameter: [ 'name', 'TypeAnnotation', 'value' ],
  ParameterList: [ 'arguments' ],
  ParenthesisExpression: [ 'expression' ],
  PostfixExpression: [ 'operator', 'argument' ],
  PrintStatement: [ 'value' ],
  Program: [ 'body' ],
  Property: [ 'key', 'value' ],
  RelationExpression: [ 'left', 'right', 'operator' ],
  ReturnStatement: [ 'argument' ],
  StopStatement: [],
  SubDeclaration: [ 'id', 'params', 'body', 'ReturnType' ],
  SubExpression: [ 'body', 'params' ],
  TypeAnnotation: [],
  UnaryExpression: [ 'operator', 'argument' ],
  UnTypedIdentifier: [ 'name' ],
  WhileStatement: [ 'test', 'body' ]
}

export { visitorKeys }
