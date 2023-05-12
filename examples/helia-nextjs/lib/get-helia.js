import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import getLibp2p from './get-libp2p.js'

export default async function getHelia () {
  const blockstore = new MemoryBlockstore()
  const datastore = new MemoryDatastore()

  const libp2p = await getLibp2p({ datastore })

  // create a Helia node
  return await createHelia({
    datastore,
    blockstore,
    libp2p
  })
}
