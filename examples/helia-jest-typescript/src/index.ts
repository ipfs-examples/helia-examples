import { createHelia } from 'helia'
import type { HeliaWithLibp2p } from '@helia/libp2p'

export async function createHeliaNode (): Promise<HeliaWithLibp2p> {
  const node = await createHelia().start()

  return node
}
