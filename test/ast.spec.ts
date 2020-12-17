import { fileAST, sourceAST /* , print */ } from "./helpers";

describe("AST", () => {
  test("Should be able to Parse AST", () => {
    expect(() => {
      fileAST(__dirname + "/assets/rodash.brs");
    }).not.toThrow();
  });

  test("Should be able to walk AST", () => {
    expect(() => {
      fileAST(__dirname + "/assets/syntax.brs");
    }).not.toThrow();
  });

  test("Should be able parse inline AST #1", () => {
    expect(() => {
      sourceAST("c[x, y, z] = k", "BlockStatement");
    }).not.toThrow();
  });

  test("Should be able parse inline AST #2", () => {
    expect(() => {
      sourceAST('Library "lib1"');
    }).not.toThrow();
  });

  test("Should be able parse inline AST with comments", () => {
    expect(() => {
      sourceAST(`
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
      `);

      // console.log(inspect(ast, false, null, true))
    }).not.toThrow();
  });

  test("Should be able parse inline AST #3", () => {
    expect(() => {
      /* const ast =  */ sourceAST('m.top.findNode("label")', "BlockStatement");

      // print(ast)
    }).not.toThrow();
  });

  test("Should be able parse reserved words", () => {
    expect(() => {
      sourceAST(
        `
      m.stop.findNode("label")

      a = {
        in:5
        stop:10
        mod: 5
        next: function(mod)
                print b
              end function
      }

      mod = "stop"

      `,
        "BlockStatement"
      );
    }).not.toThrow();
  });
  test("Should be able parse try catch", () => {
    expect(() => {
      sourceAST(
        `try
            m.stop.findNode("label")

            a = {
                in:5
                stop:10
                mod: 5
                next: function(mod)
                        print b
                    end function
            }

            mod = "stop"
        catch e 
        end try`,
        "RokuTryStatement"
      );
    }).not.toThrow();
  });
});
