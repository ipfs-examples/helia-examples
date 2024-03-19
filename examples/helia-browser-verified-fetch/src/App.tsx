import { verifiedFetch } from '@helia/verified-fetch'
import { fileTypeFromBuffer } from '@sgtpooki/file-type'
import { useCallback, useState } from 'react'
import { helpText } from './constants'

function renderOutput(output: string | JSX.Element, err: string): JSX.Element {
  if (err.length > 0) {
    return (
      <div className="bg-red-300">
        <pre className="bg-black text-red-300 rounded p-4 whitespace-pre-wrap break-words">{err}</pre>
      </div>
    )
  }

  if (typeof output === 'string') {
    return (
      <div className="bg-violet-300">
        {output.length > 0 && (
          <pre className="bg-black text-teal-300 rounded p-4 whitespace-pre-wrap break-words">
            <code id="output" className="language-json">{`${output}`}</code>
          </pre>
        )}
      </div>
    )
  }

  return output
}

function loadingIndicator(message: string): JSX.Element {
  return (
    <div className="bg-yellow-300">
      <pre className="bg-black text-yellow-300 rounded p-4">Loading... {message}</pre>
    </div>
  )
}

function App(): JSX.Element {
  const [path, setPath] = useState<string>('')
  const [output, setOutput] = useState<string | JSX.Element>('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoadingTo] = useState<JSX.Element | null>(null)
  const [controller, setController] = useState<AbortController | null>(null)

  const setSuccess = useCallback((message: string | JSX.Element) => {
    setOutput(message)
    setLoadingTo(null)
    setErr('')
  }, [])
  const setError = useCallback((message: string) => {
    setOutput('')
    setLoadingTo(null)
    setErr(message)
  }, [])
  const setLoading = useCallback((message: string) => {
    setErr('')
    setLoadingTo(loadingIndicator(message))
  }, [])

  const handleImageType = useCallback(async (resp: Response) => {
    try {
      setLoading('Waiting for full image data...')
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      setSuccess(<img src={url} alt="fetched image content" />)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  const handleJsonType = useCallback(async (resp: Response) => {
    try {
      setLoading('Waiting for full JSON data...')
      const json = await resp.json()
      setSuccess(JSON.stringify(json, null, 2))
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  const handleVideoType = useCallback(async (resp: Response) => {
    try {
      controller?.abort() // abort any ongoing requests
      setLoading('Waiting for full video data...')
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      setSuccess(<video controls src={url} />)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  const onFetchJson = useCallback(async () => {
    try {
      if(controller) {
        console.log('aborting', controller)
        controller.abort() // abort any ongoing requests
      }

      setLoading('Fetching json response...')
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, { signal: ctl.signal })
      await handleJsonType(resp)
    } catch (err) {
      // Don't render AbortErrors since they are user intiated
      if(err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    }
  }, [path, handleJsonType])

  const onFetchImage = useCallback(async () => {
    try {
      controller?.abort() // abort any ongoing requests
      setLoading('Fetching image response...')
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, { signal: ctl.signal })
      await handleImageType(resp)
    } catch (err) {
      // Don't render AbortErrors since they are user intiated
      if(err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    }
  }, [path, handleImageType])

  const onFetchFile = useCallback(async () => {
    try {
      controller?.abort() // abort any ongoing requests
      setLoading('Fetching content to download...')
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, { signal: ctl.signal })
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = 'download'
      setSuccess('') // clear output
      downloadLink.click()
    } catch (err) {
      // Don't render AbortErrors since they are user intiated
      if(err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    }
  }, [path])

  const onAbort = useCallback(async () => {
    if(controller != null) {
      controller.abort('Rqeuest aborted')
      setLoadingTo(null)
    }
  }, [controller])

  const onFetchAuto = useCallback(async () => {
    if (path == null) {
      setError('Invalid path')
      return
    }
    try {
      controller?.abort() // abort any ongoing requests
      setLoading('Fetching auto content...')
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, { signal: ctl.signal })
      console.log('onFetchAuto: got resp ', resp)
      const buffer = await resp.clone().arrayBuffer()
      let contentType = (await fileTypeFromBuffer(new Uint8Array(buffer)))?.mime
      if (!contentType) {
        try {
          // see if we can parse as json
          await resp.clone().json()
          contentType = 'application/json'
        } catch (err) {
          // ignore
        }
      }
      switch (true) {
        case contentType?.includes('image'):
          await handleImageType(resp)
          break
        case contentType?.includes('json'):
          await handleJsonType(resp)
          break
        case contentType?.includes('video'):
          await handleVideoType(resp)
          break
        default:
          setError(`Unknown content-type: ${contentType}`)
      }
    } catch (err) {
      // Don't render AbortErrors since they are user intiated
      if(err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    }
  }, [path, handleImageType, handleJsonType, handleVideoType])

  return (
    <div className="">
      <section>
        <div className="grid h-screen grid-cols-2">
          {/* Left */}
          <div className="bg-teal-200 p-4">
            <div className="flex items-center space-x-4">
              <a className="" href="https://github.com/ipfs/helia">
                <img
                  className="h-20"
                  alt="Helia logo"
                  src="https://unpkg.com/@helia/css@1.0.1/logos/helia-logo.svg"
                />
              </a>
              <h1 className="text-2xl">
                Verified Retrieval with <a href="https://github.com/ipfs/helia-verified-fetch/tree/main/packages/verified-fetch"><strong className='underline'>@helia/verified-fetch</strong></a>
              </h1>
            </div>
            <label className="block mt-4 mb-2 font-medium text-gray-900">
              IPFS path to fetch
            </label>
            <input
              type="text"
              id="ipfs-path"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ipfs://... or ipns://"
              onChange={(e) => {
                setPath(e.target.value)
              }}
              value={path}
            />
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-json"
              onClick={onFetchJson}
            >
              🔑 Fetch as JSON
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-image"
              onClick={onFetchImage}
            >
              🔑 Fetch as image
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-file"
              onClick={onFetchFile}
            >
              🔑 Fetch & Download
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-auto"
              onClick={onFetchAuto}
            >
              🔑 Fetch auto
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-auto"
              onClick={onAbort}
            >
              ❌ Abort request
            </button>

            <pre className="bg-black text-teal-300 rounded p-4 whitespace-pre-wrap break-words">{helpText}</pre>
          </div>
          {/* Left */}

          {/* Right */}
          {renderOutput(loading ?? output, err)}
        </div>
      </section>
    </div>
  )
}

export default App
