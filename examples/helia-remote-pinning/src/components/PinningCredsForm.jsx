import {
  FormControl,
  FormLabel,
  // FormErrorMessage,
  FormHelperText,
  Input
} from '@chakra-ui/react'
import React from 'react'
import usePinningCreds from '../hooks/usePinningCreds'

export default function PinningCredsForm () {
  const { pinningEndpoint, pinningToken, setPinningEndpoint, setPinningToken } = usePinningCreds()

  return (
    <article className="pa4">
      <span>{pinningEndpoint}</span>
      <span>{pinningToken}</span>
      <FormControl>
        <FormLabel>Pinning Endpoint</FormLabel>
        <Input type='text' onChange={(e) => setPinningEndpoint(e)} />
        <FormHelperText>Enter the endpoint for your Pinning Service Provider.</FormHelperText>
      </FormControl>

      <FormControl pt="5">
        <FormLabel>Pinning Token</FormLabel>
        <Input type='password' onChange={(e) => setPinningToken(e)} />
        <FormHelperText>Enter the token you received from your Pinning Service Provider.</FormHelperText>
      </FormControl>
    </article>
  )
}
