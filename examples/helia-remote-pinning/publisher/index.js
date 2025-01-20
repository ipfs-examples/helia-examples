/* eslint-disable no-console */

import { heliaWithRemotePins } from '@helia/remote-pinning'
import { bootstrap } from '@libp2p/bootstrap'
import { devToolsMetrics } from '@libp2p/devtools-metrics'
import { createHelia, libp2pDefaults } from 'helia'
import drain from 'it-drain'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'

const DOM = {
  statusOutput: () => document.getElementById('publish-status'),
  publishInput: () => document.getElementById('publish-input'),
  publishButton: () => document.getElementById('publish-button'),
  output: () => document.getElementById('publish-output')
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

// create a Helia node that uses our remote pinning service
const helia = heliaWithRemotePins(await createHelia({
  libp2p
}), {
  endpointUrl: 'http://127.0.0.1:64486',
  accessToken: 'SHHH-VERY-SECRET'
})

helia.libp2p.addEventListener('transport:listening', (evt) => {
  DOM.statusOutput().innerText = 'Ready'
  DOM.publishButton().disabled = false
})

// create and pin content
DOM.publishButton().onclick = async (event) => {
  event.preventDefault()

  try {
    DOM.output().innerText = ''

    const data = new TextEncoder().encode(DOM.publishInput().value ?? '')
    const digest = await sha256.digest(data)
    const cid = CID.createV1(raw.code, digest)

    DOM.output().innerText += 'Adding data\n'

    // add the pin to the blockstore
    await helia.blockstore.put(cid, data)

    DOM.output().innerText += `Pinning ${cid}\n`

    // pin the block using the remote service
    await drain(helia.pins.add(cid))

    DOM.output().innerText += `Pinned ${cid}\n`
  } catch (err) {
    DOM.output().innerText += `Error ${err}\n`
  }
}
