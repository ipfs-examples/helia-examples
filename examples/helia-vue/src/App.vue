<script setup lang="ts">
import { ref, inject, computed  } from 'vue';
const helia  = inject('HeliaProvider')
const statusColor = computed(() => {
  if (helia.loading == true) return 'yellow'
  if (helia.loading == false && helia.error.length == 0) return 'green'
  return 'red'

})
</script>

<template>
  <header>
    <div class="wrapper">
      {{ helia.loading }}
    </div>
  </header>

  <main>
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
