import { files, scanFile } from './helpers'

describe('Asset tests', () => {
  files(__dirname + '/assets/**/*.brs').forEach((path: string) => {
    test(path, () => {
      expect(scanFile(path)).toBeTruthy()
    })
  })
})
