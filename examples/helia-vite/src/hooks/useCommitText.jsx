/* eslint-disable no-console */

import { useState, useCallback } from 'react'
import { useHelia } from '@/hooks/useHelia'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useCommitText = () => {
  const { helia, fs, error, starting } = useHelia()
  const [cid, setCid] = useState(null)
  const [cidString, setCidString] = useState('')
  const [committedText, setCommittedText] = useState('')

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
  }, [error, starting, helia, fs])

  const fetchCommittedText = useCallback(async () => {
    let text = ''
    if (!error && !starting) {
      try {
        for await (const chunk of fs.cat(cid)) {
          text += decoder.decode(chunk, {
            stream: true
          })
        }
        setCommittedText(text)
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, cid, helia, fs])
  // If one forgets to add helia in the dependency array in commitText, additions to the blockstore will not be picked up by react, leading to operations on fs to hang indefinitely in the generator <suspend> state. As such it would be good practice to ensure to include helia inside the dependency array of all hooks to tell react that the useCallback needs the most up to date helia state

  return { cidString, committedText, commitText, fetchCommittedText }
}
