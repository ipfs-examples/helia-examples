import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HeliaProvider } from './provider/HeliaProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <HeliaProvider>
        <App />
      </HeliaProvider>
    </ChakraProvider>
  </React.StrictMode>
)
