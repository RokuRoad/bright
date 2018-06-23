import { sourceAST } from './helpers'

describe('Location tests', () => {
  test('Should identify location of statement', () => {
    expect(() => {
      const ast = sourceAST(`print a, b, c`, 'BlockStatement')
      const ast2 = sourceAST(`? a, b, c`, 'BlockStatement')

      expect(ast.range).toEqual([0, 13])
      expect(ast2.range).toEqual([0, 9])
    }).not.toThrow()
  })

  test('Should identify location of multiline statement', () => {
    expect(() => {
      const ast = sourceAST(['function gotoStatement()', '  mylabel:', '  print "Anthony was here!"', '', ' goto mylabel', 'end function', ''].join('\n'))

      expect(ast.range).toEqual([0, 92])
    }).not.toThrow()
  })
})
