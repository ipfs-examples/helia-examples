import path from 'path'
import { fileURLToPath } from 'url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Helia is running', 'node', [path.resolve(__dirname, '../dist/index.js')])
