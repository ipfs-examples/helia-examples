
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { bootstrap } from '@libp2p/bootstrap'
import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'

import { ref, reactive } from 'vue'

const blockstore = new MemoryBlockstore()
const datastore = new MemoryDatastore()


export default {
    install: async (app, options) => {
    const provider = reactive({
      loading: true,
      error: "",
      helia: {},
      fs: {}
    }) 
    app.provide('HeliaProvider', provider)
    try {
      const libp2p = await createLibp2p({
        datastore,
        transports: [
          webSockets()
        ],
        connectionEncryption: [
          noise()
        ],
        streamMuxers: [
          yamux()
        ],
        peerDiscovery: [
          bootstrap({
            list: [
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt"
            ]
          })
        ]
      })
      const instance = await createHelia({
        datastore,
        blockstore,
        libp2p
      })
      provider.loading = false
      provider.fs = unixfs(instance)
      provider.helia = instance

    } catch (e) {
      console.log('e', e)
      provider.error = e.toString()
      provider.loading = false
    }
  }
}
