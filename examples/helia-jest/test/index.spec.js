/* eslint-env jest */

import { createHeliaNode } from '../src/index.js'

describe('Helia', () => {
  let helia

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
