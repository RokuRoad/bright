import { fileAST, sourceAST } from './helpers'

describe('AST', () => {
  test('Should be able to Parse AST', () => {
    expect(() => {
      fileAST(__dirname + '/assets/rodash.brs')
    }).not.toThrow()
  })

  test('Should be able to walk AST', () => {
    expect(() => {
      fileAST(__dirname + '/assets/syntax.brs')
    }).not.toThrow()
  })

  test('Should be able parse inline AST #1', () => {
    expect(() => {
      sourceAST('c[x, y, z] = k', 'BlockStatement')
    }).not.toThrow()
  })

  test('Should be able parse inline AST #2', () => {
    expect(() => {
      sourceAST('Library "lib1"')
    }).not.toThrow()
  })
})
