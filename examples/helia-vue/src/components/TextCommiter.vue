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
    <h1>Add Text To Node</h1>
    <div>
        <input id="commitText" type="text" v-model="textToCommit"/>
        <button id="commitTextButton" @click="handleCommitText">Add text</button>
        <p id="commitTextCidOutput">cid: {{ cid }}</p>
    </div>
    <div v-if="cid">
        <button id="fetchCommitedTextButton" @click="fetchCommitedText">Fetch added text</button>
        <p id="fetchedCommitedTextOutput">added text: {{ commitedText }}</p>

    </div>
</template>

<style scoped>
</style>