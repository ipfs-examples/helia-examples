/* eslint-disable no-console */
// @ts-check
import { createHeliaHTTP } from '@helia/http'
import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core'
import { FsBlockstore } from 'blockstore-fs'

// the blockstore is where we store the blocks that make up files. this blockstore
// stores everything in-memory - other blockstores are available:
//   - https://www.npmjs.com/package/blockstore-fs - a filesystem blockstore (for use in node)
//   - https://www.npmjs.com/package/blockstore-idb - an IndexDB blockstore (for use in browsers)
//   - https://www.npmjs.com/package/blockstore-level - a LevelDB blockstore (for node or browsers,
//                                        though storing files in a database is rarely a good idea)

// Create a new Helia node with an in-memory blockstore
const helia1 = await createHeliaHTTP({
  blockstore: new MemoryBlockstore()
})

// create a UnixFS filesystem on top of Helia
const fs1 = unixfs(helia1)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

const message = 'Hello World 201'

// add the bytes to your node and receive a unique content identifier
const cid1 = await fs1.addBytes(encoder.encode(message))

console.log('Added file contents:', message)

// Create a new Helia node with a filesystem blockstore
const helia2 = await createHeliaHTTP({
  blockstore: new FsBlockstore('./blockstore')
})

const fs2 = unixfs(helia2)
try {
  // Check if the CID is in the blockstore, which will be true if we ran this script before
  const stats = await fs2.stat(cid1, { offline: true }) // `offline: true` will prevent the node from trying to fetch the block from the network
  console.log(`Found ${cid1.toString()} in blockstore:`, stats)
} catch (error) {
  console.log("CID can't be found in the blockstore. We will add it now.")
  // If the CID is not in the blockstore, we will add it now
  const cid2 = await fs2.addBytes(encoder.encode(message))
  console.log('Added file:', cid2.toString())
}

await helia1.stop()
await helia2.stop()
