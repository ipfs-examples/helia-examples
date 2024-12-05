import { createHelia } from 'helia'

export async function createHeliaNode () {
  const node = await createHelia()

  return node
}
