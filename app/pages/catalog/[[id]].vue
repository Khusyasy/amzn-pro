<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    Catalog {{ route.params.id ? ' - ' + route.params.id : '' }}
  </div>
</template>
