import { createVerifiedFetch, VerifiedFetch } from '@helia/verified-fetch'
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
import { createHelia, libp2pDefaults } from 'helia'
import { httpGatewayRouting, libp2pRouting } from '@helia/routers'
import { createLibp2p } from 'libp2p'


// Singleton verifiedFetch instances
let verifiedFetch: VerifiedFetch | undefined
let verifiedFetchP2P: VerifiedFetch | undefined

interface VerifiedFetchOptions {
  useLibp2p?: boolean
  useRecursiveGateways?: boolean,
}

export async function getVerifiedFetch(options: VerifiedFetchOptions = { useLibp2p: false, useRecursiveGateways: true }): Promise<VerifiedFetch> {
  console.log('getVerifiedFetch', options)

  if (!options.useLibp2p) {
    verifiedFetch = verifiedFetch ?? await createVerifiedFetch()
    return verifiedFetch
  }
 
  verifiedFetchP2P = verifiedFetchP2P ?? await createVerifiedFetchP2P(options)
  
  console.log('verifiedFetchP2P', verifiedFetchP2P)

  return verifiedFetchP2P
}


async function createVerifiedFetchP2P(options: VerifiedFetchOptions): Promise<VerifiedFetch> {
  const libp2pOptions = libp2pDefaults()

  // Disable DHT Client, since we have the delegated routing endpoint
  delete (libp2pOptions.services as any).dht
  // Remove the default bootstrap peer discovery
  delete libp2pOptions.peerDiscovery

  // Override the default delegated routing service to include filters until https://github.com/ipfs/helia/pull/651 is merged
  libp2pOptions.services.delegatedRouting = () =>
    createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev', {
      filterAddrs: ['unknown', 'transport-bitswap', 'transport-ipfs-gateway-http'],
      filterProtocols: ['https', 'webtransport', 'webrtc', 'webrtc-direct', 'wss'],
  })

  const libp2p = await createLibp2p(libp2pOptions)
  console.log('libp2p', libp2p)

  const helia = await createHelia({
    libp2p: libp2p,
    routers: options.useRecursiveGateways ? [httpGatewayRouting(), libp2pRouting(libp2p)] : [libp2pRouting(libp2p)]
  })

  return createVerifiedFetch(helia)
}
