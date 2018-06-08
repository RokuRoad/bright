import { readFileSync } from 'fs'
import { sync } from 'glob'
import { ast, parse } from '../src/main'

export const scanSource = (source: string, type = 'Program') => {
  const { value, lexErrors, tokens, parseErrors } = parse(source, type)

  expect(lexErrors.length).toEqual(0)
  expect(parseErrors.length).toEqual(0)

  expect(tokens).toBeTruthy()
  expect(value).toBeTruthy()

  return ast(value)
}

export const scanFile = (path: string) => {
  const source = readFileSync(path, 'utf8')

  return scanSource(source)
}

export const files = (path: string) => sync(path)

describe('Testing utils', () => {
  test('Helpers exists', () => {
    expect(scanFile).toBeTruthy()
    expect(scanSource).toBeTruthy()
    expect(files).toBeTruthy()
  })
})
