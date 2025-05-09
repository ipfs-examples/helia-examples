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

const text = 'Hello World 🗺️🌎🌍🌏 402!'

// add the bytes to your node and receive a unique content identifier
let cid = await fs.addFile({
  content: encoder.encode(text),
  path: './hello-world.txt'
})
console.log('Added file:', cid.toString())

// Provide the block to the DHT so that other nodes can find and retrieve it
await helia.routing.provide(cid, {
  signal: AbortSignal.timeout(60_000) // Set a timeout of 60 seconds
})

console.log('CID provided to the DHT:', cid.toString())
