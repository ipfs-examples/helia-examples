import { CodeError } from '@libp2p/interface'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import fixtures from './fixtures.js'

export class MemoryBlockstore {
  data

  constructor () {
    this.data = new Map()

    // prefill blockstore with test fixtures
    Object.values(fixtures).forEach((fixture) => {
      this.put(fixture.cid, fixture.data)
    })
  }

  put (key, val) { // eslint-disable-line require-await
    this.data.set(base32.encode(key.multihash.bytes), val)

    return key
  }

  get (key) {
    const buf = this.data.get(base32.encode(key.multihash.bytes))

    if (buf == null) {
      throw new CodeError('Not found', 'ERR_NOT_FOUND')
    }

    return buf
  }

  has (key) {
    return this.data.has(base32.encode(key.multihash.bytes))
  }

  async delete (key) {
    this.data.delete(base32.encode(key.multihash.bytes))
  }

  async * getAll () {
    for (const [key, value] of this.data.entries()) {
      yield {
        cid: CID.createV1(raw.code, Digest.decode(base32.decode(key))),
        block: value
      }
    }
  }
}
