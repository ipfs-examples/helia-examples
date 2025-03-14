/* eslint-disable no-console */
// @ts-check

import { createHeliaHTTP } from '@helia/http'
import { unixfs, urlSource } from '@helia/unixfs'
import { pipeline } from 'stream/promises'
import * as nodefs from 'fs'
import { devNull } from 'node:os'

// create a Helia node
const helia = await createHeliaHTTP()

// UnixFS allows you to encode files and directories such that they are addressed by CIDs and can be retrieved by other nodes on the network
const fs = unixfs(helia)

// addFile always returns a directory CID, retaining the filename derived from the `path` argument
const readmeCid = await fs.addFile({
  content: nodefs.createReadStream('./README.md'),
  path: './README.md',
})

// stat returns a UnixFSStats object, which contains information about the file or directory
const readmeStats = await fs.stat(readmeCid)
console.log('README.md stats:', readmeStats)

// we will use this TextEncoder to turn strings into Uint8Arrays
const encoder = new TextEncoder()

// add the bytes and receive a raw block CID for the content because it's small enough to fit into a single block
const cid = await fs.addBytes(encoder.encode('Hello World 101'), {
  onProgress: (evt) => {
    console.info('add event', evt.type, evt.detail)
  },
})
console.log('Added file:', cid.toString())

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

// Read the file into memory and print it to the console
for await (const chunk of fs.cat(cid, {
  onProgress: (evt) => {
    console.info('cat event', evt.type, evt.detail)
  },
})) {
  text += decoder.decode(chunk, {
    stream: true,
  })
}
console.log('Added file contents:', text)

// Create an empty directory
const directoryCid = await fs.addDirectory({
  path: 'my-dir',
})

// Add a file to the directory
const updatedCid = await fs.cp(cid, directoryCid, 'hello.txt')
console.log('Directory with added file:', updatedCid)

// Add a file to Helia from a URL
// This will download, chunk the file into smaller chunks and return a directory containing the file CID with links to the raw blocks of the file
const url = 'https://www.gutenberg.org/files/2600/2600-h/2600-h.htm'
const urlCid = await fs.addFile(urlSource(url))

const urlCidStats = await fs.stat(urlCid)
console.log('File from URL: stats:', urlCidStats)

// Helia UnixFS returns an async iterable, allowing integration with other streams
// Here we use the pipeline function to pipe the stream to devNull to avoid writing to the file system
try {
  await pipeline(
    fs.cat(urlCid, {
      path: '/2600-h.htm',
    }),
    nodefs.createWriteStream(devNull),
    // createWriteStream('./war_and_peace.html'), // uncomment this to write to the file system
  )
} catch (err) {
  console.error('Pipeline failed', err)
}
