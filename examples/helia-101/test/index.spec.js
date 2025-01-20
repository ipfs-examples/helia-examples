import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Added file contents: Hello World 101', process.env.NODE_EXEC ?? 'node', [path.resolve(__dirname, '../101-basics.js')])

await waitForOutput('Added file contents: Hello World 201', process.env.NODE_EXEC ?? 'node', [path.resolve(__dirname, '../201-storage.js')])

await waitForOutput('Fetched file contents: Hello World 301', process.env.NODE_EXEC ?? 'node', [path.resolve(__dirname, '../301-networking.js')])
