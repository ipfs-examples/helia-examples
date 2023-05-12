import { waitForOutput } from 'test-ipfs-example/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('PeerId', 'electron', [path.resolve(`${__dirname}/../main.js`)])
