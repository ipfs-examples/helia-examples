/* eslint-disable no-console */
// @ts-check

import * as nodefs from 'fs'
import { devNull } from 'node:os'
import { pipeline } from 'stream/promises'
import { createHeliaHTTP } from '@helia/http'
import { unixfs, urlSource } from '@helia/unixfs'

// `@helia/http` is an light http-only version Helia with the same API,
// which is useful for simple use cases, where you don't need p2p networking to provide data to other nodes.
// Since this example is focused on UnixFS without p2p networking, we can use the `@helia/http` package.
const helia = await createHeliaHTTP()

// UnixFS allows you to encode files and directories such that they are addressed by CIDs and can be retrieved by other nodes on the network
const fs = unixfs(helia)

// we will use this TextEncoder to turn strings into Uint8Arrays which we can add to the node
const encoder = new TextEncoder()

// addBytes takes raw bytes and returns a raw block CID for the content
// (larger (over 1 MiB) binary arrays are chunked and return a dag-pb block CID instead)
// The `bytes` value we have passed to `unixfs` has now been turned into a UnixFS DAG and stored in the helia node.
const cid = await fs.addBytes(encoder.encode('Hello World 101'), {
  onProgress: (evt) => {
    console.info('add event', evt.type, evt.detail)
  }
})
console.log('Added file:', cid.toString())

// Create an empty directory
const directoryCid = await fs.addDirectory()

// Add a raw block CID to the directory as a file with the name `hello.txt`
const updatedCid = await fs.cp(cid, directoryCid, 'hello.txt')
console.log('Directory with added file:', updatedCid)

// addFile always returns a directory CID, retaining the filename derived from the `path` argument
const readmeCid = await fs.addFile({
  content: nodefs.createReadStream('./README.md'),
  path: './README.md'
})

// stat returns a UnixFSStats object, which contains information about the directory
const readmeStats = await fs.stat(readmeCid)
console.log('README.md stats:', readmeStats)

// To get the size of a directory, we need extended stats, which traverse the DAG
const readmeExStats = await fs.stat(readmeCid, { extended: true })
console.log('README.md stats (extended):', readmeExStats)

// this decoder will turn Uint8Arrays into strings
const decoder = new TextDecoder()
let text = ''

// Read the file into memory and print it to the console
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

// Add a file to Helia from a URL
// Helia will download, and add the file into smaller chunks and return a directory containing a file node `2600-h.htm` with links to the raw blocks of the file
const url = 'https://www.gutenberg.org/files/2600/2600-h/2600-h.htm'
const urlCid = await fs.addFile(urlSource(url))

const urlCidStats = await fs.stat(urlCid)
console.log('File from URL: stats:', urlCidStats)

// Instead of loading the file into memory like we did above, we can use the `cat` API, which returns an async iterable,
// allowing us to stream the file to a writable stream, which we can pipe to devNull, process.stdout, or a file.
try {
  await pipeline(
    fs.cat(urlCid, {
      path: '/2600-h.htm'
    }),
    // Uncomment only one of the three lines below:
    nodefs.createWriteStream(devNull) // devNull is a writable stream that discards all data written to it
    // process.stdout, // stream file to the console
    // createWriteStream('./war_and_peace.html'), // stream to a file on the local file system
  )
} catch (err) {
  console.error('Pipeline failed', err)
}
