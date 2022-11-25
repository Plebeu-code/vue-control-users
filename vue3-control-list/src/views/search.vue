<script lang="ts" setup>

const { VITE_URL_API, VITE_PORT_API } = import.meta.env

const {
  execute,
  isFetching,
  data = ref([])
} = useFetch(
  `${VITE_URL_API}:${VITE_PORT_API}/api/users`,
  { immediate: false }
).json()

onBeforeMount(execute)


function v(g) {
  let filter
  g.forEach(e => {
    filter[e.name] = e.value
  })
  console.log(filter);
  
  
  let tempFilter;
  if ("name" in filter) tempFilter = data.value.filter((f) => f.name == filter.name)
  if ("cpf" in filter) tempFilter = data.value.filter((f) => f.cpf == filter.cpf)
  if ("start" in filter) tempFilter = data.value.filter((f) => new Date(f.created_at) >= new Date(filter.start))
  if ("end" in filter) tempFilter = data.value.filter((f) => new Date(f.created_at) <= new Date(filter.end))
  data.value = tempFilter
}

</script>

<template>
  <div class="w-screen flex h-screen items-center justify-center flex-col">
    <div class="w-[750px] mb-5 flex justify-between">
      <a href="/register" class="px-5 py-1 rounded bg-blue hover:bg-blue-5">
        Novo
      </a>
      <h1 class="font-bold text-2xl flex flex-row items-center justify-center">
        Lista de usuários
        <div v-if="isFetching" class="flex-1 ml-[15px]">
          <Loading />
        </div>
      </h1>
      <ModalFilter :users="data" @filter="v" />
    </div>
    <listUsers :isFetching="isFetching" :users="data" @change="execute" />
  </div>
</template>
