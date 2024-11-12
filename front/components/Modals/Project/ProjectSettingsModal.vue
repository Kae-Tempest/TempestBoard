<script setup lang="ts">
import type {Project, States} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";
import WorkflowSettingsModule from "~/components/Project/Workflow/WorkflowSettingsModule.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  project: Project
}

const props = defineProps<Props>()
const showModal = defineModel()

const tabs = ref("users")

const projectState = ref<States[]>([])
const openCreateStateModal = ref<Boolean>(false)

const dataForm = reactive({
  email: "",
  project_id: props.project.id
})

const resetForm = () => {
  dataForm.email = ""
  dataForm.project_id = 0
}

const handleFetch = async () => {
  const {data: projectStateData} = await useCustomFetch<States[]>(`/projects/${props.project.id}/states/`)
  projectState.value = projectStateData.value as States[]
}

watch(() => showModal.value, async (newVal) => {
  if(newVal) await handleFetch()
})

watch(() => openCreateStateModal.value, async (newVal) => {
  if (newVal) {
    const {data: projectStateData} = await useCustomFetch<States[]>(`/projects/${props.project.id}/states/`)
    projectState.value = projectStateData.value as States[]
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


const handleSendEmailInvitation = async () => {
  const { data, error } = await useCustomFetch(`/invitations/`, {
    method: "post",
    body: dataForm
  })
  if (data) console.log(data)
  if (error) console.log(error)
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
              <div class="control">
                <input type="email" class="input" v-model="dataForm.email"/>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button" @click="showModal=false; resetForm()" type="button">Cancel</button>
                <button class="button is-dark" type="submit" @click="handleSendEmailInvitation">Add</button>
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
        <button class="button" @click="showModal=false; tabs = 'users'; projectState = [] ">Cancel</button>
      </div>
    </div>
  </div>
</template>
