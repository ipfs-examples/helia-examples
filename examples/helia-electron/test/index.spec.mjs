import { waitForOutput } from 'test-ipfs-example/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('PeerId', 'electron', [
  // workaround for https://github.com/jprichardson/electron-mocha/issues/195
  '--no-sandbox',
  path.resolve(`${__dirname}/../main.js`)
])

// in CI sometimes the process fails to exit even after we've seen the output
// we are waiting for - if we've got this far the test has passed so just exit
// cleanly
process.exit(0)
