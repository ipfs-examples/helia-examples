import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput } from 'test-ipfs-example/node'

const isDenoRun = process.env.NODE_EXEC === 'deno'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let extraArgs = []
if (isDenoRun) {
  extraArgs.push('--allow-env')
  extraArgs.push('--allow-sys')
}
await waitForOutput('Added file contents: Hello World 101', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../101-basics.js')])

extraArgs = []
if (isDenoRun) {
  extraArgs.push('--allow-env')
  extraArgs.push('--allow-sys')
  extraArgs.push('--allow-ffi')
}
await waitForOutput('Added file contents: Hello World 201', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../201-storage.js')])

extraArgs = []
await waitForOutput('Fetched file contents: Hello World 301', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../301-networking.js')])
