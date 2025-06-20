/* eslint-disable no-console */
// @ts-check

import * as nodefs from 'fs'
import { pipeline } from 'stream/promises'
import { car as CAR } from '@helia/car'
import { createHeliaHTTP } from '@helia/http'
import { unixfs, globSource } from '@helia/unixfs'

// This is a script showing how to use globSource to merkelize files
// and directories from your local file system into a CAR file.

// Take the first argument as the path of the folder to add
const args = process.argv.slice(2)

// Example of how to use arguments
if (args.length === 0) {
  console.error('No argument provided')
  console.error('Usage: node 103-glob-unixfs.js <path-to-add> <output-car-file>')
}

const path = args[0]
const outputCarFile = args[1]

// Check if the path exists
if (!nodefs.existsSync(path)) {
  console.error('Path does not exist')
  process.exit(1)
}

const helia = await createHeliaHTTP()

// UnixFS allows you to encode files and directories such that they are
// addressed by CIDs and can be retrieved by other nodes on the network
const fs = unixfs(helia)

// Glob source will recursively add all files and directories in the path
const source = globSource(path, '**/*', {
  hidden: false // ignore hidden files
})

let last
// add all files and directories in the path and wrap it all in a directory
for await (const entry of fs.addAll(source, { wrapWithDirectory: true })) {
  console.log(entry.cid, entry.path, entry.unixfs?.fileSize(), entry.unixfs?.type ?? 'raw')
  last = entry.cid
}

if (!last) {
  console.error('No CID found')
  process.exit(1)
}

const car = CAR(helia)

const out = nodefs.createWriteStream(outputCarFile)

// stream the car file to the output file
await pipeline(car.stream(last), out)

console.log(`Wrote car file to ${outputCarFile}`)
