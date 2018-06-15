import { parse, ast } from '../src/main'

import { error } from './helpers'

describe('Some Parsing errors', () => {
  it('Should be able to find parser errors in program', () => {
    const { parseErrors } = parse('Lbrry "ads"')

    expect(parseErrors.length).toEqual(1)
    expect(error(parseErrors[0], 'Lbrry "ads"')).toBeTruthy()
  })

  it('Should be able to find parser errors in function', () => {
    const { parseErrors } = parse(`function a end function`)

    expect(parseErrors.length).toEqual(1)
    expect(error(parseErrors[0], `function a end function`)).toBeTruthy()
  })

  it('Should throw an exception', () => {
    expect(() => {
      const { parseErrors } = ast(`function a end function`)

      expect(parseErrors.length).toEqual(1)
      expect(error(parseErrors[0], `function a end function`)).toBeTruthy()
    }).toThrow()
  })
})
