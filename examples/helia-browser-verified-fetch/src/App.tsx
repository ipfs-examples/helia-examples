import { verifiedFetch } from '@helia/verified-fetch'
import { fileTypeFromBuffer } from 'file-type'
import { useCallback, useState } from 'react'
import { Output } from './Output'
import { helpText } from './constants'
import * as dagCbor from '@ipld/dag-cbor'
import * as dagJson from '@ipld/dag-json'
import * as json from 'multiformats/codecs/json'

function App (): React.JSX.Element {
  const [path, setPath] = useState<string>('')
  const [output, setOutput] = useState<string | React.JSX.Element>('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoadingTo] = useState<string>('')
  const [controller, setController] = useState<AbortController | null>(null)

  const setSuccess = useCallback((message: string | React.JSX.Element) => {
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

  const handleCborType = useCallback(async (resp: Response) => {
    try {
      setLoading('Waiting for full CBOR data...')
      const buf = await resp.arrayBuffer()
      const obj = dagCbor.decode(new Uint8Array(buf, 0, buf.byteLength))
      const plainObj = json.decode(dagJson.encode(obj))
      setSuccess(JSON.stringify(plainObj, null, 2))
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

  const onDownload = useCallback(async () => {
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
      // Don't render AbortErrors since they are user initiated
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

  const onFetch = useCallback(async () => {
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
      let contentType: string | undefined | null = resp.headers.get('content-type')

      if (contentType == null || contentType === 'application/octet-stream') {
        contentType = (await fileTypeFromBuffer(new Uint8Array(buffer)))?.mime
      }

      try {
        // see if we can parse as json
        await resp.clone().json()
        contentType = 'application/json'
      } catch (err) {
        // ignore
      }

      switch (true) {
        case contentType?.includes('cbor'):
          await handleCborType(resp)
          break
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
          onDownload()
      }
    } catch (err: any) {
      if (err?.code === 'ABORT_ERR') {
        return
      }
      // Don't render AbortErrors since they are user initiated
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }, [path])

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
              id="button-fetch"
              onClick={onFetch}
            >
              🔑 Fetch
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-download"
              onClick={onDownload}
            >
              🔑 Download
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-abort"
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
