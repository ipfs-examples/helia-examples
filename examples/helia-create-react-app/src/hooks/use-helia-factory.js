/* eslint-disable no-console */

import { useEffect, useState } from 'react'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { bootstrap } from '@libp2p/bootstrap'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'

async function createNode () {
  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // libp2p is the networking layer that underpins Helia
  const libp2p = await createLibp2p({
    datastore,
    transports: [
      webSockets(),
      webTransport()
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
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
        ]
      })
    ]
  })

  return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}

let helia = null

/*
 * A quick demo using React hooks to create a Helia instance
 */
export default function useHeliaFactory () {
  const [isHeliaReady, setHeliaReady] = useState(Boolean(helia))
  const [heliaInitError, setHeliaInitError] = useState(null)

  useEffect(() => {
    // The fn to useEffect should not return anything other than a cleanup fn,
    // So it cannot be marked async, which causes it to return a promise,
    // Hence we delegate to a async fn rather than making the param an async fn.

    startHelia()
    return function cleanup () {
      if (helia && helia.stop) {
        console.log('Stopping Helia')
        helia.stop().catch(err => console.error(err))
        helia = null
        setHeliaReady(false)
      }
    }
  }, [])

  async function startHelia () {
    if (helia) {
      console.log('Helia already started')
    } else {
      try {
        console.time('Helia Starting')
        helia = await createNode()
        console.timeEnd('Helia Started')
      } catch (error) {
        console.error('Helia init error:', error)
        helia = null
        setHeliaInitError(error)
      }
    }

    setHeliaReady(Boolean(helia))
  }

  return { helia, isHeliaReady, heliaInitError }
}
