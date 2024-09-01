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
  <div :class="{'is-active': showModal}" class="modal del-issue">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box del-box">
        <h4>Are you sure you want to delete the issue {{ project?.name.substring(0, 3).toUpperCase() }}-{{ issue?.ticket_id }}?</h4>
        <!--       Btn action       -->
        <button class="button is-cancel" @click="showModal = false"> <!-- blanc + border gris -->
          Cancel
        </button>
        <button class="button is-danger" @click="showModal=false; handleDelete()">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>