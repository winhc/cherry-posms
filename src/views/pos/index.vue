<template>
  <div class="app-container">
    {{ title }}
  </div>
</template>
<script>
import { POS } from "@/mixins/pos";

export default {
  mixins: [POS],
};
</script>
<style>
</style>
