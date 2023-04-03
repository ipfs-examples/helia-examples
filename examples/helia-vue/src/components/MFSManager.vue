<script setup>
import { ref, computed } from 'vue'
import { useUnixFS } from '@/HeliaApi/useUnixFS'

const {
    getStat,
    addDirectory, getDirectory,
    addFile, getFile
} = useUnixFS()

const dirPathName = ref()
const dirCid = ref()
const handleNewDir = async () => {
    const response = await addDirectory(dirPathName.value)
    dirCid.value = response.data
}
const stat = ref()
const handleGetStat = async () => {
    const response = await getStat(dirCid.value, dirPathName.value)
    stat.value = response.data
}

const lsOutput = ref()
const ls = ref()
const handleGetDirectory = async (cid, pathName) => {
    const response = await getDirectory(cid, pathName)
    lsOutput.value = response.data.map((item) => {
        return {
            cid: item.cid,
            path: item.path,
            name: item.name
        }
    })
}

const fileName = ref()
const fileContent = ref()
const fileCid = ref()
const fileDirCid = ref()
const handleAddFile = async () => {
    const response = await addFile(
        fileName.value,
        lsOutput.value[0].cid,
        fileContent.value
    )
    fileCid.value = response.data.fileCid
    fileDirCid.value = response.data.dirCid

}

const fileData = ref()
const handleGetFile = async () => {
    const response = await getFile(
        fileCid.value
    )
    fileData.value = response.data
}

const directoryContents = ref()
const handleGetDirectoryContents = async () => {
    const response = await getDirectory(
        fileDirCid.value
    )
    directoryContents.value = response.data.map((item) => {
        return {
            cid: item.cid,
            name: item.name,
            path: item.path
        }
    })
}
</script>
<template>
    <h1>UnixFS Manager</h1>
    <div>
        <input type="text" v-model="dirPathName" />
        <button @click="handleNewDir">Create New Directory</button>
        <p>directory Cid: {{ dirCid }}</p>
    </div>
    <div v-if="dirCid">
        <button @click="handleGetStat">stat directory</button>
        <p>{{ stat }}</p>
    </div>
    <div v-if="dirCid">
        <button @click="handleGetDirectory(dirCid, '')">list Directory</button>
        <p v-for="(item, index) in lsOutput">{{ item }}</p>
    </div>
    <div v-if="lsOutput">
        <input type="text" v-model="fileName" placeholder="File Name" />
        <input type="text" v-model="fileContent" placeholder="File Content" />
        <button @click="handleAddFile">Add File</button>
        <p>file cid: {{ fileCid }}</p>
        <p>updated directory cid: {{ fileDirCid }}</p>
    </div>
    <div v-if="fileDirCid">
        <button @click="handleGetDirectoryContents">Get Directory Contents</button>
        <p v-for="(item, index) in directoryContents">directory contents: {{ item }}</p>
    </div>
    <div v-if="directoryContents">
        <button @click="handleGetFile">Get File</button>
        <p>file contents: {{ fileData }}</p>
    </div>
</template>
<style scoped></style>