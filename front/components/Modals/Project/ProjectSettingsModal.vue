<script setup lang="ts">
import type {Project, States, User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";
import WorkflowSettingsModule from "~/components/Project/Workflow/WorkflowSettingsModule.vue";
import Toastify from "toastify-js";

interface Props {
  project: Project
}

const props = defineProps<Props>()
const showModal = defineModel()

const tabs = ref("users")

const users = ref<User[]>([])
const projectUsers = ref<User[]>([])
const projectState = ref<States[]>([])
const openCreateStateModal = ref<Boolean>(false)

const data = reactive({
  users: [] as string[],
})

const resetForm = () => {
  data.users = []
  users.value = []
  projectUsers.value = []
}

const {data: projectStateData, refresh: projectStateRefresh } = await useCustomFetch<States[]>(`/project/${props.project.id}/states/`)


const handleFetch = async () => {
  const {data: pUsers} = await useCustomFetch<User[]>(`/projects/${props.project.id}/users/`)
  const {data: usersData} = await useCustomFetch<User[]>('/users/')
  await projectStateRefresh()
  users.value = usersData.value as User[]
  projectUsers.value = pUsers.value as User[]
  projectState.value = projectStateData.value as States[]
}

watch(() => showModal.value, async (newVal) => {
  if (newVal) {
    await handleFetch()
  }
})

watch(() => openCreateStateModal.value, async (newVal) => {
  if (newVal) {
    await projectStateRefresh()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      openCreateStateModal.value = false
    }
  })
})

onMounted(async () => {
  await handleFetch()
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      openCreateStateModal.value = false
      resetForm()
    }
  })
})


const handleUpdate = async () => {
  const res = await useCustomFetch(`projects/${props.project.id}/users/`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (res.error.value === null) {
    showModal.value = false
    resetForm()
  } else if(res.error.value) {
    Toastify({
      text: 'An error occurred',
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "toast",
    }).showToast();
  }
}

</script>

<template>
  <div :class="{'is-active': showModal}" class="modal settings">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box user-box">
        <h3>Project Settings</h3>
        <div class="content">
          <div class="tabs-left">
            <div class="tabs-titles">
              <div class="tabs-title" :class="{'is-active': tabs === 'users'}" @click="tabs = 'users'">Users</div>
              <div class="tabs-title" :class="{'is-active': tabs === 'workflow'}" @click="tabs = 'workflow'">Workflow</div>
            </div>
          </div>
          <div v-if="tabs === 'users'" class="tabs-right user">
            <div class="field">
              <div class="select is-multiple">
                <select multiple size="4" v-if="users.length > 0" v-model="data.users">
                  <option v-for="user in users.filter(u => u.id !== project.creator)" :key="user.id" :value="user.id">{{ user.username }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button" @click="showModal=false; resetForm()" type="button">Cancel</button>
                <button class="button is-dark" type="submit" @click="handleUpdate">Add</button>
              </div>
            </div>
          </div>
          <div v-if="tabs === 'workflow'" class="tabs-right workflow">
            <WorkflowSettingsModule  :projectStates="projectState" :project="project" v-model="openCreateStateModal"/>
            <div class="button is-small" @click="openCreateStateModal = true">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-plus" />
              </span>
            </div>
          </div>
        </div>
        <button class="button" @click="showModal=false">Cancel</button>
      </div>
    </div>
  </div>
</template>
