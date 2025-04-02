import { createReadStream } from 'node:fs'
import { globSource, unixfs } from '@helia/unixfs'
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

console.log('bigHtmlFile legacy-cid-v0 profile: ', cidBigHTML2.toString())
const stats2 = await fs.stat(cidBigHTML2)
console.log('Stats:', stats2)

//--------------------------------directory inputs

// big-directory populated with many small files and subdirectories to trigger
// recursive encoding, but not enough to trigger a HAMT-directory

// generate CID according to Helia defaults (~== kubo v1 profile) from a big
// directory via the globSource function (see
// https://ipfs.github.io/helia/functions/_helia_unixfs.index.globSource.html ):

for await (const entry of fs.addAll(globSource(
   './big_directory',
   '**/*'
  ), {
      wrapWithDirectory: true 
    }
  )
){
  console.log('bigDirectory test-cid-v1 profile: ', entry.cid.toString())
  const stats3 = await fs.stat(entry.cid)
  console.log('Stats:', stats3)
}
   
// generate CID according to Kubo legacy-cid-v0 profile from same directory:

for await (const entry of fs.addAll(globSource(
  './big_directory',
  '**/*'
 ), {
  cidVersion: 0,
  rawLeaves: false,
  layout: balanced({
    maxChildrenPerNode: 256
  }),
  chunker: fixedSize({
    chunkSize: 262_144
  }),
  wrapWithDirectory: true 
 }
 )
){
  console.log('bigDirectory kubo-cid-v0 profile: ', entry.cid.toString())
  const stats4 = await fs.stat(entry.cid)
  console.log('Stats:', stats4)
}