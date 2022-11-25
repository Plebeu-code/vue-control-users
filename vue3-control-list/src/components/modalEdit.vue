<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios';

const props = defineProps({
  id: Number
})

const emit = defineEmits(["change"])

const userData = ref(null)

const { VITE_URL_API, VITE_PORT_API } = import.meta.env

const isModalOpen = ref(false)
const modal = ref(null)

const { execute, data } = useFetch(
  `${VITE_URL_API}:${VITE_PORT_API}/api/user/${props.id}`,
  { immediate: false },
).json()

const openModal = () => {
  return execute()
    .then(() => {
      userData.value = data.value as any
      isModalOpen.value = !isModalOpen.value
    })
}

const deleteRef = ref({ isDeleting: false, data: null, error: null, statusCode: NaN })
const deleteAddress = (id: number) => {
  if (deleteRef.value.isDeleting) { return }

  deleteRef.value = {
    ...deleteRef.value,
    isDeleting: true
  }

  return axios.post(`${VITE_URL_API}:${VITE_PORT_API}/api/address/${id}/delete`)
    .then((res) => {
      deleteRef.value = {
        ...deleteRef.value,
        data: res.data,
        statusCode: res.status,
        error: null
      }
    })
    .catch((err) => {
      deleteRef.value = {
        ...deleteRef.value,
        data: err.response.data,
        statusCode: err.response.status,
        error: true
      }
    })
    .finally(() => {
      emit("change")
      deleteRef.value = {
        isDeleting: false,
        data: null,
        statusCode: NaN,
        error: null
      }
    })
}

const useUpdate = ref({ isFetching: false, error: null, data: null, statusCode: NaN })
const updateUser = (e) => {

  if (useUpdate.value.isFetching) { return }

  const data: string[] = [...e.target].map(({ value }: any) => value)

  const [name, cpf, email, profile] = data.slice(0, 4)

  let addresses = []

  const addressesElement = [...e.target].slice(4).filter(({ value }: any) => value)
  for (let index = 0; index < addressesElement.length; index++) {
    if (index % 2 === 0) {
      addresses.push({ 
        id: addressesElement[index].id, 
        logradouro: addressesElement[index].value,
        cep: parseInt(addressesElement[index + 1].value.replace(/[^\d]/g, "")) 
      })
    }
  }

  return axios.put(`${VITE_URL_API}:${VITE_PORT_API}/api/user/${props.id}/update`, {
    name: name.replace(/[^\w_]/g, ""),
    cpf: cpf.replace(/[^\d]/g, ""),
    email,
    profile: profile === "user" ? 1 : 2,
    addresses
  })
    .then((res) => {
      useUpdate.value = {
        data: res.data,
        statusCode: res.status,
        error: null,
        isFetching: false
      }

      userData.value.user = res.data
    })
    .catch((err) => {
      useUpdate.value = {
        data: err.response.data,
        statusCode: err.response.status,
        error: true,
        isFetching: false
      }
    })
    .finally(() => {
      emit("change")
      setTimeout(() => {
        useUpdate.value = {
          data: null,
          statusCode: NaN,
          error: null,
          isFetching: false
        }
      }, 5000)
    })
}

onClickOutside(modal, () => (isModalOpen.value = false))
</script>

<template>
  <div class="mx-3 flex items-center justify-center">
    <button @click="openModal">
      <div class="i-carbon:pen" />
    </button>
    <Teleport to="#modal">
      <div v-if="isModalOpen"
        class="fixed top-0 left-0 w-screen h-screen g-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 flex items-center justify-center">
        <div ref="modal" class="bg-dark w-auto h-auto rounded p-3">
          <AlertErro v-if="useUpdate.statusCode && useUpdate.statusCode !== 200" :message="useUpdate.data" />
          <AlertSuccess v-if="useUpdate.statusCode === 200" message="Usuário foi atualizado!" />
          <form @submit.prevent="updateUser" class="flex flex-col items-center">
            <div>
              <div class="grid grid-cols-2 gap-4 ">
                <div class="flex flex-col focus:outline-none border-none outline-0 pl-[30px]">
                  <label for="name">Nome</label>
                  <input class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 "
                    type="text" :value="userData.user.name" min="3">
                </div>
                <div class="flex flex-col focus:outline-none border-none pr-[30px]">
                  <label for="name">CPF</label>
                  <input class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                    type="text" v-mask="'###.###.###-##'" min="11" :value="userData.user.cpf">
                </div>
                <div class="flex flex-col focus:outline-none border-none pl-[30px]">
                  <label for="name">E-mail </label>
                  <input class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                    type="email" :value="userData.user.email" min="10">
                </div>
                <div class="flex flex-col focus:outline-none border-none pr-[30px]">
                  <label for="profile">Perfil *</label>
                  <select class="rounded h-[32px] text-black focus:outline-none focus:ring focus:border-blue-500"
                    name="profile" required>
                    <option default value="user">
                      User
                    </option>
                    <option value="adm">
                      Adm
                    </option>
                  </select>
                </div>
              </div>
              <div v-for="address in userData.addresses" :key="address.id"
                class="grid grid-cols-2 mt-[10px] gap-4 pl-[30px] w-[410px]">
                <div class="flex flex-col focus:outline-none border-none">
                  <label for="name">Rua</label>
                  <input :id="address.id.toString()" class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                    type="text" :value="address.logradouro">
                </div>
                <div class="flex flex-col focus:outline-none border-none w-auto">
                  <label for="name">CEP</label>
                  <div class="flex items-center flex-row ">
                    <input class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500"
                      type="text" v-mask="'#####-###'" :value="address.cep">

                    <button type="button" @click="deleteAddress(address.id)" class="ml-[5px]">
                      <div v-if="!deleteRef.isDeleting" class="i-carbon:trash-can hover:bg-red-5 text-[17px]" />
                      <Loading v-if="deleteRef.isDeleting" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 flex flex-row justify-between w-full ">
              <button class="px-10 py-1 bg-red-5 rounded hover:bg-red-6" @click="isModalOpen = false">
                Cancelar
              </button>
              <button class="px-10 py-1 bg-blue rounded hover:bg-blue-5">
                <div v-if="!useUpdate.isFetching">
                  Confirmar
                </div>
                <Loading v-if="useUpdate.isFetching" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
