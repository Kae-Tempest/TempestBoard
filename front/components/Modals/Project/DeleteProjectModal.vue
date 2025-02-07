<script setup lang="ts">
import type {Project} from "~/types/global";

interface Props {
  project: Project
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()

const handleDelete = async () => {
  await useCustomFetch(`/projects/${props.project.id}/`, {
    method: 'DELETE',
  })
  isRefresh.value = true
  showModal.value = false
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
    }
  })
})


</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleDelete()" class="box del-box">
        <h4>Are you sure you want to delete {{ project?.name }}?</h4>
        <div class="btn-action">
          <button class="button" @click="showModal=false">Cancel</button>
          <button class="button is-dark" type="submit">Delete</button>
        </div>
      </form>
    </div>
  </div>
</template>