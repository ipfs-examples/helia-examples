import { useContext } from 'react'
import { CidContext } from '../provider/CidProvider'

export default function useCid () {
  return useContext(CidContext)
}
