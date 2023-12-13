/* eslint-disable no-console */
// client.js
import { dagCbor } from '@helia/dag-cbor'
import { CID } from 'multiformats/cid'
import { comms, getHelia, pubSubTopic } from './utils.js'

const helia = await getHelia('client')
const heliaDagCbor = dagCbor(helia)

helia.libp2p.services.pubsub.addEventListener('subscription-change', (evt) => {
  if (helia.libp2p.services.pubsub.getSubscribers(pubSubTopic).length !== 0) {
    // we're subscribed, and so is another node, so request the CID
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('wut-CID'))
  }
})

await comms(helia, pubSubTopic, 'client', async (msg) => {
  if (msg === 'pong') {
    // helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('done'))
  } else if (msg === 'done-ACK') {
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('done-ACK'))
    setTimeout(async () => {
      await helia.stop()
      process.exit(0)
    }, 500)
  } else {
    // msg is a CID (response to wut-CID request), so fetch it
    console.log('requesting CID: %s', msg)
    const data = await heliaDagCbor.get(CID.parse(msg))
    console.log('got CID data: ', data)
    helia.libp2p.services.pubsub?.publish(pubSubTopic, new TextEncoder().encode('done'))
  }
})
