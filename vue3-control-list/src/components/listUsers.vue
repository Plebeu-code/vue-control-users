<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';

defineProps({ users: Array<any>, isFetching: Boolean })

const emit = defineEmits(["change"])

const { VITE_URL_API, VITE_PORT_API } = import.meta.env
const deleteRef = ref({ isDeleting: false, data: null, error: null, statusCode: NaN })

function deleteUser(id: number) {

  if (deleteRef.value.isDeleting) { return }
  deleteRef.value = {
    ...deleteRef.value,
    isDeleting: true
  }

  return axios.post(`${VITE_URL_API}:${VITE_PORT_API}/api/user/${id}/delete`)
    .then((res) => {
      deleteRef.value = {
        statusCode: res.status,
        data: res.data,
        error: null,
        isDeleting: false
      }

      setTimeout(() => {
        deleteRef.value = {
          statusCode: NaN,
          data: null,
          error: null,
          isDeleting: false
        }
      }, 5000)
    })
    .catch((err) => {
      deleteRef.value = {
        statusCode: err.response.status,
        data: err.response.data,
        error: true,
        isDeleting: false
      }

      setTimeout(() => {
        deleteRef.value = {
          statusCode: NaN,
          data: null,
          error: null,
          isDeleting: false
        }
      }, 5000)
    })
    .finally(() => {
      emit("change")
    })
}

</script>

<template>
  <AlertSuccess v-if="deleteRef.statusCode === 200" :message="deleteRef.data" />
  <AlertErro v-if="deleteRef.statusCode === 404" :message="deleteRef.data" />
  <table class="border-collapse min-w-[750px] rounded overflow-hidden">
    <thead class="bg-[#57cc99]">
      <tr>
        <th class="p-3">
          ID
        </th>
        <th>Data</th>
        <th>Nome</th>
        <th>CPF</th>
        <th>E-mail</th>
        <th>Perfil</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody class="font-bold">
      <div v-if="false" class=" flex w-full h-full justify-center items-center">
        <AlertErro message="Internal Server Erro" />
      </div>
      <tr v-for="{ name, created_at, id, cpf, email, profiles } in users" :key="id"
        class="text-center border-b-black bg-gray-8">
        <td class="p-2">
          {{ id }}
        </td>
        <td>{{ new Date(created_at).toLocaleDateString("pt-br") }}</td>
        <td>{{ name }}</td>
        <td>{{ cpf }}</td>
        <td>{{ email }}</td>
        <td>{{ profiles[0]?.name.toUpperCase() }}</td>
        <td>
          <div class="flex flex-row items-center justify-center">
            <ModalAdd class="icon-btn" :id="id" />
            <ModalView class="icon-btn" :id="id" />
            <ModalEdit class="icon-btn" :id="id" @change="emit('change')" />
            <button class="icon-btn" @click="deleteUser(id)">
              <div v-if="!deleteRef.isDeleting" class="i-carbon-trash-can" />
              <Loading v-if="deleteRef.isDeleting" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
