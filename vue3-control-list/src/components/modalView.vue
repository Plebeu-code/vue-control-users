<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { format } from 'fecha'

const props = defineProps({
  id: Number,
})

const userDataView = ref(null)

const { VITE_URL_API, VITE_PORT_API } = import.meta.env

const { execute, isFetching, error, data } = useFetch(
  `${VITE_URL_API}:${VITE_PORT_API}/api/user/${props.id}`,
  { immediate: false },
)

const isModalOpen = ref(false)
const modal = ref(null)

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase()
}

const openModal = () => {
  execute()
    .then(() => {
      userDataView.value = JSON.parse(data.value as any)
      isModalOpen.value = !isModalOpen.value
    })
}

onClickOutside(modal, () => (isModalOpen.value = false))
</script>

<template>
  <div class="flex items-center justify-center">
    <button @click="openModal">
      <div class="i-carbon:data-view-alt" />
    </button>
    <Teleport to="#modal">
      <div v-if="isModalOpen"
        class="fixed top-0 left-0 w-screen h-screen g-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border-gray-200 flex items-center justify-center">
        <div ref="modal" class="bg-dark w-auto h-auto rounded p-3">
          <form action="#" class="flex flex-col items-center">
            <div class="grid grid-cols-2 gap-4 ">
              <div class="flex flex-col focus:outline-none border-none outline-0">
                <label for="name">Nome</label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 "
                  type="text" :value="capitalize(userDataView.user.name)">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">CPF</label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                  type="number" :value="userDataView.user.cpf">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">Usuário</label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                  type="text" :value="capitalize(userDataView.profile[0].name)">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">E-mail </label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                  type="email" :value="userDataView.user.email">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">Criado em</label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                  type="text" :value="format(new Date(userDataView.user.created_at), 'HH:mm DD/MM/YYYY')">
              </div>
              <div class="flex flex-col focus:outline-none border-none">
                <label for="name">Atualizado em</label>
                <input disabled
                  class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                  type="text" :value="format(new Date(userDataView.user.updated_at), 'HH:mm DD/MM/YYYY')">
              </div>
            </div>
            <Camp disabled v-for="address in userDataView.addresses" :key="address.id" :cep="address.cep"
              :street="address.logradouro" />
            <div class="mt-5 flex flex-row justify-between w-full ">
              <div />
              <button class="px-10 py-1 bg-red-5 rounded hover:bg-red-6" @click="isModalOpen = false">
                Fechar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
