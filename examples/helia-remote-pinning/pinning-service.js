/* eslint-disable no-console */

import { createPinningServiceAPIServer } from '@helia/pinning-service-api-server'
import { bootstrap } from '@libp2p/bootstrap'
import { createHelia, libp2pDefaults } from 'helia'

const libp2p = libp2pDefaults()
libp2p.peerDiscovery = [
  bootstrap({
    list: [
      '/ip4/127.0.0.1/tcp/64484'
    ]
  })
]

const helia = await createHelia({
  libp2p
})

// this access token will be used by the publisher to ensure it is allowed to
// pin new content on the pinning service. in production you should generate
// these yourself and enforce validity, etc.
const accessToken = 'SHHH-VERY-SECRET'

const server = await createPinningServiceAPIServer(helia, {
  validateAccessToken: (token) => {
    if (token === accessToken) {
      return {
        id: accessToken
      }
    }

    throw new Error('Invalid access token')
  },
  listen: {
    host: '0.0.0.0',
    port: 64486
  }
})

const address = server.server.address()

console.info('pinning service listening on')
console.info(`http://127.0.0.1:${address.port}`)
