/* eslint-disable no-console */
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { identify } from '@libp2p/identify'
import { mdns } from '@libp2p/mdns'
import { tcp } from '@libp2p/tcp'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'

// @ts-check

export async function getHelia (clientName) {
  const libp2p = await createLibp2p({
    addresses: {
      /**
       * the node needs to be listening on an address for mdns to work,
       * otherwise there's no way for the remote node to contact you
       *
       * @see https://github.com/libp2p/js-libp2p/blob/742915567749072aa784cf179ce9810f66ac6c6e/packages/peer-discovery-mdns/src/query.ts#L87-L89
       * @see https://github.com/libp2p/js-libp2p/blob/742915567749072aa784cf179ce9810f66ac6c6e/packages/peer-discovery-mdns/src/mdns.ts#L92-L101
       */
      listen: [
        '/ip4/0.0.0.0/tcp/0'
      ]
    },
    transports: [
      tcp()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    peerDiscovery: [
      mdns()
    ],
    services: {
      identify: identify(),
      pubsub: gossipsub()
    }
  })

  const helia = await createHelia({
    libp2p
  })

  helia.libp2p.addEventListener('peer:discovery', async (event) => {
    console.log('%s discovered peer: %s', clientName, event.detail.id)
  })
  helia.libp2p.addEventListener('peer:connect', async (event) => {
    console.log('%s connected to peer: %s', clientName, event.detail)
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

  console.log('%s helia.libp2p.peerId %s subscribing to topic %s', prefix, helia.libp2p.peerId, topic)

  helia.libp2p.services.pubsub?.subscribe(topic)

  await helia.libp2p.services.pubsub?.addEventListener('message', async (evt) => {
    const messageString = new TextDecoder().decode(evt.detail.data)
    console.log('%s gossipsub:message received: %s', prefix, messageString)
    await onMessage(messageString)
  })
}

export const pubSubTopic = 'helia-lan-discovery'
