<script setup lang="ts">

import type {Project, States} from "~/types/global";
import Toastify from "toastify-js";

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

const error = reactive({
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
      isdefault: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    projectStatesRef.value.push(newState)
    editedState.value = newState.name
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
  const res = await useCustomFetch(`/states/${stateID}/`, {
    method: 'DELETE',
  })

  projectStatesRef.value.map((s, i) => {
    if (s.id === stateID) {
      console.log('s.id === statedID')
      console.log(s, i)
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
      body: {
        name: data.name.trim(),
        project: props.project.id
      }
    })

    if(res.data.value) {
      projectStatesRef.value.map(s => {
        if(s.id === -1) {
          s.name = res.data.value?.name ? res.data.value.name : data.name
          s.id = res.data.value?.id ? res.data.value.id : projectStatesRef.value.length
        }
      })
      data.name = ""
      isCreating.value = false
      CreateStateRef.value = false
    } else if (res.error.value?.data){
      Toastify({
        text: res.error.value.data?.name[0],
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "toast",
      }).showToast();
    }

  } else if (!isCreating.value) {
    const res = await useCustomFetch(`/states/${stateID}/`,{
      method: 'PATCH',
      body: {
        name: data.name.trim()
      }
    })

    if(res.data.value) {
      projectStatesRef.value.map(s => {
        if(s.id === stateID) {
          s.name = data.name
        }
      })
      data.name = ""
    } else if (res.error.value?.message){
      console.log(res.error.value?.message)
      if(isCreating.value) {
        projectStatesRef.value.pop()
        data.name = ""
        isCreating.value = false
        CreateStateRef.value = false
      }
      // toast
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
      <div v-if="!state.isdefault && editedState !== state.name" class="state-options">
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
      <div v-if="!state.isdefault && editedState === state.name" class="state-options">
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
