<template>
  <div class="test-list">
      <scatter-background disable-reposition :columns="cols" :rows="rows">
          Scatter
      </scatter-background>
      <button @click="cols += 1">inc col</button>
      <button @click="rows += 1">inc row</button>
      <auto-typer :word-list="['test', 'test 2', 'test 3']"></auto-typer>
  </div>
</template>

<script setup lang="ts">

import "@ecl-design/scatter-background/style"
import ScatterBackground from "@ecl-design/scatter-background"
import AutoTyper from "@ecl-design/auto-typer"
import {ref} from "vue"


const cols = ref(1)
const rows = ref(1)
</script>

<style scoped>

.test-list {
    display: grid;
    gap: 3rem;
    justify-content: center;
}

.scatter-background {
    --scatter-node-spread-color: red;
}
</style>
