import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput, matchOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  process: client
} = await matchOutput(/(ready)/m, 'node', [path.resolve(__dirname, '../src/client.js')])

await waitForOutput('server close stream', 'node', [path.resolve(__dirname, '../src/server.js')])

client.kill()
