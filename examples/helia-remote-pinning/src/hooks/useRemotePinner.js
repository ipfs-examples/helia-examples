import { createRemotePinner } from '@helia/remote-pinning'
import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client'

export default function useRemotePinner (helia, pinningEndpoint, pinningToken) {
  if (!helia || !pinningEndpoint || !pinningToken) {
    return { remotePinner: null, remotePinningClient: null }
  }

  try {
    const pinServiceConfig = new Configuration({
      endpointUrl: `${pinningEndpoint}`, // the URI for your pinning provider, e.g. `http://localhost:3000`
      accessToken: `${pinningToken}` // the secret token/key given to you by your pinning provider
    })

    const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig)
    const remotePinner = createRemotePinner(helia, remotePinningClient, { retryOptions: { retries: 5 } })

    return { remotePinner, remotePinningClient }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return { remotePinner: null, remotePinningClient: null }
  }
}
