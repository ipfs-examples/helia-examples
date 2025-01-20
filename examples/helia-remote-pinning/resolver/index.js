/* eslint-disable no-console */

import { bootstrap } from '@libp2p/bootstrap'
import { devToolsMetrics } from '@libp2p/devtools-metrics'
import { createHelia, libp2pDefaults } from 'helia'
import { CID } from 'multiformats/cid'

const DOM = {
  resolveInput: () => document.getElementById('resolve-input'),
  resolveButton: () => document.getElementById('resolve-button'),
  output: () => document.getElementById('resolve-output')
}

// override default libp2p config to:
// 1. use our local bootstrapper to join the network
// 2. reconfigure the WebSocket transport to allow connecting to insecure local addresses
const libp2p = libp2pDefaults()
libp2p.metrics = devToolsMetrics()
libp2p.peerDiscovery = [
  bootstrap({
    list: [
      '/ip4/127.0.0.1/tcp/64485/ws/p2p/12D3KooWMwuMkgbRWbvmYk2uS7Ekr3ZcWTW5AdDCBDMKAtsVd2jt'
    ]
  })
]
libp2p.connectionGater = {
  denyDialMultiaddr: () => false
}

// create a Helia node
const helia = await createHelia({
  libp2p
})

// create and pin content
DOM.resolveButton().onclick = async (event) => {
  event.preventDefault()

  try {
    DOM.output().innerText = ''

    const cid = CID.parse(DOM.resolveInput().value ?? '')

    DOM.output().innerText += `Resolving ${cid}\n`

    // load the pinned block
    const data = await helia.blockstore.get(cid, {
      signal: AbortSignal.timeout(5000)
    })

    // show the contents
    DOM.output().innerText += `Resolved ${new TextDecoder().decode(data)}\n`
  } catch (err) {
    DOM.output().innerText += `Error ${err.toString()}\n`
  }
}
