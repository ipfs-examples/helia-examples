import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { waitForOutput } from 'test-ipfs-example/node'

const isDenoRun = process.env.NODE_EXEC === 'deno'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const extraArgs = []

if (isDenoRun) {
  extraArgs.push('--allow-env')
  extraArgs.push('--allow-sys')
  extraArgs.push('--allow-ffi')
  extraArgs.push('--allow-read')
  extraArgs.push('--allow-write')
  extraArgs.push('--allow-net')
}

await waitForOutput('Added file contents: Hello World 101', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../101-basics.js')])

await waitForOutput('myJournal (empty):', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../102-unixfs-dirs.js')])

await waitForOutput('Wrote car file to output.car', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../103-glob-unixfs.js'), 'test', 'output.car'])

await waitForOutput('Added file contents: Hello World 201', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../201-storage.js')])

await waitForOutput('Started Helia node with Peer ID:', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../202-persistent-peer.js')])

await waitForOutput('Fetched file contents: Hello World 301', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../301-networking.js')])

await waitForOutput('Discovered new peer', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../302-mdns.js')])

await waitForOutput('Metrics server listening', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../303-metrics.js')])

await waitForOutput('Fetched file contents: Hello from a private swarm example', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../304-pnet.js')])

await waitForOutput('Pinned CID', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../401-pinning.js')])

// TODO: re-enable after https://github.com/libp2p/js-libp2p/pull/3425
// await waitForOutput('CID provided to the DHT:', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../402-providing.js')])

// TODO: re-enable after https://github.com/libp2p/js-libp2p/pull/3425
// await waitForOutput('Stats:', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../403-block-brokers-routers.js')])

// TODO: re-enable after https://github.com/libp2p/js-libp2p/pull/3425
// await waitForOutput('Published IPNS record:', process.env.NODE_EXEC ?? 'node', [...extraArgs, path.resolve(__dirname, '../501-ipns.js')])
