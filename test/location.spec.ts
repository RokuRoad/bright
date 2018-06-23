import { sourceAST } from './helpers'

describe('Location tests', () => {
  test.only('Should identify location of print statement', () => {
    expect(() => {
      const ast = sourceAST(`print a, b, c`, 'BlockStatement')
      const ast2 = sourceAST(`? a, b, c`, 'BlockStatement')

      expect(ast.range).toEqual([0, 13])
      expect(ast2.range).toEqual([0, 9])
    }).not.toThrow()
  })
})
