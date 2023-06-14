import { React, useState } from 'react'
import './App.css'
import { useHelia } from '@/hooks/useHelia'
import FileUploader from '@/components/FileUploader'
import FileProvider from '@/provider/FileProvider'
import CarCreator from '@/components/CarCreator'

function App () {
  const [text, setText] = useState('')
  const { error, starting } = useHelia()

  const statusColor = error ? 'red' : starting ? 'yellow' : 'green'

  return (
    <div className="App">
      <div
        id="heliaStatus"
        style={{
          border: `4px solid ${statusColor}`,
          paddingBottom: '4px',
          width: '100%'
        }}
      >Helia Status</div>
      <br/>
      <FileProvider>
        <FileUploader />
        <CarCreator />
      </FileProvider>
    </div>
  )
}

export default App
