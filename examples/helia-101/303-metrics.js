/* eslint-disable no-console */
// @ts-check
import { unixfs } from '@helia/unixfs'
import { createServer } from 'node:http'
import { prometheusMetrics } from '@libp2p/prometheus-metrics'
import { createHelia } from 'helia'
import { register } from 'prom-client'

import { FsBlockstore } from 'blockstore-fs'
import { FsDatastore } from 'datastore-fs'

const helia = await createHelia({
  blockstore: new FsBlockstore('./blockstore'),
  datastore: new FsDatastore('./datastore'),
  libp2p: {
    metrics: prometheusMetrics(),
  }
})


// log when our addresses changes
helia.libp2p.addEventListener('self:peer:update', (evt) => {
  console.log(
    'self:peer:update',
    evt.detail.peer.addresses.map((a) => a.multiaddr.encapsulate('/p2p/' + evt.detail.peer.id.toString()))
  )
})

const metricsServer = createServer((req, res) => {
  if (req.url === '/metrics' && req.method === 'GET') {
    register.metrics()
      .then((metrics) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(metrics)
      }, (err) => {
        console.error('could not read metrics', err)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
      })
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})
metricsServer.listen(9999, '0.0.0.0')
console.info('Metrics server listening', `0.0.0.0:9999`)


console.log('Created Helia node with PeerID:', helia.libp2p.peerId.toString())



const fs = unixfs(helia)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

const text = 'Hello World 🗺️🌎🌍🌏 303!'

// add the bytes to your node and receive a unique content identifier
let cid = await fs.addFile({
  content: encoder.encode(text),
  path: './hello-world.txt'
})
console.log('Added file:', cid.toString())


// Provide the block to the DHT so that other nodes can find and retrieve it
await helia.routing.provide(cid)

console.log('CID provided to the DHT:', cid.toString())
