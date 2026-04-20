/* eslint-disable no-console */
// @ts-check

import { dagCbor } from '@helia/dag-cbor'
import { ipns as IPNS } from '@helia/ipns'
import { createHelia } from 'helia'

const helia = await createHelia()
const dcbor = dagCbor(helia)
const ipns = IPNS(helia)

// Use dag-cbor to encode a
const cid = await dcbor.add({
  message: 'IPNS can be used to publish mutable pointers to immutable data',
  repo: 'https://github.com/ipfs-examples/helia-examples'
})

try {
  const record = await ipns.publish('my-ipns-name', cid, {
    lifetime: 1000 * 60 * 60 * 24 * 30, // 30 days
    ttl: 1000 * 60, // 1 minute TTL
    signal: AbortSignal.timeout(60_000) // 60 seconds timeout for publishing
  })
  console.log('Published IPNS record: ', record)
} catch (error) {
  console.error('Error publishing IPNS record:', error)
}

await helia.stop()
