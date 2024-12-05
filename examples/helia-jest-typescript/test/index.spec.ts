/* eslint-env jest */

import { createHeliaNode } from '../src/index.js'
import type { HeliaLibp2p } from 'helia'

describe('Helia', () => {
  let helia: HeliaLibp2p

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
