import { createReadStream } from 'node:fs'
import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'
import { fixedSize } from 'ipfs-unixfs-importer/chunker'
import { balanced } from 'ipfs-unixfs-importer/layout'


//--------------------------------set up

const helia = await createHelia()
const fs = unixfs(helia)

const bigDirectorySource = "https://sourceforge.net/projects/freetype/files/latest/download" 

//--------------------------------directory inputs

// using a local copy of https://www.gutenberg.org/files/2600/2600-h/2600-h.htm , curled to this directory but not checked in
const bigHtmlFile = createReadStream('./2600-h.htm')

// generate CID according to Helia defaults (~== kubo v1 profile) from bigHtmlFile:
const cidBigHTML = await fs.addFile(
  { 
    path: './bigHtmlFile.htm', 
    //content: bigHtmlFile 
  }, {
    wrapWithDirectory: false 
  }
)

//kubo CID: bafybeifrc2vrh76j7dccg2hgihoy66su7jw2vvxoihrswevbdaazlquhpq 
console.log('bigHtmlFile test-cid-v1 profile: ', cidBigHTML.toString())
const stats = await fs.stat(cidBigHTML)
console.log('Stats:', stats)

// generate CID according to Kubo legacy-cid-v0 profile from bigHtmlFile:
const bigHtmlFile2 = createReadStream('./2600-h.htm')
const cidBigHTML2 = await fs.addFile(
  { 
    path: './bigHtmlFile.htm', 
    //content: bigHtmlFile2 
  }, {
    cidVersion: 0,
    rawLeaves: false,
    layout: balanced({
      maxChildrenPerNode: 174
    }),
    chunker: fixedSize({
      chunkSize: 262_144
    }),
    wrapWithDirectory: false 
  }
)

//kubo CID: QmaYSLS6tenji27mAV9Nzr69pZNapQ4PdDp48ESRToYXSr
console.log('bigHtmlFile legacy-cid-v0 profile: ', cidBigHTML2.toString())
const stats2 = await fs.stat(cidBigHTML2)
console.log('Stats:', stats2)

//--------------------------------directory inputs

// big-directory populated with enough small files to trigger HAMT behavior

// generate CID according to Helia defaults (~== kubo v1 profile) from a big directory:
const cidBigDirectory = await fs.addDirectory(
  { 
    path: 'big-directory/*', 
  }, {
    wrapWithDirectory: false 
  }
)

//CID: bafybeid5dv43dj6iwwd5wddkwiztty2i7ln55ri2yz4za5oboqrjtw7x54 
console.log('bigDirectory test-cid-v1 profile: ', cidBigDirectory.toString())
const stats3 = await fs.stat(cidBigDirectory)
console.log('Stats:', stats3)

// generate CID according to Kubo legacy-cid-v0 profile from bif directory:
const cidBigDirectory2 = await fs.addDirectory(
  { 
    path: 'big-directory/*', 
  }, {
    cidVersion: 0,
    rawLeaves: false,
    layout: balanced({
      maxChildrenPerNode: 256
    }),
    chunker: fixedSize({
      chunkSize: 262_144
    }),
    wrapWithDirectory: false 
  }
)

//kubo CID: QmeyiUNRgGQg5g68GvgGm817i7qMv6YqSNvNNLdZtbBsba
console.log('bigDirectory legacy-cid-v0 profile: ', cidBigDirectory2.toString())
const stats4 = await fs.stat(cidBigDirectory2)
console.log('Stats:', stats4)