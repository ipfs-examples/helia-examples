import { writeFile } from 'node:fs/promises'
import { createHelia } from 'helia'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { mplex } from '@libp2p/mplex'
import { identifyService } from 'libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { MemoryDatastore } from 'datastore-core'
import { pingService } from 'libp2p/ping'
import { kadDHT } from '@libp2p/kad-dht'
import { autoNATService } from 'libp2p/autonat'
// import { uPnPNATService } from 'libp2p/upnp-nat'
import { webTransport } from '@libp2p/webtransport'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { mdns } from '@libp2p/mdns'

// @ts-check

export async function getHelia() {
  const datastore = new MemoryDatastore()

  const libp2p = await createLibp2p({
    datastore,
    addresses: {
      listen: [
        '/webrtc',
        '/tcp/0',
        '/wss',
      ]
    },
    // addresses: {
    //   listen: ['/ip4/0.0.0.0/tcp/0']
    // },
    transports: [
      webRTC(),
      webRTCDirect(),
      webTransport(),
      webSockets(),
      circuitRelayTransport({
        discoverRelays: 1
      }),
      tcp(),
    ],
    connectionEncryption: [
      noise(),
    ],
    streamMuxers: [
      mplex(),
      yamux()
    ],
    peerDiscovery: [
      mdns(),
      bootstrap({
        list: [
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
        ]
      })
    ],
    services: {
      identify: identifyService(),
      dht: kadDHT(),
      ping: pingService({
        protocolPrefix: 'ipfs'
      }),
      pubsub: gossipsub(),
      nat: autoNATService({
        enabled: true,
      })
    }
  })

  const helia = await createHelia({
    datastore,
    libp2p
  })

  const interval = setInterval(() => {
    const multiaddrs = helia.libp2p.getMultiaddrs()
    if (multiaddrs.length > 0) {
      console.log('node multiaddrs:', multiaddrs)
      clearInterval(interval)
    }
  }, 5000)
  return helia
}

export async function logConnectedPeers(filename, helia) {
  // clear out peers file
  await writeFile(filename, '', { flag: 'w' })

  helia.libp2p.addEventListener('peer:connect', async (connection) => {
    const peer = connection.detail
    await writeFile(filename, `${peer.toString()}\n`, { flag: 'a' })
  })
}

export async function logDiscoveredPeers(filename, helia) {
  // clear out peers file
  await writeFile(filename, '', { flag: 'w' })

  helia.libp2p.addEventListener('peer:discovery', async (connection) => {
    const peer = connection.detail.id
    await writeFile(filename, `${peer.toString()}\n`, { flag: 'a' })
  })
}

export async function connectedPeers(helia) {
  // while we are not connected to any peers, wait
  let attempt = 1

  // console.log(`helia.libp2p.getPeers(): `, helia.libp2p.getPeers());
  while (helia.libp2p.getPeers().length === 0) {
    await new Promise((resolve) => setTimeout(resolve, attempt++ * 1000))
  }
}

export async function comms(helia, topic) {
  console.log('helia.libp2p.peerId %s subscribing to topic %s', helia.libp2p.peerId.toString(), topic)

  helia.libp2p.services.pubsub.subscribe(topic)
  await helia.libp2p.services.pubsub.addEventListener('message', (evt) => {
    console.log(`evt: `, evt);
    console.log(`evt.detail.topic: `, evt.detail.topic);
    // if (evt.detail.topic === 'topic') {
      // handle message
      console.log('pubsub message received:', evt.detail.data.toString())
    // }
  })
}
