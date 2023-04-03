import { inject } from 'vue'


const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useUnixFS = () => {
    const { loading, error, helia, fs } = inject("HeliaProvider")

    const getStat = async (dirCid, path) => {
        if (error.value.length == 0 && !loading.value) {
            try {
                const res = await fs.value.stat(dirCid, {
                    path: path
                })
                const data = { cid: res.cid, blocks: res.blocks }
                return { status: 'success', data: data }
            } catch (e) {
                console.error(e)
            }
        }
    }

    const addDirectory = async (path) => {
        if (error.value.length == 0 && !loading.value) {
            try {
               const emptyDirCid =  await fs.value.addDirectory(path)
               const res = await fs.value.mkdir(emptyDirCid, path)
               return {status: 'success', data: res}
            } catch (e) {
                console.error(e)
            }
        }
    }


    const getDirectory = async (dirCid, path) => {
        let output = []
        if (error.value.length == 0 && !loading.value) {
            try {
                if (typeof path !== 'undefined') {
                    for await (const entry of fs.value.ls(dirCid, {
                        path: path
                    })) {
                        output.push(entry)
                    }
                } else {
                    for await (const entry of fs.value.ls(dirCid)) {
                        output.push(entry)
                    }
                }
               return {status: 'success', data: output}
            } catch (e) {
                console.error(e)
            }
        }
    }

    const addFile = async (name, dirCid, content) => {
        if (error.value.length == 0 && !loading.value) {
            try {
                
                const res = await fs.value.addFile({
                    content: encoder.encode(content)
                })
                const updatedCid = await fs.value.cp(res, dirCid, name )
                return {status: 'success', data:{dirCid: updatedCid, fileCid: res} }
            } catch (e) {
                console.error(e)
            }
        }
    }

    const getFile = async (cid) => {
        if (error.value.length == 0 && !loading.value) {
            let txt = ''
            try {
                for await (const buf of fs.value.cat(cid)) {
                    txt += decoder.decode(buf, {
                        stream: true
                    })
                }
                return {status: 'success', data: txt}
            } catch (e) {
                console.error(e)
            }
        }
    }
    return {
        getStat,
        addDirectory, getDirectory,
        addFile, getFile
    }
}