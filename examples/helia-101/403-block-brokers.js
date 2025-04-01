/* eslint-disable no-console */
// @ts-check
import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'
import { bitswap, trustlessGateway } from '@helia/block-brokers'
import { httpGatewayRouting, libp2pRouting } from '@helia/routers'

const helia = await createHelia({
  // blockBrokers: [
  //   trustlessGateway(),
  //   bitswap()
  // ],
  // routers: [
  //   // libp2pRouting(helia.libp2p),
  //   httpGatewayRouting()
  // ],
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
await helia.routing.provide(cid)

console.log('CID provided to the DHT:', cid.toString())
