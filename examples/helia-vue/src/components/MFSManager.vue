<script setup type="ts">
import { ref } from 'vue'
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
    const response = await getStat(dirCid.value)
    stat.value = response.data
}

const lsOutput = ref()
const ls = ref()
const handleGetDirectory = async () => {
    const response = await getDirectory(dirCid.value)
    ls.value = response.data
    lsOutput.value = {
        cid: response.data[0].cid,
        path: response.data[0].path,
        name: response.data[0].name
    }
}

const fileName = ref()
const fileContent = ref()
const fileCid = ref()
const handleAddFile = async () => {
    const response = await addFile(
        lsOutput.value.path,
        fileName.value,
        fileContent.value
    )
    console.log(response.data)
    fileCid.value = response.data
}

const fileData = ref()
const handleGetFile = async () => {
    const response = await getFile(
        fileCid.value
    )
    console.log(response)
    fileData.value = response.data

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
        <button @click="handleGetDirectory">list Directory</button>
        <p>{{ lsOutput }}</p>
    </div>
    <div v-if="lsOutput">
        <input type="text" v-model="fileName" placeholder="File Name" />
        <input type="text" v-model="fileContent" placeholder="File Content" />
        <button @click="handleAddFile">Add File</button>
        <p>file cid: {{ fileCid }}</p>
    </div>
    <div v-if="fileCid">
        <button @click="handleGetFile">Get File</button>
        <p>file contents: {{ fileData }}</p>
    </div>
</template>
<style scoped></style>