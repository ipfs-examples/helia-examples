import { verifiedFetch } from '@helia/verified-fetch'
import { fileTypeFromBuffer } from '@sgtpooki/file-type'
import { useCallback, useState } from 'react'
import { Output } from './Output'
import { helpText } from './constants'

function App (): JSX.Element {
  const [path, setPath] = useState<string>('')
  const [output, setOutput] = useState<string | JSX.Element>('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoadingTo] = useState<string>('')
  const [controller, setController] = useState<AbortController | null>(null)

  const setSuccess = useCallback((message: string | JSX.Element) => {
    setOutput(message)
    setLoadingTo('')
    setErr('')
  }, [])
  const setError = useCallback((message: string) => {
    setOutput('')
    setLoadingTo('')
    setErr(message)
  }, [])
  const setLoading = useCallback((message: string) => {
    setErr('')
    setLoadingTo(message)
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

  const onFetchJson = useCallback(async (jsonType: 'json' | 'dag-json' = 'json') => {
    try {
      controller?.abort() // abort any ongoing requests
      setLoading(`Fetching ${jsonType} response...`)
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, {
        signal: ctl.signal,
        headers: {
          accept: jsonType === 'json' ? 'application/json' : 'application/vnd.ipld.dag-json'
        }
      })
      await handleJsonType(resp)
    } catch (err: any) {
      // TODO: simplify AbortErr handling to use err.name once https://github.com/libp2p/js-libp2p/pull/2446 is merged
      if (err?.code === 'ABORT_ERR') {
        return
      }
      if (err instanceof Error) {
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
    } catch (err: any) {
      if (err?.code === 'ABORT_ERR') {
        return
      }
      // Don't render AbortErrors since they are user intiated
      if (err instanceof Error) {
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
    } catch (err: any) {
      if (err?.code === 'ABORT_ERR') {
        return
      }
      // Don't render AbortErrors since they are user intiated
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }, [path])

  const onAbort = useCallback(async () => {
    if (controller != null) {
      controller.abort('Rqeuest aborted')
      setLoadingTo('')
    }
  }, [controller])

  const onPathChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value)
  }, [])

  const onFetchAuto = useCallback(async () => {
    if (path == null) {
      setError('Invalid path')
      return
    }
    try {
      controller?.abort() // abort any ongoing requests
      setLoading('Fetching with automatic content detection...')
      const ctl = new AbortController()
      setController(ctl)
      const resp = await verifiedFetch(path, { signal: ctl.signal })
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
    } catch (err: any) {
      if (err?.code === 'ABORT_ERR') {
        return
      }
      // Don't render AbortErrors since they are user intiated
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }, [path, handleImageType, handleJsonType, handleVideoType])

  return (
    <div className="">
      <section>
        <div className="grid h-screen grid-cols-2">
          {/* Left 👇 */}
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
              onChange={onPathChange}
              value={path}
            />
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-json"
              onClick={async () => onFetchJson('json')}
            >
              🔑 Fetch as JSON
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-fetch-dag-json"
              onClick={async () => onFetchJson('dag-json')}
            >
              🔑 Fetch as dag-json
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
            <a href="https://github.com/ipfs-examples/helia-examples/tree/main/examples/helia-browser-verified-fetch" className="text-2xl block mt-2 underline">Source for example</a>
            <a href="https://github.com/ipfs/helia-verified-fetch/tree/main/packages/verified-fetch" className="text-2xl block mt-2 underline"><code>@helia/verified-fetch</code> API Docs</a>

          </div>

          {/* Right 👇 */}
          <Output loading={loading} output={output} err={err} />
        </div>
      </section>
    </div>
  )
}

export default App
