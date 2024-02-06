import { useCallback, useState } from 'react'
import { verifiedFetch } from '@helia/verified-fetch'
import { helpText } from './constants'

function App() {
  const [path, setPath] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [err, setErr] = useState<string>('')

  const onFetchJson = useCallback(async () => {
    if (!path) {
      setErr('Invalid path')
      return
    }
    const resp = await verifiedFetch(path)
    const json = await resp.json()

    setOutput(json)
  }, [path])

  const onFetchImage = useCallback(async () => {}, [path])
  const onFetchFile = useCallback(async () => {}, [path])

  return (
    <div className="">
      <section>
        <div className="grid h-screen grid-cols-2">
          {/* Left */}
          <div className="bg-teal-200 p-4">
            <h1 className="text-2xl">
              Verified Retrieval with <strong>@helia/verified-fetch</strong>
            </h1>
            <label className="block mt-4 mb-2 font-medium text-gray-900 dark:text-white">
              IPFS path to fetch
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ipfs://... or ipns://"
              onChange={(e) => setPath(e.target.value)}
              value={path}
            />
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-resolve-ipns"
              onClick={onFetchJson}
            >
              🔑 Fetch as JSON
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-resolve-ipns"
              onClick={onFetchImage}
            >
              🔑 Fetch as image
            </button>
            <button
              className="my-2 mr-2 btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              id="button-resolve-ipns"
              onClick={onFetchFile}
            >
              🔑 Fetch as file
            </button>

            <pre className="bg-black text-teal-300 rounded p-4">{helpText}</pre>
          </div>
          {/* Left */}

          {/* Right */}
          <div className="bg-violet-300">
            {output && (
              <pre className="bg-black text-teal-300 rounded p-4">
                <code id="output" className="language-json"></code>
              </pre>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
