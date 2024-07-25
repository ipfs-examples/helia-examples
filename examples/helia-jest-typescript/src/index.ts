import { createHelia } from 'helia'
import type { HeliaLibp2p } from 'helia'

export async function createHeliaNode (): Promise<HeliaLibp2p> {
  const node = await createHelia()

  return node
}
