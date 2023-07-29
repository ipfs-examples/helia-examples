// @ts-check

import { car } from '@helia/car'
import { unixfs } from '@helia/unixfs'
import { CarWriter } from '@ipld/car/writer'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFiles } from '../hooks/useFiles'
import { useHelia } from '../hooks/useHelia'

/**
 *
 * @param {File} file
 * @returns {Promise<Uint8Array>}
 */
async function readFileAsUint8Array (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const arrayBuffer = reader.result
      if (arrayBuffer != null) {
        if (typeof arrayBuffer === 'string') {
          const uint8Array = new TextEncoder().encode(arrayBuffer)
          resolve(uint8Array)
        } else if (arrayBuffer instanceof ArrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer)
          resolve(uint8Array)
        }
        return
      }
      reject(new Error('arrayBuffer is null'))
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 *
 * @param {AsyncIterable<Uint8Array>} carReaderIterable
 * @returns {Promise<Blob>}
 */
async function carWriterOutToBlob (carReaderIterable) {
  const parts = []
  for await (const part of carReaderIterable) {
    parts.push(part)
  }
  return new Blob(parts, { type: 'application/car' })
}

export default function CarCreator () {
  const { files } = useFiles()
  const { helia } = useHelia()
  const [carBlob, setCarBlob] = useState(/** @type {null | Blob} */(null))
  const [rootCID, setRootCID] = useState(/** @type {null | import('multiformats').CID} */(null))
  const heliaCar = useMemo(() => {
    if (helia == null) {
      return null
    }
    return car(helia)
  }, [helia])
  const heliaFs = useMemo(() => {
    if (helia == null) {
      return null
    }
    return unixfs(helia)
  }, [helia])

  useEffect(() => {
    if (heliaFs == null || heliaCar == null) {
      return
    }
    const asyncFn = async () => {
      let rootCID = await heliaFs.addDirectory()
      for await (const file of files) {
        const fileCid = await heliaFs.addBytes(await readFileAsUint8Array(file))
        rootCID = await heliaFs.cp(fileCid, rootCID, file.name)
      }

      const { writer, out } = await CarWriter.create(rootCID)

      // don't await yet..
      const carBlob = carWriterOutToBlob(out)
      // await the heliaCar.export, where heliaCar will write blocks to the writer
      await heliaCar.export(rootCID, writer)
      // await the blob since `out` will have things yielded from the heliaCar.export above.
      setCarBlob(await carBlob)
      setRootCID(rootCID)
    }
    asyncFn()

    return () => {
      // this hook has been detached for some reason.. clear the state
      // highly likely that the files provided have changed and we should get rid of whatever CID and car blob we
      // may have had previously.
      setCarBlob(null)
      setRootCID(null)
    }
  }, [files, heliaFs, heliaCar])

  const downloadCarFile = useCallback(async () => {
    if (carBlob == null) {
      return
    }
    const downloadEl = document.createElement('a')
    const blobUrl = window.URL.createObjectURL(carBlob)
    downloadEl.href = blobUrl
    downloadEl.download = 'test.car'
    document.body.appendChild(downloadEl)
    downloadEl.click()
    window.URL.revokeObjectURL(blobUrl)
  }, [carBlob])

  if (rootCID == null || files.length === 0) {
    return null
  }

  return (
    <div style={{ borderRadius: '3px', padding: '1rem' }}>
      <div>
        <b>Car file CID: </b>
        <span id="carFileCID">{rootCID.toString()}</span>
      </div>
      <button id="downloadCarFile" onClick={downloadCarFile}>Download Car file</button>
    </div>
  )
}
