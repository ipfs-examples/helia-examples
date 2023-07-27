/* eslint-disable no-console */

// this file is regular CommonJS

async function main () {
  const { createHelia } = await import('helia')
  const { unixfs } = await import('@helia/unixfs')

  // create a Helia node
  const helia = await createHelia()

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
