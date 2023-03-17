import { useState, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useHelia } from '@/hooks/useHelia'
import { useCommitText } from '@/hooks/useCommitText'

function App() {
  const { error, starting } = useHelia()
  const {
    cidString,
    commitText,
    fetchCommitedText,
    commitedText,
  } = useCommitText()
  const [text, setText] = useState("")
  return (
    <div className="App">
      <div
        style={{
          border: `4px solid ${
            error ? 'red':
            starting ? 'yellow' : 'green'
          }`,
          paddingBottom: '4px'
        }}
      >Helia Status</div> 
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        type="text" />
      <button
        onClick={() => commitText(text)}
      >Add Text To Node</button>
      <div>textCid: {cidString}</div>
      { cidString && (<>
        <button
          onClick={() => fetchCommitedText()}
        >Fetch Commited Text</button>
          <div>Commited Text: {commitedText}</div>
        </>) 
      }

    </div>
  )
}

export default App
