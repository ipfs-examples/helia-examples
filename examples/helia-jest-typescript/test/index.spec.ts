import { createHeliaNode } from '../src/index.ts'
import type { HeliaWithLibp2p } from '@helia/libp2p'

describe('Helia', () => {
  let helia: HeliaWithLibp2p

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
