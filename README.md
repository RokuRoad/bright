# Bright

[![Build Status](https://travis-ci.com/RokuRoad/bright.svg?branch=develop)](https://travis-ci.com/RokuRoad/bright)
[![Build Status](https://semaphoreci.com/api/v1/ialpert/bright/branches/develop/badge.svg)](https://semaphoreci.com/ialpert/bright)
[![Coverage Status](https://coveralls.io/repos/github/RokuRoad/bright/badge.svg?branch=develop)](https://coveralls.io/github/RokuRoad/bright?branch=develop)
[![dependencies Status](https://david-dm.org/RokuRoad/bright/status.svg)](https://david-dm.org/RokuRoad/bright)

## What is Bright?

Blazing fast parser for BrightScript that gives you ESTree like AST. Sort of.
The motivation behind this project is to build solid platform and base for other development tools in Roku world. This parser takes .brs files and build AST in form of ESTree like structure that could be used with ESLit, Prettier or other tools for linting, refactoring and formatting.

This project uses awesome https://github.com/SAP/chevrotain parser engine, performance tests : https://sap.github.io/chevrotain/performance/

Project is written in TypeScript and compiles to JS

## Installation

```yarn```


## Usage

```typescript
import { ast, parse } from '@roku-road/bright'

export const scanSource = (source: string, type = 'Program') => {
  const { value, lexErrors, tokens, parseErrors } = parse(source, type)
  
  //...
  
  return ast(value)
}
```


Bright consists of Tokens, Parser and Visitors. Please see *Chevrotain* project for details

| Element       | Description |
| ---           | ---         |
| RokuBRSParser | Heart of the project, defined structure of nodes |
| ASTVisitor    | Visitor that walks parsed CST and produce AST for other tools |
| ALL_TOKENS    | Map of the tokens, literals, punctuation etc |
| parse         | API function to get parsed value, lexer and parser errors |
| ast           | API function to get AST tree value, lexer and parser errors |
| visitorKeys   | Map for walking though the tree (to avoid blind iteration) |

## Grammar
Please check generated https://github.com/RokuRoad/bright/blob/develop/diagram/index.html for details


## AST Nodes

| Node | Properties |
| --- | --- |
| AdditionExpression |      [ 'left', 'right', 'operator' ]
| Arguments |               [ 'param' ]
| ArrayElement |            [ 'value', 'trailingComments' ]
| ArrayExpression |         [ 'elements' ]
| AssignmentExpression |    [ 'left', 'right', 'operator' ]
| BlockStatement |          [ 'body' ]
| BoxMemberExpression |     [ 'innerExpression' ]
| CallExpression |          [ 'arguments', 'callee' ]
| Comment |                 []
| ConditionalElseStatement |[ 'body' ]
| ConditionalIfStatement |  [ 'alternate', 'body', 'test' ]
| DotMemberExpression |     [ 'operator', 'right' ]
| ElseIfStatement |         [ 'test', 'body' ]
| ElseStatement |           [ 'body' ]
| EmptyStatement |          []
| ForEachStatement | [ 'countExpression', 'body' ]
| ForStatement | [ 'init', 'test', 'update', 'body' ]
| FunctionDeclaration | [ 'id', 'ReturnType', 'params', 'body' ]
| FunctionExpression | [ 'body', 'params', 'ReturnType' ]
| Identifier | [ 'asType', 'name' ]
| IfStatement | [ 'test', 'consequent', 'alternate' ]
| LibraryStatement | []
| Literal | []
| LogicExpression | [ 'operator', 'left', 'right' ]
| MemberExpression | [ 'computed', 'object', 'properties' ]
| MultiplicationExpression | [ 'operator', 'left', 'right' ]
| NextStatement | []
| ObjectExpression | [ 'properties', 'trailingComments' ]
| Parameter | [ 'name', 'TypeAnnotation', 'value' ]
| ParameterList | [ 'arguments' ]
| ParenthesisExpression | [ 'expression' ]
| PostfixExpression | [ 'operator', 'argument' ]
| PrintStatement | [ 'value' ]
| Program | [ 'body' ]
| Property | [ 'key', 'value' ]
| RelationExpression | [ 'left', 'right', 'operator' ]
| ReturnStatement | [ 'argument' ]
| StopStatement | []
| SubDeclaration | [ 'id', 'params', 'body', 'ReturnType' ]
| SubExpression | [ 'body', 'params' ]
| TypeAnnotation | []
| UnaryExpression | [ 'operator', 'argument' ]
| UnTypedIdentifier | [ 'name' ]
| WhileStatement | [ 'test', 'body' ]
