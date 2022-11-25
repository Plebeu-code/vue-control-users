<script lang="ts" setup>
defineProps({
  message: String,
})
</script>

<template>
  <div class="bg-teal-100 mb-[30px] border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadown-md">
    <div class="flex">
      <div>
        <p class="font-bold">
          Success
        </p>
        <p class="text-[17px]">
          {{ message }}.
        </p>
      </div>
    </div>
  </div>
</template>
