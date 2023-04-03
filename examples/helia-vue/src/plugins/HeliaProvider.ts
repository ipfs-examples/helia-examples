
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



export default {
  install: async (app, options) => {
    const loading = ref(true)
    const error = ref("")
    const helia = ref()
    const fs = ref()
    app.provide('HeliaProvider', {
      loading,
      error,
      helia,
      fs
    })
    try {
      const blockstore = new MemoryBlockstore()
      const datastore = new MemoryDatastore()
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
      loading.value = false
      helia.value = instance
      fs.value = unixfs(instance)

    } catch (e) {
      console.log('e', e)
      error.value = e.toString()
      loading.value = false
    }
  }
}
