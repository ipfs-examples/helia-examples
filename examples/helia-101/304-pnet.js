/* eslint-disable no-console */
// @ts-check

import { unixfs } from '@helia/unixfs'
import { identify } from '@libp2p/identify'
import { noise } from '@libp2p/noise'
import { preSharedKey, generateKey } from '@libp2p/pnet'
import { tcp } from '@libp2p/tcp'
import { yamux } from '@libp2p/yamux'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'

async function createPrivateSwarmNode (pnetKey) {
  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // libp2p is the networking layer that underpins Helia. Helia creates the
  // libp2p node from this config, and the keys passed here replace Helia's
  // default libp2p config for those keys
  return await createHelia({
    datastore,
    blockstore,
    libp2p: {
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
      // disable Helia's default peer discovery (mDNS and the public bootstrap
      // nodes), since peers outside the private swarm cannot connect anyway
      peerDiscovery: [],
      connectionProtector: preSharedKey({
        psk: pnetKey
      }),
      services: {
        identify: identify()
      }
    }
  }).start()
}

// Create a Uint8Array and write the swarm key to it
const swarmKey = new Uint8Array(95)
generateKey(swarmKey)

// create two helia nodes
const node1 = await createPrivateSwarmNode(swarmKey)
const node2 = await createPrivateSwarmNode(swarmKey)

// connect them together
const multiaddrs = node2.libp2p.getMultiaddrs()
await node1.libp2p.dial(multiaddrs)

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(node1)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const cid = await fs.addBytes(encoder.encode('Hello from a private swarm example'))

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
