/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { LevelBlockstore } from 'blockstore-level'
import { LevelDatastore } from 'datastore-level'
import { createHelia } from 'helia'
import PropTypes from 'prop-types'
import {
  React,
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'

export const HeliaContext = createContext({
  helia: null,
  fs: null,
  error: false,
  starting: true
})

export const HeliaProvider = ({ children }) => {
  const [helia, setHelia] = useState(null)
  const [fs, setFs] = useState(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState(null)

  const datastore = new LevelDatastore('helia-remote-pinner-datastore')
  const blockstore = new LevelBlockstore('helia-remote-pinner-blockstore')

  const startHelia = useCallback(async () => {
    if (helia) {
      console.info('helia already started')
    } else {
      try {
        console.info('Starting Helia')
        const helia = await createHelia({ datastore, blockstore })
        setHelia(helia)
        setFs(unixfs(helia))
        setStarting(false)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    startHelia()
  }, [])

  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        error,
        starting
      }}
    >{children}</HeliaContext.Provider>
  )
}

HeliaProvider.propTypes = {
  children: PropTypes.any
}
