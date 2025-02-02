<script setup lang="ts">

import type {Project, States} from "~/types/global";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  projectStates: States[];
  project: Project;
}
const props = defineProps<Props>()
const CreateStateRef = defineModel()
const editedState = ref<String>("")
const isCreating = ref<Boolean>(false)

const data = reactive({
  name: ""
})
const projectStatesRef = computed(() => props.projectStates)

watch(() => CreateStateRef.value, () => {
  if(CreateStateRef.value && props.project.id) {
    isCreating.value = true
    let newState: States = {
      id: -1,
      name: "",
      project: props.project.id,
      is_default: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    setTimeout(() => {
      projectStatesRef.value.push(newState)
      editedState.value = newState.name
    }, 100)
  }
})

watch(() => editedState.value, (newVal) => {
  if(isCreating.value && newVal !== "") {
    projectStatesRef.value.pop()
    isCreating.value = false
    CreateStateRef.value = false
  }
})

const handleDelete = async (stateID: number) => {
  await useCustomFetch(`/states/${stateID}/`, {
    method: 'DELETE',
  })

  projectStatesRef.value.map((s, i) => {
    if (s.id === stateID) {
      projectStatesRef.value.splice(i, 1)
    }
  })

}

const handleCancel = () => {
  editedState.value = ''
  data.name = ""
  if (isCreating.value) {
    isCreating.value = false
    projectStatesRef.value.pop()
    CreateStateRef.value = false
  }
}

const handleUpsertState = async (stateID: number) => {
  if(isCreating.value) {
    const res = await useCustomFetch<States>(`/states/`,{
      method: 'POST',
      body: JSON.stringify({
        name: data.name.trim(),
        project: props.project.id
      })
    })

    if(res) {
      projectStatesRef.value.map(s => {
        if(s.id === -1) {
          s.name = res.name ? res.name : data.name
          s.id = res.id ? res.id : projectStatesRef.value.length
        }
      })
      data.name = ""
      isCreating.value = false
      CreateStateRef.value = false
    }

  } else if (!isCreating.value) {
    const res = await useCustomFetch(`/states/${stateID}/`,{
      method: 'PATCH',
      body: JSON.stringify({
        name: data.name.trim()
      })
    })

    if(res) {
      projectStatesRef.value.map(s => {
        if(s.id === stateID) {
          s.name = data.name
        }
      })
      data.name = ""
    }
  }
}

</script>

<template>
  <div class="state-wrapper">
    <div class="state-infos" v-for="state in projectStatesRef" key="state.name">
      <div v-if="editedState !== state.name" class="state-name">
        {{ useCapitalize(state.name) }}
      </div>
      <div v-if="editedState === state.name" class="state-name">
        <input type="text" class="input" :placeholder="state.name" v-model="data.name">
      </div>
      <div v-if="!state.is_default && editedState !== state.name" class="state-options">
        <div class="edit-icon" @click="editedState = state.name; data.name = state.name">
          <button class="button">
            <span class="icon">
              <font-awesome-icon icon="fa-regular fa-pen"/>
            </span>
          </button>
        </div>
        <div class="trash-icon">
          <button class="button is-dark" @click="handleDelete(state.id)">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </span>
          </button>
        </div>
      </div>
      <div v-if="!state.is_default && editedState === state.name" class="state-options">
        <div class="check-icon">
          <button class="button" @click="handleUpsertState(state.id)">
           <span class="icon">
            <font-awesome-icon icon="fa-solid fa-check" />
           </span>
          </button>
        </div>
        <div class="xmark-icon">
          <button class="button is-dark" @click="handleCancel">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
