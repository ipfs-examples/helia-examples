import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput, matchOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  process: server
} = await matchOutput(/(ready)/m, 'node', [path.resolve(__dirname, '../src/server.js')])

await waitForOutput('client finished', 'node', [path.resolve(__dirname, '../src/client.js')])

server.kill()
