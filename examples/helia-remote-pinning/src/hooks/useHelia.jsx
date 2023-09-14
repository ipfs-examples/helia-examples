import { useContext } from 'react'
import { HeliaContext } from '../provider/HeliaProvider'

export const useHelia = () => {
  const { helia, fs, error, starting } = useContext(HeliaContext)
  window.helia = helia
  return { helia, fs, error, starting }
}
