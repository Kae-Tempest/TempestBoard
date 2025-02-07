<script setup lang="ts">


import type {Issue, Project} from "~/types/global";

interface Props {
  issueId: number | null
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()

const issue = ref<Issue>()
const project = ref<Project>()

issue.value = await useCustomFetch<Issue>(`/issues/${props.issueId}/`)
project.value = await useCustomFetch<Project>(`/projects/${issue.value.project}/`)

const handleDelete = async () => {
  await useCustomFetch(`/issues/${props.issueId}/`, {
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
  <div :class="{'is-active': showModal}" class="modal del-issue">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleDelete" class="box del-box">
        <h4>Are you sure you want to delete the issue {{ project?.name.substring(0, 3).toUpperCase() }}-{{ issue?.ticket_id }}?</h4>
        <button class="button" @click="showModal = false">
          Cancel
        </button>
        <button class="button is-dark" type="submit">
          Delete
        </button>
      </form>
    </div>
  </div>
</template>