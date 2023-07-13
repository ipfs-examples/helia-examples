import { React } from 'react'
import './App.css'
import CarCreator from '@/components/CarCreator'
import FileUploader from '@/components/FileUploader'
import { useHelia } from '@/hooks/useHelia'
import FileProvider from '@/provider/FileProvider'

function App () {
  const { error, starting } = useHelia()

  let statusColor = 'green'
  if (error) {
    statusColor = 'red'
  } else if (starting) {
    statusColor = 'yellow'
  }

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
