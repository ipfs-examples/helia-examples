/* eslint-disable no-console */

// this file is regular CommonJS

async function main () {
  const { createHelia } = await import('helia')
  const { createLibp2p } = await import('libp2p')
  const { noise } = await import('@chainsafe/libp2p-noise')
  const { yamux } = await import('@chainsafe/libp2p-yamux')
  const { webSockets } = await import('@libp2p/websockets')
  const { bootstrap } = await import('@libp2p/bootstrap')
  const { unixfs } = await import('@helia/unixfs')
  const { MemoryBlockstore } = await import('blockstore-core')
  const { MemoryDatastore } = await import('datastore-core')

  // the blockstore is where we store the blocks that make up files
  const blockstore = new MemoryBlockstore()

  // application-specific data lives in the datastore
  const datastore = new MemoryDatastore()

  // libp2p is the networking layer that underpins Helia
  const libp2p = await createLibp2p({
    datastore,
    transports: [
      webSockets()
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    peerDiscovery: [
      bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
        ]
      })
    ]
  })

  // create a Helia node
  const helia = await createHelia({
    datastore,
    blockstore,
    libp2p
  })

  // print out our node's PeerId
  console.log(helia.libp2p.peerId)

  // create a filesystem on top of Helia, in this case it's UnixFS
  const fs = unixfs(helia)

  // we will use this TextEncoder to turn strings into Uint8Arrays
  const encoder = new TextEncoder()

  // add the bytes to your node and receive a unique content identifier
  const cid = await fs.addBytes(encoder.encode('Hello World 101'), helia.blockstore)

  console.log('Added file:', cid.toString())

  // this decoder will turn Uint8Arrays into strings
  const decoder = new TextDecoder()
  let text = ''

  for await (const chunk of fs.cat(cid)) {
    text += decoder.decode(chunk, {
      stream: true
    })
  }

  console.log('Added file contents:', text)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
