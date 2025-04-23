/* eslint-disable no-console */
// @ts-check
import { CID } from 'multiformats/cid'
import { createHelia } from 'helia'
import { bitswap, trustlessGateway } from '@helia/block-brokers'
import { httpGatewayRouting, libp2pRouting, delegatedHTTPRouting } from '@helia/routers'
import { unixfs } from '@helia/unixfs'

const cid = CID.parse('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi') // a known CID with multiple providers

// Block brokers and routers are used to handle block retrieval and routing in Helia
// Routers find providers for blocks, which are then passed to the block broker to retrieve the block
// Helia supports two block brokers (both are enabled by default):
// - `bitswap`: uses the bitswap protocol over libp2p connections
// - `trustlessGateway`: uses the trustless gateways over HTTP(S)
//    Trustless gateways are either recursive public gateways or gateway providers
//    See https://docs.ipfs.tech/concepts/ipfs-gateway/#gateway-types
//
// Routers handle content and peer routing, meaning they find peers (or gateways) providing blocks
// Helia comes with three routers and will race between them to find a provider for a given CID
// - `libp2pRouting`: uses libp2p (which uses the DHT and HTTP delegated routing endpoints) to find providers
// - `delegatedHTTPRouting`: uses an HTTP delegated routing endpoint to find providers. (not needed if libp2p routing is used which already has a delegated routing router)
// - `httpGatewayRouting`: uses statically IPFS gateways as a provider.
//    Useful as a fallback when direct providers cannot be found or for when you know in advance that a gateway is the provider for CIDs


// This node will use the delegated routing endpoint to find providers and bitswap over libp2p connections to retrieve blocks
const bitswapDelegatedRoutingNode = await createHelia({
  blockBrokers: [bitswap()],
  routers: [delegatedHTTPRouting('https://delegated-ipfs.dev')],
})
const fsBitswap = unixfs(bitswapDelegatedRoutingNode)

console.log('Stats:', await fsBitswap.stat(cid))

// This node will just try fetching blocks IPFS gateways as a provider and trustless gateways over HTTP(S) to find providers
const gatewayNode = await createHelia({
  blockBrokers: [trustlessGateway()],
  routers: [httpGatewayRouting({ gateways: ['https://ipfs.io', 'https://w3s.link'] })],
})

const fsGateways = unixfs(gatewayNode)
console.log('Stats:', await fsGateways.stat(cid))

await bitswapDelegatedRoutingNode.stop()
await gatewayNode.stop()
