/* eslint-disable no-console */

import { createHelia } from 'helia'

const node = await createHelia().start()

console.info('Helia is running')
console.info('PeerId:', node.libp2p.peerId.toString())
