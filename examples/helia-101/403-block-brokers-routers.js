/* eslint-disable no-console */
// @ts-check
import { withBitswap } from '@helia/bitswap'
import { delegatedHTTPRouter } from '@helia/delegated-routing-client'
import { fallbackRouter } from '@helia/fallback-router'
import { withLibp2p } from '@helia/libp2p'
import { trustlessGatewayBlockBroker } from '@helia/trustless-gateway-client'
import { unixfs } from '@helia/unixfs'
import { createHeliaLight } from 'helia'
import { CID } from 'multiformats/cid'

const cid = CID.parse('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi') // a known CID with multiple providers

// Block brokers and routers are used to handle block retrieval and routing in Helia
// Routers find providers for blocks, which are then passed to
// the block broker to retrieve the block
//
// `createHeliaLight` creates a Helia node with no block brokers or routers.
// You add the ones you want, either as `blockBrokers` and `routers` options or
// with the `with*` helpers that augment a node. `createHelia` is
// `createHeliaLight` with `withHTTP`, `withLibp2p` and `withBitswap` applied,
// plus some extra codecs and hashers
//
// Helia has two block brokers:
// - `withBitswap` from `@helia/bitswap`: uses the bitswap protocol over libp2p
//   connections. It needs a libp2p node, which `withLibp2p` from
//   `@helia/libp2p` adds
// - `trustlessGatewayBlockBroker` from `@helia/trustless-gateway-client`: uses
//   trustless gateways over HTTP(S)
//
//   Trustless gateways are either recursive public gateways or gateway
//   providers (that are found via the delegated routing endpoint)
//   See https://docs.ipfs.tech/concepts/ipfs-gateway/#gateway-types
//
// Routers handle content and peer routing, meaning they find peers (or gateways)
// providing blocks. Helia queries all configured routers in parallel, except
// routers with the 'fallback' capability, which are only queried after the
// others have finished:
// - libp2p routing: uses libp2p (which uses the DHT and HTTP delegated routing)
//   to find providers. `withLibp2p` adds it to the node
// - `delegatedHTTPRouter` from `@helia/delegated-routing-client`: uses an HTTP
//   delegated routing endpoint to find providers
// - `fallbackRouter` from `@helia/fallback-router`: uses a static list of IPFS
//   gateways as providers. It is a fallback router, so it is only used when
//   the other routers cannot find providers, or when you know in advance that
//   a gateway is the provider for CIDs
//
// `withHTTP` from `@helia/http` combines `trustlessGatewayBlockBroker`,
// `delegatedHTTPRouter` and `fallbackRouter` (using public gateways) into a
// single helper.

// This node will use the delegated routing endpoint to find providers and
// bitswap over libp2p connections to retrieve blocks. `createHeliaLight`
// returns an unstarted node, so we call `.start()` on it
//
// `withLibp2p` already adds libp2p routing, and libp2p routing already includes
// delegated routing (via delegated-ipfs.dev). The explicit `delegatedHTTPRouter`
// below is therefore redundant here and only demonstrates how to add a router.
// In real code you would only add it to use a different delegated routing
// endpoint
const bitswapDelegatedRoutingNode = await withBitswap(withLibp2p(createHeliaLight({
  routers: [
    delegatedHTTPRouter({
      url: 'https://delegated-ipfs.dev'
    })
  ]
}))).start()
const fsBitswap = unixfs(bitswapDelegatedRoutingNode)

console.log('Stats:', await fsBitswap.stat(cid))

// This node has no libp2p node. It uses IPFS gateways as providers and fetches
// blocks from them as trustless gateways over HTTP(S)
const gatewayNode = await createHeliaLight({
  blockBrokers: [trustlessGatewayBlockBroker()],
  routers: [fallbackRouter({ gateways: ['https://ipfs.io', 'https://w3s.link'] })]
}).start()

const fsGateways = unixfs(gatewayNode)
console.log('Stats:', await fsGateways.stat(cid))

await bitswapDelegatedRoutingNode.stop()
await gatewayNode.stop()
