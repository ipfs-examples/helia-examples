/* eslint-disable no-console */
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { createPinningServiceAPIServer } from '@helia/pinning-service-api-server'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { privateKeyFromProtobuf } from '@libp2p/crypto/keys'
import { identify } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { tcp } from '@libp2p/tcp'
import { webSockets } from '@libp2p/websockets'
import { createHelia, libp2pDefaults } from 'helia'
import { createLibp2p } from 'libp2p'
import { setup, expect } from 'test-ipfs-example/browser'
import { fromString } from 'uint8arrays/from-string'

// Setup
const test = setup({
  servers: [{
    path: './publisher/dist'
  }, {
    path: './resolver/dist'
  }]
})

// DOM
const publishStatus = '#publish-status'
const publishInput = '#publish-input'
const publishButton = '#publish-button'
const publishOutput = '#publish-output'
const resolveInput = '#resolve-input'
const resolveButton = '#resolve-button'
const resolveOutput = '#resolve-output'

let publisherUrl
let resolverUrl

async function spawnBootstrapper () {
  const boostrapperKey = 'CAESQOr+wN1cDgutS/juD5EjvL+nps5/lsIFrO/AjsNnT+petDqTQaus6teAHNTEY0YP3HZdYd1cPgWtpKHASiC5Ers'
  const protobuf = fromString(boostrapperKey, 'base64')
  const privateKey = privateKeyFromProtobuf(protobuf)

  return createLibp2p({
    privateKey,
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/64484',
        '/ip4/0.0.0.0/tcp/64485/ws'
      ]
    },
    transports: [
      tcp(),
      webSockets()
    ],
    connectionEncrypters: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    services: {
      identify: identify(),
      kadDHT: kadDHT(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: Infinity
        }
      })
    }
  })
}

async function spawnPinningService () {
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

  return {
    stop: async () => {
      server.server.closeAllConnections()
      await server.close()
      await helia.stop()
    }
  }
}

test.describe('remote pinning example:', () => {
  let bootstrapper
  let pinningService

  // eslint-disable-next-line no-empty-pattern
  test.beforeAll(async ({ servers }, testInfo) => {
    testInfo.setTimeout(5 * 60_000)
    bootstrapper = await spawnBootstrapper()
    pinningService = await spawnPinningService()

    publisherUrl = servers[0].url
    resolverUrl = servers[1].url
  }, {})

  test.afterAll(async () => {
    await pinningService?.stop()
    await bootstrapper?.stop()
  })

  test.beforeEach(async ({ page }) => {
    await page.goto(publisherUrl)
  })

  test('should pin content remotely', async ({ page: pageA, context }) => {
    // wait for publisher to get relay address
    const publishStatusResult = pageA.locator(publishStatus)
    await expect(publishStatusResult).toHaveText(/Ready/)

    // publish some data
    await pageA.fill(publishInput, 'hello world')
    await pageA.click(publishButton)

    const publishResult = pageA.locator(publishOutput)
    await expect(publishResult).toHaveText(/Pinned/)

    const publishOutputContent = await pageA.textContent(publishOutput)
    const cid = publishOutputContent.split('Pinned ').pop().trim()

    // load second page
    const pageB = await context.newPage()
    await pageB.goto(resolverUrl)

    // dial first page from second page over relay
    await pageB.fill(resolveInput, cid)
    await pageB.click(resolveButton)

    const resolveResult = pageB.locator(resolveOutput)
    await expect(resolveResult).toHaveText(/Resolved/)

    const resolveOutputContent = await pageB.textContent(resolveOutput)
    expect(resolveOutputContent).toContain('hello world')
  })
})
