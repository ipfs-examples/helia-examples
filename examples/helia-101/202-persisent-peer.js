/* eslint-disable no-console */
// @ts-check
import { createHelia } from 'helia'
import { FsDatastore } from 'datastore-fs'
import { loadOrCreateSelfKey } from '@libp2p/config'

//  Filesystem datastore to persist the private key and helia/libp2p state
const datastore = new FsDatastore('./datastore')

// Load or create a private key from the filesystem datastore
const privateKey = await loadOrCreateSelfKey(datastore)

// Create a new Helia node with the private key
const helia = await createHelia({
  datastore, 
  libp2p: {
    // Note that you need to pass the private key explicitly here, as libp2p
    // will not load it from the datastore automatically
    privateKey 
  }
})

console.log(`Started Helia node with Peer ID: ${helia.libp2p.peerId.toString()}`)

await helia.stop()
