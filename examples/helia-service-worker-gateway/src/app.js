// @ts-check
import React, { useState, useRef } from 'react';
import ipfsLogo from './ipfs-logo.svg'
import { getHelia } from './get-helia.js'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'

function App() {
  const [output, setOutput] = useState([]);
  const [helia, setHelia] = useState(null);
  const [fileCid, setFileCid] = useState('');

  const terminalEl = useRef(null);

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  const showStatus = (text, color, id) => {
    setOutput((prev) => {
      return [...prev,
        {
        'content': text,
        'color': color,
        'id': id
        }
      ]
    })

    terminalEl.current.scroll({ top: terminal.scrollHeight, behavior: 'smooth' })
  }

  const getFile = async (fileCid) => {
    let node = helia;

    if (!helia) {
      showStatus('Creating Helia node...', COLORS.active)

      node = await getHelia()

      setHelia(node)
    }

    const peerId = node.libp2p.peerId
    console.log(peerId)
    showStatus(`My ID is ${peerId}`, COLORS.active, peerId)

    const fs = unixfs(node)
    const cid = CID.parse(fileCid)

    showStatus(`Reading UnixFS text file ${cid}...`, COLORS.active)
    const decoder = new TextDecoder()
    let text = ''

    for await (const chunk of fs.cat(cid)) {
      text += decoder.decode(chunk, {
        stream: true
      })
    }

    showStatus(`\u2514\u2500 CID: ${cid}`)
    showStatus(`Preview: https://ipfs.io/ipfs/${cid}`, COLORS.success)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (fileCid == null || fileCid.trim() === '') {
        throw new Error('File CID is missing...')
      }

      await getFile(fileCid)
    } catch (err) {
      showStatus(err.message, COLORS.error)
    }
  }

  return (
    <>
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <a href='https://ipfs.io' title='home'>
          <img alt='IPFS logo' src={ipfsLogo} style={{ height: 50 }} className='v-top' />
        </a>
      </header>

      <main className="pa4-l bg-snow mw7 mv5 center pa4">
        <h1 className="pa0 f2 ma0 mb4 aqua tc">Add data to Helia from the browser</h1>

        <form id="add-file" onSubmit={handleSubmit}>
          <label htmlFor="file-name" className="f5 ma0 pb2 aqua fw4 db">Name</label>
          <input
            className="input-reset bn black-80 bg-white pa3 w-100 mb3"
            id="file-name"
            name="file-name"
            type="text"
            placeholder="file.txt"
            required
            value={fileCid} onChange={(e) => setFileCid(e.target.value)}
          />

          <button
            className="button-reset pv3 tc bn bg-animate bg-black-80 hover-bg-aqua white pointer w-100"
            id="add-submit"
            type="submit"
          >
            Fetch
          </button>
        </form>

        <h3>Output</h3>

        <div className="window">
          <div className="header"></div>
          <div id="terminal" className="terminal" ref={terminalEl}>
            { output.length > 0 &&
              <div id="output">
                { output.map((log, index) =>
                  <p key={index} style={{'color': log.color}} id={log.id}>
                    {log.content}
                  </p>)
                }
              </div>
            }
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
