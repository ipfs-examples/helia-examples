import { useContext } from 'react'
import { FileContext } from '../provider/FileProvider'

export const useFiles = () => {
  const { files, setFiles } = useContext(FileContext)
  return { files, setFiles }
}
