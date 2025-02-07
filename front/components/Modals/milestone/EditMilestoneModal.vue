  <script setup lang="ts">
  import type {MileStone} from "~/types/global";
  import {ref} from "vue";

  interface Props {
  milestoneID: number
}

const props = defineProps<Props>()
const showModal = defineModel('modal', {type: Boolean, required: true})
const count = ref(300);
const milestone = ref<MileStone>()

watch(() => props.milestoneID, async (newVal) => {
  if (newVal) {
    if (props.milestoneID !== 0) {
      milestone.value = await useCustomFetch<MileStone>(`/milestones/${props.milestoneID}/`)
      await updateData()
    }
  }
})

const updateData = async () => {
  if (!milestone.value) return
  data.name = milestone.value.name
  data.description = milestone.value.description
  data.project = milestone.value.project
  data.start_date = new Date(milestone.value.start_date).toISOString().substring(0, 10)
  data.delivery_date = new Date(milestone.value.delivery_date).toISOString().substring(0, 10)
  data.status = milestone.value.status
}

const resetForm = () => {
  data.name = ""
  data.description = ""
  data.start_date = new Date().toISOString().substring(0, 10)
  data.delivery_date = ""
}

const handleUpdateMilestone = async () => {
  const res = await useCustomFetch<MileStone>(`/milestones/${props.milestoneID}/`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })

  if (res) {
    resetForm()
    showModal.value = false
    useRefreshData().isRefresh.value = true
  }
}

const data = reactive({
  name: "",
  project: 0,
  description: "",
  start_date: new Date().toISOString().substring(0, 10),
  delivery_date: "",
  status: "open"
})


</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleUpdateMilestone" class="box">
        <div class="field">
          <div class="control">
            <label for="version" class="version">Milestone Version</label>
            <input type="text" class="input" id="version" placeholder="Milestone Version" v-model="data.name" required>

            <label for="description" class="description">Description</label>
            <textarea
                class="textarea has-fixed-size"
                maxLength=300
                @input="count = 300 - ($event.target as HTMLTextAreaElement).value.length"
                placeholder="Milestone Description"
                v-model="data.description"
            ></textarea>
            <div class="count">{{ count != 0 ? count : 0 }}/300</div>
          </div>
        </div>
        <div class="field">
          <label for="status">State</label>
          <div class="control">
            <div class="select">
              <select name="state" id="state" v-model="data.status">
                <option value="open">Open</option>
                <option value="publish">Publish</option>
                <option value="unpublish">Unpublish</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <div class="date-picker">
              <label for="start-date">Start Date</label>
              <input type="date" name="start-date" id="start-date" class="input is-small" v-model.lazy="data.start_date"
                     required>
            </div>
            <div class="date-picker">
              <label for="delivery-date">Delivery Date</label>
              <input type="date" name="delivery-date" id="delivery-date" class="input is-small"
                     v-model.lazy="data.delivery_date" required>
            </div>
          </div>
        </div>
        <button class="button" @click="showModal = false; resetForm">
          Cancel
        </button>
        <button
            class="button is-dark" type="submit">
          Update
        </button>
      </form>
    </div>
  </div>
</template>