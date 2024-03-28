import { MemoryBlockstore as OriginalMemoryBlockstore } from 'blockstore-core'
import fixtures from './fixtures.js'

/**
 * Custom memory blockstore module which we pre-load with fixture blocks for testing
 */
export class MemoryBlockstore extends OriginalMemoryBlockstore {
  constructor () {
    super()

    // prefill blockstore with test fixtures
    Object.values(fixtures).forEach((fixture) => {
      this.put(fixture.cid, fixture.data)
    })
  }
}
