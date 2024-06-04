<script setup lang="ts">
import type {Project, User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";

interface Props {
  project: Project
}

const props = defineProps<Props>()
const showModal = defineModel()
const users = ref<User[]>([])
const projectUsers = ref<User[]>([])

const handleFetch = async () => {
  const {data: pUsers} = await useCustomFetch<User[]>(`/projects/${props.project.id}/users/`)
  const {data: usersData} = await useCustomFetch<User[]>('/users/')
  users.value = usersData.value as User[]
  projectUsers.value = pUsers.value as User[]
  if (!projectUsers.value) return
  projectUsers.value.forEach(u => {
    const uIndex = users.value.findIndex(user => user.id === u.id)
    if (uIndex !== -1) {
      users.value.splice(uIndex, 1)
    }
  })
}

onMounted(async () => {
  await handleFetch()
})

watch(() => showModal.value, async (newVal) => {
  if (newVal) {
    await handleFetch()
  }
})

const data = reactive({
  users: [] as string[],
})

const resetForm = () => {
  data.users = []
  users.value = []
  projectUsers.value = []
}

const handleUpdate = async () => {
  const res = await useCustomFetch(`projects/${props.project.id}/users/`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (res.error.value === null) {
    showModal.value = false
    resetForm()
  }
}

</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box user-box">
        <h3>Add User</h3>
        <div class="field">
          <div class="select is-multiple">
            <select multiple size="4" v-if="users.length > 0" v-model="data.users">
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
            </select>
          </div>
        </div>
        <div class="field field-btn">
          <div class="control">
            <button class="button btn-danger" @click="showModal=false; resetForm()" type="button">Cancel</button>
            <button class="button btn-create" type="submit" @click="handleUpdate">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
