import { React, useState } from 'react'
import './App.css'
import CidForm from './components/CidForm'
import PinningCredsForm from './components/PinningCredsForm'
import { useHelia } from './hooks/useHelia'

function App () {
  const [text, setText] = useState('')
  const { error, starting } = useHelia()

  return (
    <div className="App">
      <div
        id="heliaStatus"
        style={{
          border: `4px solid ${
            error
? 'red'
            : starting ? 'yellow' : 'green'
          }`,
          paddingBottom: '4px'
        }}
      >Helia Status</div>

      <CidForm text={text} setText={setText} />
      <PinningCredsForm />
    </div>
  )
}

export default App
