/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core'
import { createHelia } from 'helia'
import { mdns } from '@libp2p/mdns'


// the blockstore is where we store the blocks that make up files. this blockstore
// stores everything in-memory - other blockstores are available:
//   - https://www.npmjs.com/package/blockstore-fs - a filesystem blockstore (for use in node)
//   - https://www.npmjs.com/package/blockstore-idb - an IndexDB blockstore (for use in browsers)
//   - https://www.npmjs.com/package/blockstore-level - a LevelDB blockstore (for node or browsers,
//                                        though storing files in a database is rarely a good idea)

// create a Helia node
const helia = await createHelia({
  blockstore: new MemoryBlockstore(),
  libp2p: {
    addresses: {
      listen: [
        // only listen on localhost TCP for simplicity
        '/ip4/127.0.0.1/tcp/0',
      ]
    },
    peerDiscovery: [
      mdns()
    ]
  }
})

helia.libp2p.addEventListener('peer:connect', (peerId) => {
  console.log('peer connected', peerId)
})

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(helia)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const cid = await fs.addBytes(encoder.encode('Hello World 201'))

console.log('Added file:', cid.toString())

// create a second Helia node using the same blockstore
const helia2 = await createHelia({
  blockstore: new MemoryBlockstore(),
  libp2p: {
    addresses: {
      listen: [
        '/ip4/127.0.0.1/tcp/0',
      ]
    },
    peerDiscovery: [
      mdns()
    ]
  }
})
// create a second filesystem
const fs2 = unixfs(helia2)

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

// read the file from the blockstore using the second Helia node
for await (const chunk of fs2.cat(cid)) {
  text += decoder.decode(chunk, {
    stream: true
  })
}

console.log('helia2.libp2p.getPeers()', await helia2.libp2p.getPeers())
console.log('helia2.libp2p.getConnections()', await helia2.libp2p.getConnections())
console.log('helia.libp2p.getPeers()', await helia.libp2p.getPeers())
console.log('helia.libp2p.getConnections()', await helia.libp2p.getConnections())

console.log('Added file contents:', text)

process.exit(0)
