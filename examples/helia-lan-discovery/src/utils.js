/* eslint-disable no-console */
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { autoNAT as autoNATService } from '@libp2p/autonat'
import { identify as identifyService } from '@libp2p/identify'
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { mdns } from '@libp2p/mdns'
import { ping as pingService } from '@libp2p/ping'
import { tcp } from '@libp2p/tcp'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'

// @ts-check

export async function getHelia (clientName) {
  const datastore = new MemoryDatastore()

  const libp2p = await createLibp2p({
    datastore,
    connectionManager: {
      minConnections: 1
    },
    addresses: {
      /**
       * you have to make sure that listening multiaddrs are announced for mdns to work
       *
       * @see https://github.com/libp2p/js-libp2p/blob/742915567749072aa784cf179ce9810f66ac6c6e/packages/peer-discovery-mdns/src/query.ts#L87-L89
       * @see https://github.com/libp2p/js-libp2p/blob/742915567749072aa784cf179ce9810f66ac6c6e/packages/peer-discovery-mdns/src/mdns.ts#L92-L101
       */
      listen: [
        '/ip4/0.0.0.0/webrtc',
        '/ip4/0.0.0.0/ws',
        '/ip4/0.0.0.0/tcp/0'
      ]
    },
    transports: [
      webRTC(),
      webRTCDirect(),
      webSockets(),
      tcp()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      // mplex(),
      yamux()
    ],
    peerDiscovery: [
      mdns({
        // broadcast: mdnsBroadcast
      })
    ],
    services: {
      identify: identifyService(),
      ping: pingService({
        protocolPrefix: 'ipfs'
      }),
      dht: kadDHT({
        protocol: '/ipfs/lan/kad/1.0.0',
        peerInfoMapper: removePublicAddressesMapper,
        clientMode: false
      }),
      pubsub: gossipsub(),
      nat: autoNATService({
        enabled: true
      })
    }
  })

  const helia = await createHelia({
    datastore,
    libp2p
  })

  helia.libp2p.addEventListener('peer:discovery', async (connection) => {
    const peer = connection.detail.id
    console.log('%s discovered peer: ', clientName, peer.toString())
  })
  helia.libp2p.addEventListener('peer:connect', async (connection) => {
    console.log('%s connected to peer: ', clientName, connection.detail.toString())
  })
  return helia
}

export async function comms (helia, topic, prefix, onMessage) {
  if (helia.libp2p.services.pubsub == null) {
    return
  }
  if (onMessage == null) {
    throw new Error('onMessage is required')
  }
  console.log('%s helia.libp2p.peerId %s subscribing to topic %s', prefix, helia.libp2p.peerId.toString(), topic)

  helia.libp2p.services.pubsub?.subscribe(topic)
  await helia.libp2p.services.pubsub?.addEventListener('message', async (evt) => {
    const messageString = new TextDecoder().decode(evt.detail.data)
    console.log('%s gossipsub:message received: %s', prefix, messageString)
    await onMessage(messageString)
  })
}

export const pubSubTopic = 'helia-lan-discovery'
