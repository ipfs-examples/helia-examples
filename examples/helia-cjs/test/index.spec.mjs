import { waitForOutput } from 'test-ipfs-example/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../index.js')])
