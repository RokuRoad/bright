# Bright

[![npm version](https://img.shields.io/npm/v/@roku-road/bright.svg)](https://www.npmjs.com/package/@roku-road/bright)
[![Downloads/month](https://img.shields.io/npm/dm/@roku-road/bright.svg)](http://www.npmtrends.com/@roku-road/bright)
[![Build Status](https://travis-ci.com/RokuRoad/bright.svg?branch=master)](https://travis-ci.com/RokuRoad/@roku-road/bright)
[![CircleCI](https://img.shields.io/circleci/project/github/RokuRoad/bright.svg?style=for-the-badge)](https://github.com/RokuRoad/bright)
[![Coverage Status](https://codecov.io/gh/RokuRoad/bright/branch/master/graph/badge.svg)](https://codecov.io/gh/RokuRoad/bright)
[![Dependency Status](https://david-dm.org/RokuRoad/bright.svg)](https://david-dm.org/RokuRoad/bright) [![Greenkeeper badge](https://badges.greenkeeper.io/RokuRoad/bright.svg)](https://greenkeeper.io/)
[![CodeFactor](https://www.codefactor.io/repository/github/RokuRoad/bright/badge)](https://www.codefactor.io/repository/github/RokuRoad/bright)
## What is Bright?

Blazing fast parser for BrightScript that gives you ESTree like AST. Sort of.
The motivation behind this project is to build solid platform and base for other development tools in Roku world. This parser takes .brs files and build AST in form of ESTree like structure that could be used with ESLit, Prettier or other tools for linting, refactoring and formatting.

This project uses awesome https://github.com/SAP/chevrotain parser engine, performance tests : https://sap.github.io/chevrotain/performance/


### Performance

While there is no official metrics yet, during development it continuesly got tested on ~800 random open source project files from Github.

![Tokei](https://github.com/RokuRoad/bright/blob/master/docs/tokei.png)

Thanks, [Tokei](https://github.com/Aaronepower/tokei)

![Tests](https://github.com/RokuRoad/bright/blob/master/docs/tests.png)

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


## Example
``` brightscript
Library "ads"
```

Will produce

#### Tokens
``` javascript
 [ { loc: { start: { column: 1, line: 1 }, end: { column: 7, line: 1 } },
           range: [ 0, 6 ],
           type: 'LIBRARY',
           value: 'Library' },
         { loc: { start: { column: 9, line: 1 }, end: { column: 13, line: 1 } },
           range: [ 8, 12 ],
           type: 'STRING_LITERAL',
           value: '"ads"' } ]
```
and value
```javascript
    { value:
       { name: 'Program',
         children:
          { Declaration:
             [ { name: 'LibraryStatement',
                 children:
                  { LIBRARY:
                     [ { image: 'Library',
                         startOffset: 0,
                         endOffset: 6,
                         startLine: 1,
                         endLine: 1,
                         startColumn: 1,
                         endColumn: 7,
                         tokenTypeIdx: 39 } ],
                    path:
                     [ { image: '"ads"',
                         startOffset: 8,
                         endOffset: 12,
                         startLine: 1,
                         endLine: 1,
                         startColumn: 9,
                         endColumn: 13,
                         tokenTypeIdx: 79
                           ],
                            tokenTypeIdx: 79,
                            categoryMatches: [],
                            categoryMatchesMap: {},
                            tokenName: 'STRING_LITERAL',
                            isParent: false } } ] } } ],
            EOF:
             [ { image: '',
                 startOffset: NaN,
                 endOffset: NaN,
                 startLine: NaN,
                 endLine: NaN,
                 startColumn: NaN,
                 endColumn: NaN,
                 tokenTypeIdx: 1,
                 } ] } } }
```

### Errors
Lets say we forget to put a new line after function signature declaration

```brightscript
function a end function
```

```javascript
[ Error {
           name: 'MismatchedTokenException',
           message: 'Expecting token of type --> TERMINATOR <-- but found --> \'end function\' <--',
           token:
            { image: 'end function',
              startOffset: 11,
              endOffset: 22,
              startLine: 1,
              endLine: 1,
              startColumn: 12,
              endColumn: 23,
              tokenTypeIdx: 29,
              tokenType:
               { PATTERN: [Function: pattern],
                 tokenTypeIdx: 29,
                 CATEGORIES: [],
                 categoryMatches: [],
                 categoryMatchesMap: {},
                 tokenName: 'END_FUNCTION',
                 isParent: false,
                 LONGER_ALT:
                  { PATTERN: /([A-Za-z_]+[A-Za-z0-9_]*)/,
                    tokenTypeIdx: 3,
                    CATEGORIES: [],
                    categoryMatches: [],
                    categoryMatchesMap: {},
                    tokenName: 'IDENTIFIER',
                    isParent: false },
                 START_CHARS_HINT: [ 'E', 'e' ] } },
           resyncedTokens: [],
           context:
            { ruleStack: [ 'Program', 'FunctionDeclaration', 'EndOfStatement' ],
              ruleOccurrenceStack: [ 0, 0, 0 ] } } ]
```

##### Rendered as

```
    > 1 | function a end function
        |            ^^^^^^^^^^^ Expecting token of type --> TERMINATOR <-- but found --> 'end function' <--
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
Please check generated https://github.com/RokuRoad/bright/blob/master/diagram/index.html for details
