/* eslint-env jest */

import { createHeliaNode } from '../src/index.js'
import type { Helia } from '@helia/interface'

describe('Helia', () => {
  let helia: Helia

  beforeEach(async () => {
    helia = await createHeliaNode()
  })

  afterEach(async () => {
    if (helia != null) {
      await helia.stop()
    }
  })

  describe('libp2p', () => {
    it('should have a peer id', async () => {
      expect(helia.libp2p.peerId).toBeTruthy()
    })
  })
})
