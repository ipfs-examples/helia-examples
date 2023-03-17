import { useState, useEffect, useCallback, useContext } from 'react'

import { useHelia } from '@/hooks/useHelia'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useCommitText = () => {
  const {helia, fs, error, starting } = useHelia()
  const [cidString, setCidString] = useState("")
  const [cid, setCid] = useState(null)
  const [commitedText, setCommitedText] = useState("")

  const commitText = useCallback(async (text) => {
    if (!error && !starting) {
      try {
        console.log('text', text)
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
    console.log('hi')
    let text = ''
    if (!error && !starting) {
    console.log('hi2')
      try {
        console.log('hi2.5')
        console.log(cid)
        for await (const chunk of fs.cat(cid)) {
          console.log('hmmm')
          text += decoder.decode(chunk, {
            stream: true
          })
          console.log('hi3')
        }
          console.log('hi4')
        console.log(text)
        setCommitedText(text)
      } catch (e) {
        console.log('hmmm')
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, cid, helia])

  return { cidString, commitedText, commitText, fetchCommitedText }
}
