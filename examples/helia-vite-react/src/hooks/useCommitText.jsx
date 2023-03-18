import { useState, useEffect, useCallback, useContext } from 'react'

import { useHelia } from '@/hooks/useHelia'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useCommitText = () => {
  const {helia, fs, error, starting } = useHelia()
  const [cid, setCid] = useState(null)
  const [cidString, setCidString] = useState("")
  const [commitedText, setCommitedText] = useState("")

  const commitText = useCallback(async (text) => {
    if (!error && !starting) {
      try {
        const cid = await fs.addBytes(
          encoder.encode(text),
          helia.blockstore
        )
        setCid(cid)
        setCidString(cid.toString())
        console.log('Added file:', cid.toString())
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia])

  const fetchCommitedText = useCallback(async () => {
    let text = ''
    if (!error && !starting) {
      try {
        for await (const chunk of fs.cat(cid)) {
          text += decoder.decode(chunk, {
            stream: true
          })
        }
        setCommitedText(text)
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, cid, helia]) // make sure to add helia in the dependencies array of the fs will suspend

  return { cidString, commitedText, commitText, fetchCommitedText }
}
