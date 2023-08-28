// client.js
import { dagCbor } from '@helia/dag-cbor'
import { CID } from 'multiformats/cid'
import { readFile, writeFile } from 'node:fs/promises'
import { comms, connectedPeers, logDiscoveredPeers, getHelia, logConnectedPeers } from './utils.js'

const cidString = await readFile('cid.txt', 'utf-8')
const cid = CID.parse(cidString)

const helia = await getHelia()
await writeFile('client-peerId.txt', helia.libp2p.peerId.toString())
await logConnectedPeers('client-connectedPeers.txt', helia)
await logDiscoveredPeers('client-discoveredPeers.txt', helia)
const heliaDagCbor = dagCbor(helia)
await connectedPeers(helia)

// await comms(helia, cidString)

// while(helia.libp2p.services.pubsub.getSubscribers(cidString).length === 0) {
//   // console.log(`pubsubPeers: `, helia.libp2p.services.pubsub.getSubscribers(cidString))
//   await new Promise((resolve) => setTimeout(resolve, 1000))
// }
// console.log(`pubsubPeers: `, helia.libp2p.services.pubsub.getSubscribers(cidString))

// await helia.libp2p.services.pubsub.publish(cidString, 'hello world')

console.log('requesting CID: %s', cidString)
const data = await heliaDagCbor.get(cid, {
  // onProgress: (progress) => {
  //   console.log('progress:', progress)
  // }
})

console.log(data)
