import { node } from 'test-util-ipfs-example'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await node.waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, './101-basics.js')])

await node.waitForOutput('Added file contents: Hello World 201', 'node', [path.resolve(__dirname, './201-storage.js')])

await node.waitForOutput('Fetched file contents: Hello World 301', 'node', [path.resolve(__dirname, './301-networking.js')])

