/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'

// create a Helia node
const helia = await createHelia()

// create a filesystem on top of Helia, in this case it's UnixFS
const fs = unixfs(helia)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes to your node and receive a unique content identifier
const cid = await fs.addBytes(encoder.encode('Hello World 101'), {
  onProgress: (evt) => {
    console.info('add event', evt.type, evt.detail)
  }
})

console.log('Added file:', cid.toString())

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

for await (const chunk of fs.cat(cid, {
  onProgress: (evt) => {
    console.info('cat event', evt.type, evt.detail)
  }
})) {
  text += decoder.decode(chunk, {
    stream: true
  })
}

console.log('Added file contents:', text)
