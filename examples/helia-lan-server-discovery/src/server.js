// server.js
import { randomUUID } from 'node:crypto'
import { dagCbor } from '@helia/dag-cbor'
import { writeFile } from 'node:fs/promises'
import { comms, connectedPeers, logDiscoveredPeers, getHelia, logConnectedPeers } from './utils.js'


const helia = await getHelia()
await writeFile('server-peerId.txt', helia.libp2p.peerId.toString())
logConnectedPeers('server-connectedPeers.txt', helia)
logDiscoveredPeers('server-discoveredPeers.txt', helia)
const heliaDagCbor = dagCbor(helia)
const cid = await heliaDagCbor.add(randomUUID())
await writeFile('cid.txt', cid.toString())

console.log('CID: %s', cid.toString())


await connectedPeers(helia)
// for await (const event of helia.libp2p.services.dht.provide(cid)) {
//   console.log('event', event)
// }
// await comms(helia, cid.toString())

