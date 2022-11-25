<script lang="ts" setup>
defineProps({
  street: String,
  cep: Number,
  disabled: Boolean
})
</script>

<template>
  <div class="grid grid-cols-2 w-full mt-[10px] gap-4">
    <div class="flex flex-col focus:outline-none border-none">
      <label for="name">Rua</label>
      <input :disabled="disabled"
        class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text"
        :value="street">
    </div>
    <div class="flex flex-col focus:outline-none border-none">
      <label for="name">CEP</label>
      <input :disabled="disabled"
        class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text"
        :value="cep">
    </div>
  </div>
</template>
