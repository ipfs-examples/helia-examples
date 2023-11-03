import path from 'path'
import { fileURLToPath } from 'url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Helia is running', 'ts-node', ['--esm', path.resolve(__dirname, '../src/index.ts')])
