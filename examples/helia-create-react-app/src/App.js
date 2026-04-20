import { useState, useEffect } from 'react'
import useHeliaFactory from './hooks/use-helia-factory.js'
import useHelia from './hooks/use-helia.js'
import logo from './logo.svg'
import ipfsLogo from './ipfs-logo.svg'
import './App.css'

function App () {
  const { helia, heliaInitError } = useHeliaFactory({ commands: ['id'] })
  const id = useHelia(helia, 'libp2p.peerId')
  const [version, setVersion] = useState(null)

  useEffect(() => {
    if (!helia) return

    const getVersion = async () => {
      const nodeId = await helia.version()
      setVersion(nodeId)
    }

    getVersion()
  }, [helia])

  return (
    <div className='sans-serif'>
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <a href='https://ipfs.io' title='home'>
          <img alt='Helia logo' src={ipfsLogo} style={{ height: 50 }} className='v-top' />
        </a>
        <img src={logo} className="react-logo" alt="logo" style={{ height: 50 }} />

        <h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>Helia React</h1>
      </header>
      <main>
        {heliaInitError && (
          <div className='bg-red pa3 mw7 center mv3 white'>
            Error: {heliaInitError.message ?? heliaInitError}
          </div>
        )}
        {(id || version) &&
            <section className='bg-snow mw7 center mt5'>
            <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Connected to Helia</h1>
            <div className='pa4'>
              {id && <HeliaId obj={id} keys={['id', 'agentVersion']}/>}
              {version && <HeliaId obj={version} keys={['version']}/>}
            </div>
          </section>
        }
      </main>
      <footer className="react-header">
        <p>
          Edit <code>src/App.js</code> and save to reload
        </p>
        <a
          className="react-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </footer>
    </div>
  )
}

const Title = ({ children }) => {
  return (
    <h2 className='f5 ma0 pb2 aqua fw4 montserrat'>{children}</h2>
  )
}

const HeliaId = ({ keys, obj }) => {
  if (!obj || !keys || keys.length === 0) return null
  return (
    <>
      {keys?.map((key) => (
        <div className='mb4' key={key}>
          <Title>{key}</Title>
          <div className='bg-white pa2 br2 truncate monospace' data-test={key}>{obj[key].toString()}</div>
        </div>
      ))}
    </>
  )
}

export default App
