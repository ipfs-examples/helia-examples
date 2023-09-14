import { useInterval } from '@chakra-ui/react'
import React, { useState } from 'react'
import './App.css'
import CidForm from './components/CidForm'
import PinningCredsForm from './components/PinningCredsForm'
import PinningSubmitForm from './components/PinningSubmitForm'
import { useHelia } from './hooks/useHelia'
import { CidProvider } from './provider/CidProvider'

function App () {
  const [text, setText] = useState('')
  const { error, starting, helia } = useHelia()
  const [heliaMultiaddrs, setHeliaMultiaddrs] = useState([])
  const [peers, setPeers] = useState([])

  useInterval(() => {
    setPeers(helia?.libp2p.getPeers() ?? [])
    setHeliaMultiaddrs(helia?.libp2p.getMultiaddrs() ?? [])
  }, 2000, [helia])

  return (
    <div className="App">
      <div
        id="heliaStatus"
        style={{
          border: `4px solid ${error ? 'red' : starting ? 'yellow' : 'green'}`,
          paddingBottom: '4px'
        }}
      >Helia Status (peers={peers.length}, multiaddrs={heliaMultiaddrs.length})</div>
      <CidProvider>
        <CidForm text={text} setText={setText} />
        <PinningCredsForm />
        <PinningSubmitForm />
      </CidProvider>
    </div>
  )
}

export default App
