/* eslint-disable no-console */
// @ts-check

import { createHelia } from 'helia'
import { ipns as IPNS } from '@helia/ipns'
import { dagCbor } from '@helia/dag-cbor'
import { generateKeyPair } from '@libp2p/crypto/keys'



const helia = await createHelia()
const dcbor = dagCbor(helia)
const ipns = IPNS(helia)

// create a keypair to publish an IPNS name
const privateKey = await generateKeyPair('Ed25519')


// Use dag-cbor to encode a 
const cid = await dcbor.add({
  message: 'IPNS can be used to publish mutable pointers to immutable data',
  repo: 'https://github.com/ipfs-examples/helia-examples'
})

const record = await ipns.publish(privateKey, cid, {
  lifetime: 1000 * 60 * 60 * 24 * 30, // 30 days
  ttl: 1000 * 60, // 1 minute TTL
  signal: AbortSignal.timeout(60_000), // 60 seconds timeout for publishing
})

console.log(`Published IPNS name: 
  ${privateKey.publicKey.toCID()} (as CID) 
  ${privateKey.publicKey.toString()} (as base58btc string)`)
console.log('Published IPNS record: ', record)

await helia.stop()
