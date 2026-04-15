import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'

export const FileContext = createContext({
  files: /** @type {File[]} */([]),
  setFiles: /** @type {(files: File[]) => void} */() => {}
})

/**
 * @param {object} param0
 * @param {React.ReactNode} param0.children
 * @returns
 */
export default function FileProvider ({ children }) {
  const [files, setFiles] = useState(/** @type {File[]} */([]))
  const providerValue = {
    files,
    setFiles
  }
  return (
    <FileContext.Provider value={providerValue}>
      {children}
    </FileContext.Provider>
  )
}

FileProvider.propTypes = {
  children: PropTypes.node.isRequired
}
