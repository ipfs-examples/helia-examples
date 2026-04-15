import path from 'path'
import { fileURLToPath } from 'url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ts-node is currently broken on node 20 - https://github.com/TypeStrong/ts-node/issues/1997
// await waitForOutput('Helia is running', 'ts-node', ['--esm', path.resolve(__dirname, '../src/index.ts')])
await waitForOutput('Helia is running', 'node', ['--loader', 'ts-node/esm', path.resolve(__dirname, '../src/index.ts')])
