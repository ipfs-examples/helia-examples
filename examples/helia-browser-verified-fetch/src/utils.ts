import { generateKeyPair } from '@libp2p/crypto/keys'
import { createVerifiedFetch, VerifiedFetch } from '@helia/verified-fetch'
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
import { createHelia } from 'helia'
import * as libp2pInfo from 'libp2p/version'
import { httpGatewayRouting, delegatedHTTPRouting, libp2pRouting } from '@helia/routers'
import { enable } from '@libp2p/logger'
import { createLibp2p, Libp2pOptions } from 'libp2p'
import { webTransport } from '@libp2p/webtransport'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { dcutr } from '@libp2p/dcutr'
import { identify, identifyPush } from '@libp2p/identify'
import { keychain } from '@libp2p/keychain'
import { ping } from '@libp2p/ping'
import { webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'

// Singleton verifiedFetch instances
let verifiedFetch: VerifiedFetch | undefined
let verifiedFetchP2P: VerifiedFetch | undefined

interface VerifiedFetchOptions {
  useLibp2p?: boolean
  useRecursiveGateways?: boolean
}

export async function getVerifiedFetch(
  options: VerifiedFetchOptions = { useLibp2p: false, useRecursiveGateways: true },
): Promise<VerifiedFetch> {
  if (!options.useLibp2p) {
    verifiedFetch = verifiedFetch ?? (await createVerifiedFetch())
    return verifiedFetch
  }

  enable('*')
  verifiedFetchP2P = verifiedFetchP2P ?? (await createVerifiedFetchP2P(options))

  return verifiedFetchP2P
}

async function createVerifiedFetchP2P(options: VerifiedFetchOptions): Promise<VerifiedFetch> {
  const libp2pOptions = await libp2pDefaults()

  const libp2p = await createLibp2p(libp2pOptions)

  const helia = await createHelia({
    libp2p,
    // TODO: Do we want `libp2pRouting` or `delegatedHTTPRouting` routers since libp2p only has a delegated routing client?
    // For now sticking to `libp2pRouting` since it allows setting the filters (until https://github.com/ipfs/helia/pull/654 is merged)
    routers: options.useRecursiveGateways
      ? [httpGatewayRouting(), libp2pRouting(libp2p)]
      : [libp2pRouting(libp2p)],
  })

  return createVerifiedFetch(helia)
}

export async function libp2pDefaults(): Promise<Libp2pOptions> {
  const agentVersion = `@helia/verified-fetch ${libp2pInfo.name}/${libp2pInfo.version} UserAgent=${globalThis.navigator.userAgent}`
  const privateKey = await generateKeyPair('Ed25519')

  return {
    privateKey: privateKey,
    addresses: {}, // no need to listen on any addresses
    transports: [webRTCDirect(), webTransport(), webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      delegatedRouting: () =>
        createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev', {
          filterProtocols: ['unknown', 'transport-bitswap', 'transport-ipfs-gateway-http'],
          filterAddrs: ['https', 'webtransport', 'webrtc', 'webrtc-direct', 'wss'],
        }),
      dcutr: dcutr(),
      identify: identify({
        agentVersion,
      }),
      identifyPush: identifyPush({
        agentVersion,
      }),
      keychain: keychain(),
      ping: ping(),
    },
  }
}
