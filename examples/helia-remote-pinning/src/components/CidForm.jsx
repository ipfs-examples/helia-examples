/* eslint-disable react/prop-types */
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Text
} from '@chakra-ui/react'
import { React } from 'react'
import { useCommitText } from '../hooks/useCommitText'

export default function CidForm ({ text, setText }) {
  const {
    cidString,
    commitText
  } = useCommitText()

  return (
    <>
      <FormControl>
        <FormLabel>Pinning Endpoint</FormLabel>
        <Input id="textInput" value={text} onChange={(event) => setText(event.target.value)} type="text" />
        <FormHelperText>Enter some text content to store in your Helia node</FormHelperText>
        <Button
          id="commitTextButton"
          onClick={() => commitText(text)}
        >Add Text To Node</Button>
      </FormControl>

      <Text id="cidOutput" colorScheme='green'>CID: {cidString}</Text>
      <br/>
    </>
  )
}
