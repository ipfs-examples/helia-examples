/* eslint-disable no-console */

import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { privateKeyFromProtobuf } from '@libp2p/crypto/keys'
import { identify } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { createLibp2p } from 'libp2p'
import { fromString } from 'uint8arrays/from-string'

const boostrapperKey = 'CAESQOr+wN1cDgutS/juD5EjvL+nps5/lsIFrO/AjsNnT+petDqTQaus6teAHNTEY0YP3HZdYd1cPgWtpKHASiC5Ers'
const protobuf = fromString(boostrapperKey, 'base64')
const privateKey = privateKeyFromProtobuf(protobuf)

const bootstrapper = await createLibp2p({
  privateKey,
  addresses: {
    listen: [
      '/ip4/0.0.0.0/tcp/64484',
      '/ip4/0.0.0.0/tcp/64485/ws'
    ]
  },
  transports: [
    tcp(),
    webSockets()
  ],
  connectionEncrypters: [
    noise()
  ],
  streamMuxers: [
    yamux()
  ],
  services: {
    identify: identify(),
    kadDHT: kadDHT(),
    relay: circuitRelayServer({
      reservations: {
        maxReservations: Infinity
      }
    })
  }
})

console.info('bootstrapper listening on')
console.info(bootstrapper.getMultiaddrs().map(ma => ma.toString()).join('\n'))
