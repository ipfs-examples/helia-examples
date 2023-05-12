/* global Libp2P, ChainsafeLibp2PNoise, ChainsafeLibp2PYamux, Libp2PWebsockets, Libp2PBootstrap, Libp2PKadDht */

/**
 *
 * @param {object} param0
 * @param {import('libp2p').Libp2pOptions['datastore']} param0.datastore
 */
export async function createLibp2pInstance ({ datastore }) {
  /** @type {Partial<import('libp2p').Libp2pOptions>} */
  const libp2pInit = {
    /**
     * @see https://github.com/ipfs/js-ipfs-interfaces/tree/master/packages/interface-datastore
     */
    datastore,
    /**
     * @see https://github.com/libp2p/js-libp2p-kad-dht
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#customizing-dht
     */
    dht: /** @type {import('libp2p').Libp2pOptions['dht']} */(Libp2PKadDht.kadDHT({ // The DHT options (and defaults) can be found in its documentation
      kBucketSize: 5,
      clientMode: true,
      enabled: true,
      randomWalk: {
        enabled: true, // Allows to disable discovery (enabled by default)
        interval: 300e3,
        timeout: 10e3
      }
    })),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#transport
     */
    transports: /** @type {import('libp2p').Libp2pOptions['transports']} */([
      Libp2PWebsockets.webSockets()
    ]),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#connection-encryption
     */
    connectionEncryption: /** @type {import('libp2p').Libp2pOptions['connectionEncryption']} */([
      ChainsafeLibp2PNoise.noise()
    ]),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#stream-multiplexing
     */
    streamMuxers: /** @type {import('libp2p').Libp2pOptions['streamMuxers']} */([
      ChainsafeLibp2PYamux.yamux()
    ]),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#customizing-peer-discovery
     */
    peerDiscovery: /** @type {import('libp2p').Libp2pOptions['peerDiscovery']} */([
      Libp2PBootstrap.bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
        ]
      })
    ]),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-connection-manager
     */
    connectionManager: /** @type {import('libp2p').Libp2pOptions['connectionManager']} */({
      // Auto connect to discovered peers (limited by ConnectionManager minConnections)
      autoDial: true
    }),
    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-peerstore
     */
    peerStore: /** @type {import('libp2p').Libp2pOptions['peerStore']} */({
      persistence: true,
      /**
       * The threshold number represents the maximum number of "dirty peers" allowed in the PeerStore, i.e. peers that
       * are not updated in the datastore. In this context, browser nodes should use a threshold of 1, since they
       * might not "stop" properly in several scenarios and the PeerStore might end up with unflushed records when the
       * window is closed.
       */
      threshold: 1
    })
  }

  /** @type {import('libp2p').Libp2p} */
  const libp2pInstance = await Libp2P.createLibp2p(libp2pInit)

  return libp2pInstance
}
