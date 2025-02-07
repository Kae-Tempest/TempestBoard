<script setup lang="ts">

interface Props {
  milestoneID: number
}

const props = defineProps<Props>()

const handleDeleteMilestone = async () => {
  await useCustomFetch(`/milestones/${props.milestoneID}/`, {
    method: 'DELETE'
  })
  useRefreshData().isRefresh.value = true
}

</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleDeleteMilestone" class="box del-box">
        <h4>Are you sure you want to delete this release ?</h4>
        <div class="btn-action">
          <button class="button" type="reset" @click="showModal=false">Cancel</button>
          <button class="button is-dark" type="submit">Delete</button>
        </div>
      </form>
    </div>
  </div>
</template>