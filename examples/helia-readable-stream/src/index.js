import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'

const main = async () => {
  let helia;
  let fs;

  const DOM = {
    output: document.getElementById('output'),
    examples: document.getElementById('examples'),
    content: document.getElementById('content'),
    preview: document.getElementById('preview'),
    fileDirectory: document.getElementById('file-directory'),
    fileName: document.getElementById('file-name'),
    fileContent: document.getElementById('file-content'),
    addBtn: document.getElementById('add-submit'),
  }

  const COLORS = {
    active: '#357edd',
    success: '#0cb892',
    error: '#ea5037'
  }

  // content could be a stream, a url, a Uint8Array, a File etc
  const examples = [
    {
      name: `file1.txt`,
      content: 'Hello world! :)'
    },
    {
      name: `file2.svg`,
      content: `<svg width="400" height="180">
                  <rect x="50" y="20" rx="20" ry="20" width="150" height="150" style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
                  Sorry, your browser does not support inline SVG.
                </svg>`
    },
    {
      name: `file3.json`,
      content: `{
        text: 'IPFS is awesome'
      }`
    }
  ];

  const scrollToBottom = () => {
    const terminal = document.getElementById('terminal')

    terminal.scroll({ top: terminal.scrollHeight, behavior: 'smooth' })
  }

  const showStatus = (text, bg) => {
    console.info(text)

    const log = DOM.output

    if (!log) {
      return
    }

    const line = document.createElement('p')
    line.innerText = text
    line.style.color = bg

    log.appendChild(line)

    scrollToBottom(log)
  }

  const addFileDOM = (name, content, DOM, codeAsText = false) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = name;

    details.appendChild(summary);

    const code = document.createElement("div")

    if (codeAsText) {
      code.textContent = content
    } else {
      code.innerHTML = content;
    }

    details.appendChild(code);

    DOM.appendChild(details);
  }

  const createFiles = (directory, files) => {
    return files.map(file => {
      return {
        path: `${directory}/${file.name}`,
        content: file.content
      }
    })
  }

  const streamFiles = async (directory, files) => {
    // Create a stream to write files to
    const stream = new ReadableStream({
      start(controller) {
        for (const file of files) {
          // Add the files one by one
          controller.enqueue(file)
        }

        // When we have no more files to add, close the stream
        controller.close()
      }
    })

    for await (const data of fs.addAll(stream)) {
      // The last data event will contain the directory hash
      if (data.path === directory) {
        return data.cid
      }
    }

    throw new Error('Could not find directory in `ipfs.addAll` output')

    return cid
  }

  const addFile = async (name, content, directory) => {
    if (!helia) {
      showStatus(`Creating Helia node...`, COLORS.active)

      const repoPath = `helia-${Math.random()}`
      helia = await createHelia({ repo: repoPath })
      fs = unixfs(helia)
    }

    const id = helia.libp2p.peerId
    showStatus(`Connecting to ${id}...`, COLORS.active)

    const filesToAdd = [...examples];
    console.log(filesToAdd)
    if (name != null && content != null) {
      filesToAdd.push({path: name, content: content})
    }

    const files = createFiles(directory, filesToAdd)
    console.log(files)
    showStatus(`Streaming file(s)...`, COLORS.active)
    const directoryHash = await streamFiles(directory, files)

    showStatus(`Added to ${directoryHash}`, COLORS.active)

    showStatus(`Listing directory ${directoryHash}...`, COLORS.active)
    const fileList = await fs.ls(directoryHash);

    showStatus(`Directory contents:`)
    showStatus(`${directory}/ ${directoryHash}`)

    if (!DOM.content) {
      const dom = document.createElement("div");
      dom.id = "content"
      DOM.preview.appendChild(dom)

      DOM.content = dom
    }

    DOM.content.innerHTML = '';

    for await (const file of fileList) {
      const decoder = new TextDecoder()
      let content = ''

      for await (const chunk of helia.cat(file.cid)) {
        content += decoder.decode(chunk, {
          stream: true
        })
      }

      showStatus(`\u2514\u2500 ${file.name} ${file.path} ${content}`)
      showStatus(`Preview: https://ipfs.io/ipfs/${file.path}`, COLORS.success)
      addFileDOM(file.name, content, DOM.content, false)
    }

    showStatus(`Done!`, COLORS.success)

    DOM.preview.className = ''
  }

  // Log examples
  for (const example of examples) {
    addFileDOM(example.name, example.content, DOM.examples, true);
  }

  // Event listeners
  DOM.addBtn.onclick = async (e) => {
    e.preventDefault()
    const directory = DOM.fileDirectory.value
    const name = DOM.fileName.value
    const content = DOM.fileContent.value

    try {
      if ((name == null || name === '') && content.trim().length > 0) {
        showStatus(`Is missing either the 'Name'`, COLORS.error)
        return
      }

      if ((content == null || content === '') && name.trim().length > 0) {
        showStatus(`Is missing either the 'Name'`, COLORS.error)
        return
      }

      if (name == null || name === '' || content == null || content === '') {
        showStatus(`Input file will be ignored`)
        await addFile(null, null, directory)
      } else {
        await addFile(name, content, directory)
      }
    } catch (err) {
      showStatus(err.message, COLORS.error)
      console.error(err)
    }
  }
}

main()