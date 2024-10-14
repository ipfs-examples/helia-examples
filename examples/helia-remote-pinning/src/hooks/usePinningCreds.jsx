import { useState } from 'react'

export default function usePinningCreds () {
  const [pinningEndpoint, setPinningEndpoint] = useState(import.meta.env.VITE_PINNING_ENDPOINT)
  const [pinningToken, setPinningToken] = useState(import.meta.env.VITE_PINNING_TOKEN)

  return {
    pinningEndpoint,
    pinningToken,
    setPinningEndpoint,
    setPinningToken
  }
}
