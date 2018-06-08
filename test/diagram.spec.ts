import { createSyntaxDiagramsCode } from 'chevrotain'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

import { parserInstance } from '../src/RokuBRSParser'

describe('Diagrams', () => {
  test('Generate AST Productions', () => {
    // extract the serialized parser.
    const serializedGrammar = parserInstance.getSerializedGastProductions()

    // create the HTML Text
    const htmlText = createSyntaxDiagramsCode(serializedGrammar)

    // Write the HTML file to disk
    const outPath = resolve(__dirname, '../diagram')

    writeFileSync(outPath + '/index.html', htmlText)
  })
})
