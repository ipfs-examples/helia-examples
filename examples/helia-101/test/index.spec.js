import path from 'path'
import { fileURLToPath } from 'url'
import { waitForOutput } from 'test-ipfs-example/node'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../101-basics.js')])

await waitForOutput('myJournal (empty):', 'node', [path.resolve(__dirname, '../102-unixfs-dirs.js')])

await waitForOutput('Wrote car file to output.car', 'node', [path.resolve(__dirname, '../103-glob-unixfs.js'), 'test', 'output.car'])

await waitForOutput('Added file contents: Hello World 201', 'node', [path.resolve(__dirname, '../201-storage.js')])

await waitForOutput('Fetched file contents: Hello World 301', 'node', [path.resolve(__dirname, '../301-networking.js')])

await waitForOutput('Discovered new peer', 'node', [path.resolve(__dirname, '../302-mdns.js')])

await waitForOutput('Metrics server listening', 'node', [path.resolve(__dirname, '../303-metrics.js')])

await waitForOutput('Pinned CID', 'node', [path.resolve(__dirname, '../401-pinning.js')])

await waitForOutput('CID provided to the DHT:', 'node', [path.resolve(__dirname, '../402-providing.js')])

await waitForOutput('Stats:', 'node', [path.resolve(__dirname, '../403-block-brokers-routers.js')])
