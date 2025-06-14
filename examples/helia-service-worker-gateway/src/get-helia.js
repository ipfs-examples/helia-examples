import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { bootstrap } from '@libp2p/bootstrap'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { delegatedPeerRouting } from "@libp2p/delegated-peer-routing";
import { delegatedContentRouting } from "@libp2p/delegated-content-routing";
import { create as kuboClient } from "kubo-rpc-client";

export async function getHelia () {
  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // default is to use ipfs.io
  const delegatedClient = kuboClient({
  // use default api settings
  protocol: "https",
  port: 443,
  host: "node3.delegate.ipfs.io",
})

  // libp2p is the networking layer that underpins Helia
  const libp2p = await createLibp2p({
    datastore,
    transports: [
      webSockets(), webTransport()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    peerRouters: [delegatedPeerRouting(delegatedClient)],
    contentRouters: [delegatedContentRouting(delegatedClient)],
    /**
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-dialing
       */
    dialer: {
      dialTimeout: 120000,
    },
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-connection-manager
     */
    connectionManager: {
      // Auto connect to discovered peers (limited by ConnectionManager minConnections)
      autoDial: true,
      // maxConnections: 10,
      // minConnections: 0,
      // pollInterval: 2000,
    },
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-peerstore
     */
    peerStore: {
      persistence: true,
      /**
       * The threshold number represents the maximum number of "dirty peers" allowed in the PeerStore, i.e. peers that
       * are not updated in the datastore. In this context, browser nodes should use a threshold of 1, since they
       * might not "stop" properly in several scenarios and the PeerStore might end up with unflushed records when the
       * window is closed.
       */
      threshold: 1,
    },
  })

  // create a Helia node
  return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}
