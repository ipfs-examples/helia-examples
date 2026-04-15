import React from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './app.jsx'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App tab='home' />)
