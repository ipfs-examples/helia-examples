import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'

const App = async () => {
  const DOM = {
    output: () => document.getElementById('output'),
    fileName: () => document.getElementById('file-name'),
    fileContent: () => document.getElementById('file-content'),
    addBtn: () => document.getElementById('add-submit'),
    terminal: () => document.getElementById('terminal'),
    peers: () => document.getElementById('peers'),
    dialQueue: () => document.getElementById('dialQueue'),
    multiaddrs: () => document.getElementById('multiaddrs')
  }

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  const scrollToBottom = () => {
    const terminal = DOM.terminal()
    terminal.scroll({ top: terminal.scrollHeight, behavior: 'smooth' })
  }

  const showStatus = (text, bg, id = null) => {
    const log = DOM.output()

    const line = document.createElement('p')
    line.innerHTML = text
    line.style.color = bg

    if (id) {
      line.id = id
    }

    log.appendChild(line)

    scrollToBottom(log)
  }

  const cat = async (cid) => {
    const decoder = new TextDecoder()
    let content = ''

    for await (const chunk of fs.cat(cid)) {
      content += decoder.decode(chunk, {
        stream: true
      })
    }

    return content
  }

  const store = async (name, content) => {
    const id = helia.libp2p.peerId
    showStatus(`Helia node peer ID ${id}`, COLORS.active)

    const fileToAdd = {
      path: `${name}`,
      content: new TextEncoder().encode(content)
    }

    showStatus(`Adding file ${fileToAdd.path}`, COLORS.active)
    const cid = await fs.addFile(fileToAdd)

    showStatus(`Added ${cid}`, COLORS.success, cid)
    showStatus('Reading file', COLORS.active)

    const text = await cat(cid)

    showStatus(`\u2514\u2500 ${name} ${text.toString()}`)
    showStatus(`Preview: <a href="https://ipfs.io/ipfs/${cid}">https://ipfs.io/ipfs/${cid}</a>`, COLORS.success)
  }

  // Event listeners
  DOM.addBtn().onclick = async (e) => {
    e.preventDefault()
    let name = DOM.fileName().value
    let content = DOM.fileContent().value

    try {
      if (name == null || name.trim() === '') {
        showStatus('Set default name', COLORS.active)
        name = 'test.txt'
      }

      if ((content == null || content.trim() === '')) {
        showStatus('Set default content', COLORS.active)
        content = 'Hello world!'
      }

      await store(name, content)
    } catch (err) {
      showStatus(err.message, COLORS.error)
    }
  }

  showStatus('Creating Helia node', COLORS.active)

  const helia = await createHelia()

  showStatus('Helia node ready', COLORS.active)

  const fs = unixfs(helia)

  setInterval(() => {
    let peers = ''

    for (const connection of helia.libp2p.getConnections()) {
      peers += `${connection.remotePeer.toString()}\n`
    }

    if (peers === '') {
      peers = 'Not connected to any peers'
    }

    DOM.peers().innerText = peers

    let dialQueue = ''

    for (const dial of helia.libp2p.getDialQueue()) {
      dialQueue += `${dial.peerId} - ${dial.status}\n${dial.multiaddrs.map(ma => ma.toString()).join('\n')}\n`
    }

    if (dialQueue === '') {
      dialQueue = 'Dial queue empty'
    }

    DOM.dialQueue().innerText = dialQueue

    let multiaddrs = ''

    for (const ma of helia.libp2p.getMultiaddrs()) {
      multiaddrs += `${ma.toString()}\n`
    }

    if (multiaddrs === '') {
      multiaddrs = 'Not listening on any addresses'
    }

    DOM.multiaddrs().innerText = multiaddrs
  }, 500)
}

App().catch(err => {
  console.error(err) // eslint-disable-line no-console
})
