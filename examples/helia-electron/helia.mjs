/* eslint-disable no-console */

import { createHelia } from 'helia'

export async function createNode () {
  return await createHelia()
}
