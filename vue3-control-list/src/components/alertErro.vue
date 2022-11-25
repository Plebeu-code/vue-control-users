<script lang="ts" setup>
defineProps({
  message: String,
})
</script>

<template>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold mr-[5px]">Erro!</strong>
    <span class="block sm:inline">{{ message }}.</span>
  </div>
</template>
