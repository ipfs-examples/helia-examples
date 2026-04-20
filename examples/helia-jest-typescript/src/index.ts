import { createHelia } from 'helia'
import type { Helia } from 'helia'

export async function createHeliaNode (): Promise<Helia> {
  const node = await createHelia()

  return node
}
