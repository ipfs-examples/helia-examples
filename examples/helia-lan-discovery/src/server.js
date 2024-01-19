/* eslint-disable no-console */
// server.js
import { dagCbor } from '@helia/dag-cbor'
import { createHelia } from 'helia'
import { lpStream } from 'it-length-prefixed-stream'
import { PROTOCOL } from './utils.js'

const helia = await createHelia()
const heliaDagCbor = dagCbor(helia)

//
const str = `${new Date().toLocaleString()}: My test string that you only know if you're in the same pubsub channel as me and request my CID`
const cid = await heliaDagCbor.add(str)
const cidString = cid.toString()

console.log('CID: %s', cidString)

// handle custom protocol - the expected interaction is:
//
// 1. client opens stream to server
// 2. server sends CID to client
// 3. client responds with ACK message
// 4. both ends close the stream
helia.libp2p.handle(PROTOCOL, ({ stream }) => {
  // lpStream will prefix every message send with the length and handle
  // reading the correct number of bytes from the remote
  const lp = lpStream(stream)

  Promise.resolve().then(async () => {
    console.log('server sending CID')
    await lp.write(cid.bytes)

    console.log('server waiting for client ACK')
    const ack = await lp.read()

    console.info('server received', new TextDecoder().decode(ack.subarray()))

    console.log('server close stream')
    await lp.unwrap().close()
  })
    .catch(err => {
      console.error('server error', err)
      lp.unwrap().abort(err)
    })
    .finally(async () => {
      console.log('server finished')
      await helia.stop()
      process.exit(0)
    })
})
