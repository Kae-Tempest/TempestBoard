<script lang="ts" setup>
import type {Issue, States} from "~/types/global";
import {ref} from "vue";

interface Props {
  issueId: Number | null
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()
const SelectedPriority = ref("");
const SelectedState = ref("");
const count = ref(500);
const projectStates = ref<States[]>([])


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

const resetForm = () => {
  data.title = "";
  data.description = "";
  data.priority = "";
  data.status = "";
};

watch(showModal, async () => {
  count.value = 500
  const {data: issue} = await useCustomFetch<Issue>(`/issues/${props.issueId}/`)
  const {data: projectState } = await useCustomFetch<States[]>(`/project/${issue.value?.project}/states`)
  data.title = issue.value!.title;
  data.description = issue.value!.description;
  data.priority = issue.value!.priority;
  data.status = issue.value!.status;
  projectStates.value = projectState.value as States[]

  count.value = count.value - data.description.length

  SelectedPriority.value = data.priority.toLowerCase()
  SelectedState.value = data.status

})

const data = reactive({
  title: "",
  description: "",
  priority: "",
  status: ""
})

const handleEdit = async () => {
  await useCustomFetch(`/issues/${props.issueId}/`, {
    method: 'patch',
    body: JSON.stringify(data)
  })
  isRefresh.value = true
  showModal.value = false
}

</script>

<template>

  <div :class="{'is-active': showModal}" class="modal edit-issue-modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <div class="control">
            <label for="title">Issue Title</label>
            <input v-model="data.title" class="input" placeholder="Title..." type="text">
            <label for="textarea">Issue Content</label>
            <textarea
                class="textarea has-fixed-size"
                maxLength=500
                minLength=3
                placeholder="Issue Description"
                @input="count = 500 - ($event.target as HTMLTextAreaElement).value.length"
                v-model="data.description"
            ></textarea>
            <div class="count">{{ count != 0 ? count : 0 }}/500</div>
            <div class="select-group">
              <div class="select">
                <select v-model="SelectedPriority">
                  <option disabled value="">Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="neutral">Neutral</option>
                  <option value="low">Low</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
              <div class="select">
                <select v-model="SelectedState">
                  <option disabled value="">State</option>
                  <option v-for="state in projectStates" :value="state.name">{{ useCapitalize(state.name) }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button class="button" @click="showModal=false; resetForm()">
          Cancel
        </button>
        <button class="button is-dark" @click="handleEdit()">
          Submit
        </button>
      </div>
    </div>
  </div>

</template>