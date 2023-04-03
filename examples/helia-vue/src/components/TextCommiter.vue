<script setup>
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
        <input id="commitText" type="text" v-model="textToCommit"/>
        <button id="commitTextButton" @click="handleCommitText">Commit Text</button>
        <p id="commitTextCidOutput">cid: {{ cid }}</p>
    </div>
    <div v-if="cid">
        <button id="fetchCommitedTextButton" @click="fetchCommitedText">Fetch Commited Text</button>
        <p id="fetchedCommitedTextOutput">commited Text: {{ commitedText }}</p>

    </div>
</template>

<style scoped>
</style>