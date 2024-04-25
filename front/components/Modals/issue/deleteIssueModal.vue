<script setup lang="ts">


import type {Issue, Project} from "~/types/global";

interface Props {
  issueId: number
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()

const {data: issue} = await useCustomFetch<Issue>(`/issues/${props.issueId}/`)
const {data: project} = await useCustomFetch<Project>(`/projects/${issue.value?.project}/`)

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
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box del-box">
        <h3>Are you sure you want to delete the issue {{ project?.name.substring(0, 3).toUpperCase() }}-{{ issue?.ticket_id }}?</h3>
        <div class="btn-action">
          <button class="cancel" @click="showModal=false">Cancel</button>
          <button class="del" @click="handleDelete()">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>