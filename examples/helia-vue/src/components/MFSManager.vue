<script setup type="ts">
import { ref } from 'vue'
import { useUnixFS } from '@/HeliaApi/useUnixFS'

const { stat, getStat, makeDirectory, dirCid, listDirectory, lsOutput } = useUnixFS()

const dirPath = ref()
const handleNewDir = async () => {
    const response = await makeDirectory(dirPath.value)
    console.log(response)
}
const handleGetStat = async () => {
    const response = await getStat()
    console.log(response)
}

const handleListDirectory = async () => {
    const response = await listDirectory()
    console.log(response)
}
</script>
<template>
    <h1>UnixFS Manager</h1>
    <div>
        <input type="text" v-model="dirPath"/>
        <button @click="handleNewDir">Create New Directory</button>
        <p>directory Cid: {{ dirCid }}</p>
    </div>
    <div v-if="dirCid">
        <button @click="handleGetStat">get stat</button>
        <p>{{ stat }}</p>
    </div>
    <div v-if="dirCid">
        <button @click="handleListDirectory">list Directory</button>
        <p>{{ lsOutput }}</p>
    </div>
</template>
<style scoped>
</style>