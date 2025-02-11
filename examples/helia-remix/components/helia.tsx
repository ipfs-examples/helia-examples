import React, { useState, useEffect } from 'react'
import { createHelia } from 'helia'

export const initHelia = async () => {

  const heliaNode = await createHelia()

  const nodeId = heliaNode.libp2p.peerId.toString()
  const nodeIsOnline = heliaNode.libp2p.status === 'started'

  return { heliaNode, nodeId, nodeIsOnline }
}

const HeliaComponent: React.FC = () => {
  const [id, setId] = useState<string | null>(null)
  //@ts-expect-error : Type 'null' is not assignable to type 'HeliaNode'.
  const [helia, setHelia] = useState<HeliaNode | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(false)

  useEffect(() => {
    if (helia != null) return

    const initHeliaNode = async () => {
      const { heliaNode, nodeId, nodeIsOnline } = await initHelia()
      setId(nodeId);
      setHelia(heliaNode);
      setIsOnline(nodeIsOnline);
    }

    initHeliaNode()
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

export default HeliaComponent
