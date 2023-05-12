/* eslint-disable no-console */

import { inject, ref } from 'vue'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useCommitText = () => {
  const cid = ref()
  const commitedText = ref()
  const { loading, error, helia, fs } = inject('HeliaProvider')

  const commitText = async (text) => {
    console.log('text', text)
    if (error.value.length === 0 && !loading.value) {
      try {
        const res = await fs.value.addBytes(
          encoder.encode(text),
          helia.value.blockstore
        )
        cid.value = res
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }

  const fetchCommitedText = async () => {
    let text = ''
    console.log(cid)
    if (error.value.length === 0 && !loading.value && cid.value) {
      try {
        for await (const chunk of fs.value.cat(cid.value)) {
          text += decoder.decode(chunk, {
            stream: true
          })
        }
        commitedText.value = text
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }

  return { cid, commitText, commitedText, fetchCommitedText }
}
