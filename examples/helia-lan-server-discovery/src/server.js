/* eslint-disable no-console */
// server.js
import { dagCbor } from '@helia/dag-cbor'
import { comms, getHelia, pubSubTopic } from './utils.js'

const helia = await getHelia('server')

const heliaDagCbor = dagCbor(helia)
const uuid = `${new Date().toLocaleString()}: My test string that you only know if you're in the same pubsub channel as me and request my CID`
const cid = await heliaDagCbor.add(uuid)
const cidString = cid.toString()

console.log('CID: %s', cidString)

await comms(helia, pubSubTopic, 'server', async (msg) => {
  if (msg === 'done') {
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('done-ACK'))
  } else if (msg === 'ping') {
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('pong'))
  } else if (msg === 'done-ACK') {
    // other node sent done-ack and should have shut down, now it's our turn to shut down.
    await helia.stop()
    process.exit(0)
  } else if (msg === 'wut-CID') {
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode(cidString))
  }
})
