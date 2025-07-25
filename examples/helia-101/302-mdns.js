/* eslint-disable no-console */
// @ts-check
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { unixfs } from '@helia/unixfs'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { mdns } from '@libp2p/mdns'
import { tcp } from '@libp2p/tcp'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'

async function createNode () {
  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // libp2p is the networking layer that underpins Helia
  const libp2p = await createLibp2p({
    datastore,
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/0'
      ]
    },
    transports: [
      tcp()
    ],
    connectionEncrypters: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    peerDiscovery: [
      mdns()
    ],
    services: {
      identify: identify()
    }
  })

  return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}

// create two helia nodes
const node1 = await createNode()

// listen for peer discovery events triggered by the mdns peer discovery module
node1.libp2p.addEventListener('peer:discovery', async (evt) => {
  console.log(evt)
  console.log(evt.detail)
  console.log(
    `Discovered new peer (${evt.detail.id.toString()}) via MDNS. Dialling...`,
    evt.detail.multiaddrs.map((ma) => ma.toString())
  )
  try {
    await node1.libp2p.dial(evt.detail.multiaddrs) // dial the new peer
    console.log(`Successfully dialed peer (${evt.detail.id.toString()})`)
  } catch (err) {
    console.error(`Failed to dial peer (${evt.detail.id.toString()}):`, err)
  }
})

// create a second helia node
const node2 = await createNode()

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node1)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const cid = await fs.addBytes(encoder.encode('Hello World 301'))

console.log('Added file:', cid.toString())

// create a filesystem on top of the second Helia node
const fs2 = unixfs(node2)

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

// use the second Helia node to fetch the file from the first Helia node
for await (const chunk of fs2.cat(cid)) {
  text += decoder.decode(chunk, {
    stream: true
  })
}

console.log('Fetched file contents:', text)

await node1.stop()
await node2.stop()
