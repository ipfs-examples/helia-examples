import path from 'path'
import { fileURLToPath } from 'url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../101-basics.js')])

await waitForOutput('Added file contents: Hello World 201', 'node', [path.resolve(__dirname, '../201-storage.js')])

await waitForOutput('Fetched file contents: Hello World 301', 'node', [path.resolve(__dirname, '../301-networking.js')])
