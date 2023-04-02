<script setup lang="ts">
import { ref } from 'vue'
import { useCommitText } from '@/HeliaApi/useCommitText'

const { cid, commitText, commitedText, fetchCommitedText } = useCommitText()
const textToCommit = ref()

const handleCommitText = async () => {
    await commitText(textToCommit.value) 
}

</script>

<template>
    <h1>Text Commiter</h1>
    <div>
        <input type="text" v-model="textToCommit"/>
        <button @click="handleCommitText">Commit Text</button>
        <p>cid: {{ cid }}</p>
    </div>
    <div v-if="cid">
        <button @click="fetchCommitedText">Fetch Commited Text</button>
        <p>commited Text: {{ commitedText }}</p>

    </div>
</template>

<style scoped>
</style>