/* eslint-disable no-console */
// @ts-check

import { createHeliaHTTP } from '@helia/http'
import { unixfs as UnixFS } from '@helia/unixfs'

const helia = await createHeliaHTTP()

// UnixFS allows you to encode files and directories such that they are addressed by CIDs
const unixfs = UnixFS(helia)


const encoder = new TextEncoder()
const contentCid = await unixfs.addBytes(encoder.encode('UnixFS is a standard for encoding files and directories in IPFS.'))
const contentCid2 = await unixfs.addBytes(encoder.encode('everything in UnixFS has a CID'))
console.log('Added file:', contentCid.toString())

// Create an empty root directory
let rootDirectoryCid = await unixfs.addDirectory()
console.log('rootDirectoryCid (empty):', rootDirectoryCid)

// The problem with this is that we don't get the CID of `my-books`
// which makes it harder to add files to `my-books`
// rootDirectoryCid = await fs.mkdir(rootDirectoryCid, 'my-books')

// Create a new empty UnixFS directory to which we will add files
let myBooks = await unixfs.addDirectory()
console.log('myBooks (empty):', myBooks)

// Create a another empty UnixFS directory to which we will add files
let myJournal = await unixfs.addDirectory()
console.log('myJournal (empty):', myJournal)

// Add the first file to `my-books`. cp will return the cid of the updated target directory
myBooks = await unixfs.cp(contentCid, myBooks, 'hello.txt')

// Add the second file to `my-journal`
myJournal = await unixfs.cp(contentCid2, myJournal, 'hello2.txt')

// Add the `my-books` and `my-journal` directories to the root directory
rootDirectoryCid = await unixfs.cp(myBooks, rootDirectoryCid, 'my-books')
rootDirectoryCid = await unixfs.cp(myJournal, rootDirectoryCid, 'my-journal')


await listDirectoryContents(rootDirectoryCid)

// Function to list directory contents recursively
async function listDirectoryContents(cid, indent = '') {
  for await (const entry of unixfs.ls(cid)) {
    console.log(`${indent}${entry.name} (${entry.type})`)
    if (entry.type === 'directory') {
      await listDirectoryContents(entry.cid, indent + '  ')
    }
  }
}


