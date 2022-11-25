<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios';

const props = defineProps({
  id: Number,
})

const modal = ref(null)
const isModalOpen = ref(false)

const { VITE_URL_API, VITE_PORT_API } = import.meta.env

const usePost = ref({ isFetching: false, error: null, data: null, statusCode: NaN })
const updateAddress = (e) => {
  const [logradouro, cep] = [...e.target].map(({ value }: any) => value.replace(/[^@\w]/g, ''))

  usePost.value = { ...usePost.value, isFetching: true }

  return axios.post(`${VITE_URL_API}:${VITE_PORT_API}/api/user/${props.id}/address`, {
    cep,
    logradouro
  })
    .then((res) => {
      console.log(res);
      
      usePost.value = {
        data: res.data,
        statusCode: res.status,
        error: null,
        isFetching: false
      }
    })
    .catch((err) => {
      usePost.value = {
        data: err.response.data,
        statusCode: err.response.status,
        error: err,
        isFetching: false
      }
      
      setTimeout(() => {
        usePost.value = {
          ...usePost.value,
          error: false,
        }
      }, 10000)
    })
}

onClickOutside(modal, () => (isModalOpen.value = false))
</script>

<template>
  <div>
    <button class="pr-3 py-1 rounded " @click="isModalOpen = true">
      <div class="i-carbon:home text-[17px]" />
    </button>
    <Teleport to="#modal">
      <div v-if="isModalOpen"
        class="fixed top-0 left-0 w-screen h-screen g-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 flex items-center justify-center">
        <div ref="modal" class="bg-dark w-auto h-auto rounded p-3 transition-all">
          <form  @submit.prevent="updateAddress" class="flex flex-col items-center">
            <div class="grid grid-cols-2 gap-4 ">
              <div class="flex flex-col focus:outline-none border-none outline-0">
                <label for="name">Rua</label>
                <input required maxlength="15" name="address"
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 "
                  type="text">
              </div>
              <div class="flex flex-col focus:outline-none border-none outline-0">
                <label for="name">CEP</label>
                <input required v-mask="'#####-###'"
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 "
                  type="text" name="cep">
              </div>
            </div>
            <div class="mt-5 flex flex-row justify-between w-full ">
              <button class="px-10 py-1 bg-red-5 rounded hover:bg-red-6" @click="isModalOpen = false">
                Cancelar
              </button>
              <button class="px-10 py-1 bg-blue rounded hover:bg-blue-5">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
