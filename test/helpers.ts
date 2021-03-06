import { codeFrameColumns } from '@babel/code-frame'
import { readFileSync } from 'fs'
import { sync } from 'glob'
import { inspect } from 'util'
import { ast, parse } from '../src/main'
/**
 * Read source code and produce parsed information
 *
 * @param source Brightscript code
 * @param type Entry point for the parser. Default is Program that means .brs file
 *
 * @returns object with value, tokens and errors
 */
export const scanSource = (source: string, type = 'Program') => {
  const { value, lexErrors, tokens, parseErrors } = parse(source, type)

  expect(lexErrors.length).toEqual(0)
  expect(parseErrors.length).toEqual(0)

  expect(tokens).toBeTruthy()
  expect(value).toBeTruthy()

  return { value, lexErrors, tokens, parseErrors }
}

/**
 * Build AST tree from the file
 * @param path Path to BrightScript file
 */
export const fileAST = (path: string, type = 'Program') => {
  const source = readFileSync(path, 'utf8')
  return sourceAST(source, type)
}

/**
 * Build AST tree from the source
 * @param path Path to BrightScript file
 */
export const sourceAST = (source: string, type = 'Program') => {
  return ast(source, type)
}

/**
 * Read source code file and pass source to scanSource()
 *
 * @param path File path
 *
 * @returns object with value, tokens and errors
 */
export const scanFile = (path: string) => {
  const source = readFileSync(path, 'utf8')

  return scanSource(source)
}

/**
 * Returns list of files using pattern
 * @param path Pattern for glob
 */
export const files = (path: string) => sync(path)

/**
 * Renders code frame with error location
 * @param err Error object in form of Parser error
 * @param location
 */
export const error = ({ message, location }, source: string): string => {
  return codeFrameColumns(source, location, { highlightCode: true, message })
}

export const print = (value: any) => {
  // tslint:disable-next-line:no-console
  console.log(inspect(value, false, null, true))
}

describe('Testing utils', () => {
  test('Helpers exists', () => {
    expect(scanFile).toBeTruthy()
    expect(scanSource).toBeTruthy()
    expect(files).toBeTruthy()
  })
})
