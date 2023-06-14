import { createContext, useState } from 'react'

export const FileContext = createContext({
  files: /** @type {File[]} */([]),
  setFiles: /** @type {(files: File[]) => void} */() => {}
})
export default function FileProvider({ children }) {
  const [files, setFiles] = useState(/** @type {File[]} */([]))
  const providerValue = {
    files,
    setFiles,
  }
  return (
    <FileContext.Provider value={providerValue}>
      {children}
    </FileContext.Provider>
  )
}
