/* eslint-disable no-console */
// @ts-check

import { withHTTP } from '@helia/http'
import { unixfs as UnixFS } from '@helia/unixfs'
import { createHeliaLight } from 'helia'

const helia = await withHTTP(createHeliaLight()).start()

// UnixFS allows you to encode files and directories such that they are
// addressed by CIDs
const unixfs = UnixFS(helia)

const encoder = new TextEncoder()
const contentCid = await unixfs.addBytes(
  encoder.encode('UnixFS is a standard for encoding files and directories in IPFS.')
)
const contentCid2 = await unixfs.addBytes(
  encoder.encode('everything in UnixFS has a CID')
)
console.log('Added file:', contentCid.toString())

// Create an empty root directory
let rootDirectoryCid = await unixfs.addDirectory()
console.log('rootDirectoryCid (empty):', rootDirectoryCid)

// Create a new empty UnixFS directory to which we will add files
let myBooks = await unixfs.addDirectory()
console.log('myBooks (empty):', myBooks)

// Create a another empty UnixFS directory to which we will add files
let myJournal = await unixfs.addDirectory()
console.log('myJournal (empty):', myJournal)

// Add the first file to `my-books`. cp will return the cid of the updated
// target directory
myBooks = await unixfs.cp(contentCid, myBooks, 'hello.txt')

// Add the second file to `my-journal`
myJournal = await unixfs.cp(contentCid2, myJournal, 'hello2.txt')

// Add the `my-books` and `my-journal` directories to the root directory
rootDirectoryCid = await unixfs.cp(myBooks, rootDirectoryCid, 'my-books')
rootDirectoryCid = await unixfs.cp(myJournal, rootDirectoryCid, 'my-journal')

await listDirectoryContents(rootDirectoryCid)

// Function to list directory contents recursively
async function listDirectoryContents (cid, indent = '') {
  for await (const entry of unixfs.ls(cid)) {
    // directory entries only hold the name, CID and size of each child, so
    // stat the child to find out whether it is a file or a directory
    const { type } = await unixfs.stat(entry.cid)
    console.log(`${indent}${entry.name} (${type})`)
    if (type === 'directory') {
      await listDirectoryContents(entry.cid, indent + '  ')
    }
  }
}
