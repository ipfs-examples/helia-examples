import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, useInterval, Text, Link } from '@chakra-ui/react'
import React, { useCallback, useState, useMemo } from 'react'
import { isPublicAndDialable } from '../helpers/isPublicAndDialable'
import { waitForDialableNode } from '../helpers/waitForDialableNode'
import useCid from '../hooks/useCid'
import { useHelia } from '../hooks/useHelia'
import usePinningCreds from '../hooks/usePinningCreds'
import useRemotePinner from '../hooks/useRemotePinner'

export default function PinningSubmitForm () {
  const { helia } = useHelia()
  const { pinningEndpoint, pinningToken } = usePinningCreds()
  const { remotePinner } = useRemotePinner(helia, pinningEndpoint, pinningToken)
  const { cid } = useCid()
  const [origins, setOrigins] = useState([])
  const [pinResult, setPinResult] = useState(null)
  const [pinInProgress, setPinInProgress] = useState(false)

  useInterval(async () => {
    if (helia == null) return
    setOrigins(helia.libp2p.getMultiaddrs())
  }, 2000, [helia])

  const pinLink = useMemo(() => {
    if (pinResult == null) return null
    if (pinResult.status !== 'pinned') return null
    return `https://ipfs.io/ipfs/${pinResult.pin.cid}`
  }, [pinResult])

  const pinContent = useCallback(async () => {
    if (remotePinner == null) return
    if (cid == null) return
    if (origins.length < 1) return

    await waitForDialableNode(helia)
    try {
      setPinInProgress(true)
      const pinStatus = await remotePinner.addPin({ cid, filterOrigins: (arr) => arr.map(isPublicAndDialable), filterDelegates: (arr) => arr.filter(isPublicAndDialable) })
      setPinResult(pinStatus)
      // eslint-disable-next-line no-console
      console.log('pinStatus: ', pinStatus)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }, [remotePinner, cid, origins])

  return (
    <>
      <Button onClick={pinContent}>Pin the CID</Button>
      {pinInProgress && <Text>{pinResult?.status ?? 'Waiting for pinning provider...'}</Text>}
      {pinLink && <Link href={pinLink} isExternal>
        Visit your content on the ipfs.io gateway <ExternalLinkIcon mx='2px' />
      </Link>}
    </>
  )
}
