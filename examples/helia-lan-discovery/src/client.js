/* eslint-disable no-console */
// client.js
import { dagCbor } from '@helia/dag-cbor'
import { lpStream } from '@libp2p/utils'
import { createHelia } from 'helia'
import { CID } from 'multiformats/cid'
import { PROTOCOL } from './utils.js'

const helia = await createHelia()
const heliaDagCbor = dagCbor(helia)

helia.libp2p.addEventListener('peer:discovery', (evt) => {
  helia.libp2p.dial(evt.detail.id, {
    signal: AbortSignal.timeout(5_000)
  })
    .catch()
})

await helia.libp2p.register(PROTOCOL, {
  onConnect: (remotePeerId) => {
    console.log('client discovered server: %s', remotePeerId)
    let lp

    Promise.resolve()
      .then(async () => {
        // dial custom protocol - the expected interaction is:
        //
        // 1. client opens stream to server
        // 2. server sends CID to client
        // 3. client responds with ACK message
        // 4. both ends close the stream
        const stream = await helia.libp2p.dialProtocol(remotePeerId, PROTOCOL)
        // lpStream will prefix every message sent with the length and handle
        // reading the correct number of bytes from the remote
        lp = lpStream(stream)

        console.log('client reading CID')
        const bytes = await lp.read()
        const cid = CID.decode(bytes)

        console.log('client requesting data for CID %s', cid)
        const data = await heliaDagCbor.get(cid)
        console.log('client got CID data:', data)

        console.log('client sending ACK')
        await lp.write(new TextEncoder().encode('ACK'))

        console.log('client close stream')
        await lp.unwrap().close()
      })
      .catch(err => {
        console.error('client error:', err)
        lp?.unwrap().abort(err)
      })
      .finally(() => {
        console.log('client finished')
        process.exit(0)
      })
  }
})

console.info('client ready')
