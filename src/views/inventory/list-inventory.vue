<template>
  <div class="app-container">
    {{ title }}
  </div>
</template>
<script>
import { ListInventory } from "@/mixins/inventory/list-inventory";

export default {
  mixins: [ListInventory],
};
</script>
<style>
</style>
