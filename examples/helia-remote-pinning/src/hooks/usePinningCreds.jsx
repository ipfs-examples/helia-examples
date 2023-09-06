import { useState } from 'react'

export default function usePinningCreds () {
  const [pinningEndpoint, setPinningEndpoint] = useState('')
  const [pinningToken, setPinningToken] = useState('')

  return {
    pinningEndpoint,
    pinningToken,
    setPinningEndpoint,
    setPinningToken
  }
}
