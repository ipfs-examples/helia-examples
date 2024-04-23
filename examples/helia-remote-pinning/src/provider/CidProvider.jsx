import PropTypes from 'prop-types'
import {
  React,
  useState,
  createContext
} from 'react'
export const CidContext = createContext({ cid: null })

export const CidProvider = ({ children }) => {
  const [cid, setCid] = useState(null)
  return (
    <CidContext.Provider value={{ cid, setCid }} >{children}</CidContext.Provider>
  )
}

CidProvider.propTypes = {
  children: PropTypes.any
}
