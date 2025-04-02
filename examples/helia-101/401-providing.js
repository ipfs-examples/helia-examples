/* eslint-disable no-console */
// @ts-check
import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'

const helia = await createHelia()

// log when our addresses changes
helia.libp2p.addEventListener('self:peer:update', (evt) => {
  console.log(
    'self:peer:update',
    evt.detail.peer.addresses.map((a) => a.multiaddr.toString())
  )
})

console.log('Created Helia node with PeerID:', helia.libp2p.peerId.toString())

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(helia)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

const text = 'Hello World 🗺️🌎🌍🌏 401!'

// add the bytes to your node and receive a unique content identifier
let cid = await fs.addFile({
  content: encoder.encode(text),
  path: './hello-world.txt'
})
console.log('Added file:', cid.toString())

// Run garbage collection to remove unpinned blocks
await helia.gc({
  onProgress: (evt) => {
    console.info('gc event', evt.type, evt.detail)
  }
})

// This will fail because the block is not pinned
try {
  const stats = await fs.stat(cid, { offline: true }) // offline to avoid fetching the block from the network
  console.log('Stats:', stats)
} catch (err) {
  if (err?.name === 'NotFoundError') {
    console.log('Block not found, as expected')
  } else {
    throw err
  }
}

// Add the same bytes again, this time we will pin them
cid = await fs.addFile({
  content: encoder.encode(text),
  path: './hello-world.txt'
})
console.log('Added file again:', cid.toString())

// Pin the block and add some metadata
for await (const pinnedCid of helia.pins.add(cid, {
  metadata: {
    added: new Date().toISOString(),
    addedBy: '401-providing example'
  }
})) {
  console.log('Pinned CID to prevent garbage collection:', pinnedCid.toString())
}

const pin = await helia.pins.get(cid)
console.log('Pin:', pin)

// Provide the block to the DHT so that other nodes can find and retrieve it
await helia.routing.provide(cid)

console.log('CID provided to the DHT:', cid.toString())

await helia.stop()
