import { inject, ref, reactive } from 'vue'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useUnixFS = () => {
    const { loading, error, helia, fs } = inject("HeliaProvider")
    const dirCid = ref()
    const stat = ref()
    const lsOutput = reactive([])

    const getStat = async () => {
        if (error.value.length == 0 && !loading.value) {
            try {
               const res =  await fs.value.stat(dirCid.value)
               console.log('stat::res', res)
               stat.value = {cid: res.cid, blocks: res.blocks}
               return {status: 'success', res: res}
            } catch (e) {
                console.error(e)
            }
        }

    }
    const makeDirectory = async (path) => {
        if (error.value.length == 0 && !loading.value) {
            try {
               const emptyDirCid =  await fs.value.addDirectory()
               const res = await fs.value.mkdir(emptyDirCid, path)
               dirCid.value = res
               return {status: 'success', res: res}
            } catch (e) {
                console.error(e)
            }
        }
    }

    const listDirectory = async () => {
        let output = []
        if (error.value.length == 0 && !loading.value) {
            try {
               for await (const entry of fs.value.ls(dirCid.value)) {
                console.log(entry)
                output.push({cid: entry.cid, path: entry.path, name: entry.name})
               }
               Object.assign(lsOutput, output)
               return {status: 'success', res: output}
            } catch (e) {
                console.error(e)
            }
        }

    }
    return {
        stat,
        getStat,
        makeDirectory,
        dirCid,
        lsOutput,
        listDirectory,
    }
}