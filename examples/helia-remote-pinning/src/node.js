/* eslint-disable no-console */
import { createRemotePinner } from '@helia/remote-pinning'
import { unixfs } from '@helia/unixfs'
import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client'
import { createHelia } from 'helia'
import { isPublicAndDialable } from './helpers/isPublicAndDialable.js'
import { waitForDialableNode } from './helpers/waitForDialableNode.js'

const pinningEndpoint = process.env.VITE_PINNING_ENDPOINT
const pinningToken = process.env.VITE_PINNING_TOKEN
const helia = await createHelia()
const heliaFs = unixfs(helia)
const pinServiceConfig = new Configuration({
  endpointUrl: `${pinningEndpoint}`, // the URI for your pinning provider, e.g. `http://localhost:3000`
  accessToken: `${pinningToken}` // the secret token/key given to you by your pinning provider
})
const cliArg = process.argv[2]
if (cliArg === undefined) {
  console.error('Please provide a string to pin')
  process.exitCode = 1
  process.exit()
}
const cid = await heliaFs.addBytes(new TextEncoder().encode(cliArg))
console.log('cid: ', cid)
const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig)
const remotePinner = createRemotePinner(helia, remotePinningClient, { retryOptions: { retries: 999 }, filterOrigins: (arr) => arr.map(isPublicAndDialable), filterDelegates: (arr) => arr.filter(isPublicAndDialable) })

await waitForDialableNode(helia)

try {
  const resultPinningStatus = await remotePinner.addPin({ cid })
  console.log('resultPinningStatus: ', resultPinningStatus)
  process.exitCode = 0
} catch (e) {
  console.error(e)
  process.exitCode = 1
}

process.exit()
