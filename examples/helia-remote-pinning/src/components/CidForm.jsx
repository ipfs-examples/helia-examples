/* eslint-disable react/prop-types */
import { React, useState } from 'react'
import { useCommitText } from '../hooks/useCommitText'

export default function CidForm ({ text, setText }) {
  const {
    cidString,
    commitText,
    fetchCommittedText,
    committedText
  } = useCommitText()

  return (
    <>
      <input
        id="textInput"
        value={text}
        onChange={(event) => setText(event.target.value)}
        type="text" />
      <button
        id="commitTextButton"
        onClick={() => commitText(text)}
      >Add Text To Node</button>
      <div
        id="cidOutput"
      >textCid: {cidString}</div>
      { cidString && (<>
        <button
          id="fetchCommittedTextButton"
          onClick={() => fetchCommittedText()}
        >Fetch Committed Text</button>
          <div
            id="committedTextOutput"
          >Committed Text: {committedText}</div>
        </>)
      }
    </>
  )
}
