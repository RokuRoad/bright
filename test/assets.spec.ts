import { files, scanFile } from './helpers'

describe.skip('Asset tests', () => {
  files(__dirname + '/assets/**/*.brs').forEach((path: string) => {
    test(path, () => {
      expect(scanFile(path)).toBeTruthy()
    })
  })
})
