import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HeliaProvider } from '@/provider/HeliaProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeliaProvider>
      <App />
    </HeliaProvider>
  </React.StrictMode>
)
