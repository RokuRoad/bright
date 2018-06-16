import { fileAST, sourceAST } from './helpers'
import { inspect } from 'util'

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

  test.only('Should be able parse inline AST with comments', () => {
    expect(() => {
      const ast = sourceAST(`
      ' /**
      '  * @member intersection
      '  * @memberof module:rodash
      '  * @instance
      '  * @description Return a new array of items from the first which are also in the second.
      '  * @param {Array} first
      '  * @param {Array} second
      '  * @example
      '  *
      '  * intersection = _.intersection([1,2], [2])
      '  * ' => [2]
      '  */
      Function rodash_intersection_(first, second)        '1
        result = []                                       '2

        a = {
          c:  4        ' 55
          e:  "dd"     ' 66
        }

        for each f in first                               '3
          for each s in second                            '4
            if m.equal(s,f) then result.push(f)           '5
          end for                                         '6
        end for                                           '7
        return result                                     '8
      End Function                                        '9
      `)

      // console.log(inspect(ast, false, null, true))
    }).not.toThrow()
  })
})
