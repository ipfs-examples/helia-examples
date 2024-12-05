import React, { useCallback } from 'react'
import { useFiles } from '@/hooks/useFiles'

/**
 * @returns {React.FunctionComponent}
 */
export default function FileUploader () {
  const { files, setFiles } = useFiles()
  const handleFileEvent = useCallback((e) => {
    const filesToUpload = Array.prototype.slice.call(e.target.files)

    setFiles(filesToUpload)
  }, [files])

  return (
    <>
      <label htmlFor='FileUploaderInput'>
        <a className='btn btn-primary' style={{ border: '1px solid gray', padding: '1vh 2vw', cursor: 'pointer', borderRadius: '3px' }}>
          Select Files
        </a>
      </label>
      <input style={{ display: 'none' }} id='FileUploaderInput' type='file' multiple onChange={handleFileEvent} />
      <div className="fileUploader-list" style={{ paddingTop: '1vh' }}>
        {files.map((file, idx) => (
          <div key={idx}>
            {file.name}
          </div>
        ))}
      </div>
    </>
  )
}
