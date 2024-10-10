/* eslint-disable no-console */
// client.js
import { dagCbor } from '@helia/dag-cbor'
import { createHelia } from 'helia'
import { lpStream } from 'it-length-prefixed-stream'
import { CID } from 'multiformats/cid'
import { PROTOCOL } from './utils.js'

const helia = await createHelia()
const heliaDagCbor = dagCbor(helia)

helia.libp2p.addEventListener('peer:discovery', async (event) => {
  const remotePeerId = event.detail.id

  console.log('client discovered server: %s', remotePeerId)

  // dial custom protocol - the expected interaction is:
  //
  // 1. client opens stream to server
  // 2. server sends CID to client
  // 3. client responds with ACK message
  // 4. both ends close the stream
  helia.libp2p.dialProtocol(remotePeerId, PROTOCOL)
    .then(async stream => {
      // lpStream will prefix every message sent with the length and handle
      // reading the correct number of bytes from the remote
      const lp = lpStream(stream)

      try {
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
      } catch (err) {
        console.error('client error:', err)
        lp.unwrap().abort(err)
      } finally {
        console.log('client finished')
        await helia.stop()
        process.exit(0)
      }
    })
})
