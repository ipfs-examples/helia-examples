import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput } from 'test-ipfs-example/node'

/**
 * @see https://bun.sh/guides/util/detect-bun
 */
if (process.versions.bun) {
  // eslint-disable-next-line no-console
  console.log('Running tests with bun')
  /**
   * Polyfill required for bun for now
   *
   * @see https://github.com/ipfs-examples/helia-examples/pull/101#issuecomment-2436128883
   */
  globalThis.CustomEvent = globalThis.CustomEvent ?? class CustomEventPolyfill extends Event {
    constructor (message, data) {
      super(message, data)
      // @ts-expect-error could be undefined
      this.detail = data?.detail
    }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../101-basics.js')])

await waitForOutput('Added file contents: Hello World 201', 'node', [path.resolve(__dirname, '../201-storage.js')])

await waitForOutput('Fetched file contents: Hello World 301', 'node', [path.resolve(__dirname, '../301-networking.js')])
