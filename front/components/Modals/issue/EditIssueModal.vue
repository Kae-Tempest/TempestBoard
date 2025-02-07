<script lang="ts" setup>
import type {Issue, States} from "~/types/global"
import {ActivityContent} from "~/enums/AcitivityContentEnum"
import {reactive, ref} from "vue";

interface Props {
  issueId: number | null
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()
const SelectedPriority = ref("");
const SelectedState = ref("");
const count = ref(500);
const projectStates = ref<States[]>([])
const issueInfo = ref<Issue>()
const issue = ref<Issue>()
const { sendMessage } = useWebSocket('ws/activity/')
const wsActivityMessage = reactive({
  type: "activity",
  content: "",
  issue: 0,
  user: 0,
})

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
  issue.value = await useCustomFetch<Issue>(`/issues/${props.issueId}/`)
  if(!issue.value) return
  data.title = issue.value.title;
  data.description = issue.value.description;
  data.priority = issue.value.priority;
  data.status = issue.value.status;
  issueInfo.value = issue.value
  projectStates.value = await useCustomFetch<States[]>(`/projects/${issue.value?.project}/states`)
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

watch(() => SelectedPriority.value, newVal => {
  if(newVal) data.priority = SelectedPriority.value
})

watch(() => SelectedState.value, newVal => {
  if(newVal) data.status = SelectedState.value
})


const handleSendMessage = (action: string) => {
  if(!props.issueId) return
  wsActivityMessage.issue = props.issueId
  wsActivityMessage.user = useUserStore().user!.id
  wsActivityMessage.content = action
  sendMessage(JSON.stringify(wsActivityMessage))
}

const handleEdit = async () => {
  if(!issueInfo.value) return
  const res = await useCustomFetch(`/issues/${props.issueId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  if(res) {
    if (data.title != issueInfo.value.title) handleSendMessage(ActivityContent.EDIT_TITLE)
    if (data.description != issueInfo.value.description) handleSendMessage(ActivityContent.EDIT_DESCRIPTION)
    if (data.status != issueInfo.value.status) handleSendMessage(ActivityContent.EDIT_STATUS)
    if (data.priority != issueInfo.value.priority) handleSendMessage(ActivityContent.EDIT_PRIORITY)
  }

  isRefresh.value = true
  showModal.value = false
}

</script>

<template>

  <div :class="{'is-active': showModal}" class="modal edit-issue-modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleEdit" class="box">
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
        <button class="button" type="reset" @click="showModal=false; resetForm()">
          Cancel
        </button>
        <button class="button is-dark" type="submit">
          Submit
        </button>
      </form>
    </div>
  </div>

</template>