import { createHelia } from 'helia'
import React, { useState, useEffect } from 'react'


const IpfsComponent: React.FC = () => {
  const [id, setId] = useState<string | null>(null)
  const [helia, setHelia] = useState<HeliaNode | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      if (helia) return

      const heliaNode = await createHelia()

      const nodeId = heliaNode.libp2p.peerId.toString()
      const nodeIsOnline = heliaNode.libp2p.status === 'started'

      setHelia(heliaNode)
      setId(nodeId)
      setIsOnline(nodeIsOnline)
    }

    init()
  }, [helia])

  if (!helia || !id) {
    return <h4>Starting Helia...</h4>
  }

  return (
    <div>
      <h4 data-test="id">ID: {id}</h4>
      <h4 data-test="status">Status: {isOnline ? 'Online' : 'Offline'}</h4>
    </div>
  )
}

export default IpfsComponent
