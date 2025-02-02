<script setup lang="ts">
import type {MileStone} from "~/types/global";
import {ref} from "vue";

interface Props {
  project: string
}

const props = defineProps<Props>()
const showModal = defineModel('modal', {type: Boolean, required: true})
const count = ref(300);


const resetForm = () => {
  data.name = ""
  data.description = ""
  data.start_date = new Date().toISOString().substring(0, 10)
  data.delivery_date = ""
}

const data = reactive({
  name: "",
  project: props.project,
  description: "",
  start_date: new Date().toISOString().substring(0, 10),
  delivery_date: "",
  status: "open"
})


const handleCreateMilestone = async () => {
  data.start_date = new Date(data.start_date)
  data.delivery_date = new Date(data.delivery_date)

  const res = await useCustomFetch<MileStone>(`/milestones/`, {
    method: "post",
    body: JSON.stringify(data)
  })

  if (res) {
    resetForm()
    showModal.value = false
    useRefreshData().isRefresh.value = true
  }
}




</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
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
            class="button is-dark" @click="handleCreateMilestone">
          Create
        </button>
      </div>
    </div>
  </div>
</template>