<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({'users': { default: [] }})

const emit =defineEmits([
  'filter'
])

const filterUsers = (e) => {
  const filter = [...e.target].map(({ value, name }: any) => ({value, name})).filter(({value, name}) => value.length)
  emit("filter", filter)

} 

const modal = ref(null)

const isModalOpen = ref(false)

onClickOutside(modal, () => (isModalOpen.value = false))
</script>

<template>
  <div>
    <button class="px-5 py-1 rounded bg-blue hover:bg-blue-5" @click="isModalOpen = true">
      Filtrar
    </button>
    <Teleport to="#modal">
      <div v-if="isModalOpen" class="fixed top-0 left-0 w-screen h-screen g-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 flex items-center justify-center">
        <div ref="modal" class="bg-dark w-auto h-auto rounded p-3 transition-all">
          <form @submit.prevent="filterUsers" class="flex flex-col items-center">
            <div class="grid grid-cols-2 gap-4 ">
              <div class="flex flex-col focus:outline-none border-none outline-0">
                <label for="name">Nome</label>
                <input name="name" maxlength="13" class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 " type="text">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">CPF</label>
                <input name="cpf" v-mask="'###.###.###-##'" class="rounded h-[32px]  pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">Início</label>
                <input name="start" class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="date">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">Fim</label>
                <input name="end" class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="date">
              </div>
            </div>
            <div class="mt-5 flex flex-row justify-between w-full ">
              <button type="button" class="px-10 py-1 bg-red-5 rounded hover:bg-red-6" @click="isModalOpen = false">
                Cancelar
              </button>
              <button class="px-10 py-1 bg-blue rounded hover:bg-blue-5">
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
