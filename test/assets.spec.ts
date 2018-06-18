import { basename } from 'path'
import { files, scanFile } from './helpers'

describe.skip('Asset tests', () => {
  files(__dirname + '/assets/**/*.brs').forEach((path: string) => {
    test(basename(path, '.brs'), () => {
      expect(scanFile(path)).toBeTruthy()
    })
  })
})
