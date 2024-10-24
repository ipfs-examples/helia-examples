import { plugin } from 'bun'

/**
 * node-datachannel requires node-domexception,
 * but bun fails with `no default export` error.
 */
await plugin({
  name: 'loader-node-domexception',
  async setup(build) {
    build.onLoad({ filter: /node-domexception\/index\.js/ }, async (args) => {
      return {
        contents: 'export default globalThis.DOMException',
        loader: 'js',
      }
    })
  }
})
