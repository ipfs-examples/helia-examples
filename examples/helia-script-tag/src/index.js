/** global Helia, Libp2P, ChainsafeLibp2PYamux, Libp2PWebsockets, Libp2PBootstrap, BlockstoreCore, DatastoreCore */

// not imported from skypack,jsdelivr, nor unpkg because of issues.
import { noise } from 'https://esm.sh/v111/@chainsafe/libp2p-noise@11.0.1/es2022/libp2p-noise.js'

const statusEl = document.getElementById('status')
const statusValueEl = document.getElementById('statusValue')
const discoveredPeerCount = document.getElementById('discoveredPeerCount')
const connectedPeerCount = document.getElementById('connectedPeerCount')
const connectedPeersList = document.getElementById('connectedPeersList')

let nodeUpdateInterval = null
document.addEventListener('DOMContentLoaded', async () => {
  window.helia = await createHelia()
  window.heliaFs = await HeliaUnixfs.unixfs(helia)

  helia.libp2p.addEventListener('peer:discovery', (evt) => {
    discoveredPeers.set(evt.detail.id.toString(), evt.detail)
    addToLog(`Discovered peer ${evt.detail.id.toString()}`)
  })

  helia.libp2p.addEventListener('peer:connect', (evt) => {
    addToLog(`Connected to ${evt.detail.remotePeer.toString()}`)
  })
  helia.libp2p.addEventListener('peer:disconnect', (evt) => {
    addToLog(`Disconnected from ${evt.detail.remotePeer.toString()}`)
  })

  nodeUpdateInterval = setInterval(() => {
    statusValueEl.innerHTML = window.helia.libp2p.started ? 'Online' : 'Offline'
    updateConnectedPeers()
    updateDiscoveredPeers()
  }, 500)

  const id = await helia.libp2p.peerId.toString()

  const nodeIdEl = document.getElementById("nodeId");
  nodeIdEl.innerHTML = id

  /**
   * You can write more code here to use it.
   *
   * https://github.com/ipfs/helia
   * - helia.start
   * - helia.stop
   *
   * https://github.com/ipfs/helia-unixfs
   * - heliaFs.addBytes
   * - heliaFs.addFile
   * - heliaFs.ls
   * - heliaFs.cat
   */
})


function ms2TimeString(a){
  const k=a%1e3
  const s=a/1e3%60|0
  const m=a/6e4%60|0
  const h=a/36e5%24|0

  return (h ? (h<10?'0'+h:h)+':':'00:')+
    (m<10?0:'')+m+':'+
    (s<10?0:'')+s+':'+
    (k<100?k<10?'00':0:'')+k
}

const logEl = document.getElementById('runningLog')

const getLogLineEl = (msg) => {
  const logLine = document.createElement('span')
  logLine.innerHTML = `${ms2TimeString(performance.now())} - ${msg}`

  return logLine
}
const addToLog = (msg) => {
  logEl.appendChild(getLogLineEl(msg))
}

let heliaInstance = null
let libp2pInstance = null
const createHelia = async () => {

  // application-specific data lives in the datastore
  const datastore = new DatastoreCore.MemoryDatastore()
  const blockstore = new BlockstoreCore.MemoryBlockstore()

  if (heliaInstance != null) {
    return heliaInstance
  }

  if (libp2pInstance == null) {

    /**
     * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#customizing-libp2p
     */
    libp2pInstance = await Libp2P.createLibp2p({
      /**
       * @see https://github.com/ipfs/js-ipfs-interfaces/tree/master/packages/interface-datastore
       */
      datastore,
      /**
       * @see https://github.com/libp2p/js-libp2p-kad-dht
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#customizing-dht
       */
      dht: Libp2PKadDht.kadDHT({                        // The DHT options (and defaults) can be found in its documentation
        kBucketSize: 5,
        clientMode: true,
        enabled: true,
        randomWalk: {
          enabled: true,            // Allows to disable discovery (enabled by default)
          interval: 300e3,
          timeout: 10e3
        }
      }),
      /**
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#transport
       */
      transports: [
        Libp2PWebsockets.webSockets(),
      ],
      /**
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#connection-encryption
       */
      connectionEncryption: [
        noise()
      ],
      /**
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#stream-multiplexing
       */
      streamMuxers: [
        ChainsafeLibp2PYamux.yamux(),
        Libp2PMplex.mplex(),
      ],
      /**
       * @see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#customizing-peer-discovery
       */
      peerDiscovery: [
        Libp2PBootstrap.bootstrap({
          list: [
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
          ],
        }),
      ],
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
        threshold: 1
      },
    })
    addToLog('Created LibP2P instance')

  }

  heliaInstance = await Helia.createHelia({
    datastore,
    blockstore,
    libp2p: libp2pInstance
  })
  addToLog('Created Helia instance')

  return heliaInstance
}

window.discoveredPeers = new Map()

const updateConnectedPeers = () => {
  const peers = helia.libp2p.getPeers()
  connectedPeerCount.innerHTML = peers.length
  connectedPeersList.innerHTML = ''
  for (const peer of peers) {
    const peerEl = document.createElement('li')
    peerEl.innerText = peer.toString()
    connectedPeersList.appendChild(peerEl)
  }
}

const updateDiscoveredPeers = () => {
  discoveredPeerCount.innerHTML = discoveredPeers.size
}

