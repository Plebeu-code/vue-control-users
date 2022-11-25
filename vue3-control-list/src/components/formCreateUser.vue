<script lang="ts" setup>
import axios from "axios"

const { VITE_URL_API, VITE_PORT_API } = import.meta.env

const usePost = ref({ isFetching: false, error: null, data: null, statusCode: NaN })

const createUser = (e) => {
  const [name, cpf, email, type, logradouro, cep] = [...e.target].map(({ value }: any) => value.replace(/[^@\w]/g, ''))

  usePost.value = { ...usePost.value, isFetching: true }
  
  return axios.post(`${VITE_URL_API}:${VITE_PORT_API}/api/user`, {
    name,
    email,
    cpf,
    type: type === "user" ? 1 : 2,
    addresses: [{
      logradouro,
      cep
    }]
  })
    .then((res) => {
      usePost.value = {
        data: res.data,
        statusCode: res.status,
        error: null,
        isFetching: false
      }

      setTimeout(() => {
        usePost.value = {
          ...usePost.value,
          statusCode: NaN,
        }
      }, 3000)
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

</script>

<template>
  <AlertSuccess v-if="usePost.statusCode === 201" :message="'Usuário foi criado!'" />
  <AlertErro v-if="usePost.error" :message="usePost.data" class="mb-[20px]" />
  <span v-if="usePost.isFetching">Enviando dados...</span>
  <form class="flex flex-col items-center" @submit.prevent="createUser">
    <div class="grid grid-cols-2 gap-4 ">
      <div class="flex flex-col focus:outline-none border-none outline-0">
        <label for="name">Nome *</label>
        <input required maxlength="13" value="dasdas"
          class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500 " type="text">
      </div>
      <div class="flex flex-col focus:outline-none border-none">
        <label for="name">CPF *</label>
        <input v-mask="'###.###.###-##'" required value="123.123.132-12"
          class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text">
      </div>
      <div class="flex flex-col focus:outline-none border-none">
        <label for="name">E-mail *</label>
        <input required maxlength="32" value="dasd@dsad"
          class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="email">
      </div>
      <div class="flex flex-col focus:outline-none border-none">
        <label for="profile">Perfil *</label>
        <select class="rounded h-[32px] text-black focus:outline-none focus:ring focus:border-blue-500" name="profile"
          value="profile">
          <option disabled value="">
            Por favor escolha um.
          </option>
          <option value="user">
            User
          </option>
          <option value="admin">
            Adm
          </option>
        </select>
      </div>
      <div class="flex flex-col focus:outline-none border-none">
        <label for="name">Rua *</label>
        <input required maxlength="32" value="sadasdasdasd"
          class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text">
      </div>
      <div class="flex flex-col focus:outline-none border-none">
        <label for="name">CEP *</label>
        <input v-mask="'#####-###'" required value="12345-123"
          class="rounded h-[32px] pl-2 text-black focus:outline-none focus:ring focus:border-blue-500" type="text">
      </div>
    </div>
    <div class="mt-5 flex flex-row justify-between w-full ">
      <a class="px-10 py-1 bg-blue rounded hover:bg-blue-5" href="/">Voltar</a>
      <button class="px-10 py-1 bg-blue rounded hover:bg-blue-5">
        Adicionar
      </button>
    </div>
  </form>
</template>
