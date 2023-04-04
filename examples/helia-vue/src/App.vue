<script setup>
import { ref, inject, computed  } from 'vue';
import TextCommiter from './components/TextCommiter.vue';
import UnixFSManager from './components/UnixFSManager.vue';

const {loading, error}  = inject('HeliaProvider')

const statusColor = computed(() => {
  if (loading.value == true) return 'yellow'
  if (loading.value == false && error.value.length == 0) return 'green'
  return 'red'
})
const readyMessage = computed(() => {
  if (loading.value == true) return 'Loading...'
  if (loading.value == false && error.value.length == 0) return 'Ready'
  return 'Failing'
})
</script>

<template>
  <header id="heliaStatus">
    <div class="wrapper">
      Helia is: {{ readyMessage }}
    </div>
  </header>

  <main>
    <TextCommiter />
    <UnixFSManager />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: v-bind('statusColor')
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
