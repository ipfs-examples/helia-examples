/* eslint-disable no-console */

import { createHelia } from 'helia'

void createHelia().start()
  .then(helia => {
    console.info('Helia is running')
    console.info('PeerId:', helia.libp2p.peerId.toString())
  })
