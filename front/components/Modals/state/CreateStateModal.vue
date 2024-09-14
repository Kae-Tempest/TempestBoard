<script setup lang="ts">

import type {Project} from "~/types/global";

interface Props {
  project: Project
}
const props = defineProps<Props>()
const openCreateStateModal = defineModel()

const data = reactive({
  name: "",
  project: props.project.id,
  isdefault: false
})

const error = reactive({
  name: "",
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      openCreateStateModal.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      openCreateStateModal.value = false
      data.name = ""
      error.name = ""
    }
  })
})


const handleAddState = async () => {
  const res = await useCustomFetch('/states/', {
    method: "POST",
    body: data
  })
  if (res.error.value) {

  } else {
    openCreateStateModal.value = false
  }
}
</script>

<template>
  <div :class="{'is-active': openCreateStateModal}" class="modal state">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="control">
          <div class="field">
            <label for="name">State Name</label>
            <input id="name" placeholder="State Name..." type="text" class="input" v-model="data.name">
            <span class="error">{{ error.name }}</span>
          </div>
        </div>
        <div class="btn-action">
          <button class="button" @click="openCreateStateModal=false">Cancel</button>
          <button class="button is-dark" @click="handleAddState()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>