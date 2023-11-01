<template>
  <div class="test-list">
      <scatter-button>
          Scatter
      </scatter-button>
      <auto-typer :word-list="['test', 'test 2', 'test 3']"></auto-typer>
  </div>
</template>

<script setup lang="ts">

import ScatterButton from "@ecl-design/scatter-button"
import AutoTyper from "@ecl-design/auto-typer"

</script>

<style scoped>

.test-list {
    display: grid;
    gap: 3rem;
    justify-content: center;
}
</style>
