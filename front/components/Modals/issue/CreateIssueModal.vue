<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import type {Project, States, User} from "~/types/global"
import {ActivityContent} from "~/enums/AcitivityContentEnum"

import {useUserStore} from "~/stores/useUserStore";

interface Props {
  projects: Project[];
  state?: string;
}

const props = defineProps<Props>()

const { sendMessage } = useWebSocket('ws/activity/')
const wsActivityMessage = reactive({
  type: "activity",
  content: ActivityContent.CREATE_ISSUE,
  issue: 0,
  user: 0,
})

const showModal = defineModel('modal', {type: Boolean, required: true})
const count = ref(500);
const user: User | null = useUserStore().getUser;
const projectStates = ref<States[]>([])
const {isRefresh} = useRefreshData();
const route = useRoute().params

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
      resetForm()
    }
  })
})

const data = reactive({
  creator: user?.id,
  assigned: user?.id,
  title: "",
  description: "",
  priority: "",
  project: parseInt(route.id),
  status: props.state ? props.state : "",
  tags: null
});

const errors = reactive({
  title: "",
  description: "",
});


watch(() => props.state, (newVal) => {
  if (newVal) data.status = newVal
});

watch(() => data.project, async (newVal) => {
  if (newVal != 0) {
    projectStates.value = await useCustomFetch<States[]>(`/projects/${newVal}/states`)
  }
});

const resetForm = () => {
  data.title = "";
  data.description = "";
  data.priority = "";
  data.project = 0;
  data.status = "";
};

const handleSubmit = async () => {
  if (data.title.length < 3) errors.title = "Title must be at least 3 characters long";
  const res = await useCustomFetch('/issues/', {
        method: 'POST',
        body: JSON.stringify(data),
      }
  )
  if (res) {
    wsActivityMessage.issue = res.id
    wsActivityMessage.user = user!.id
    sendMessage(JSON.stringify(wsActivityMessage))
    isRefresh.value = true
    showModal.value = false;
    resetForm();
  }
};


</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleSubmit()" class="box">
        <div class="field">
          <div class="control">
            <label for="title">Issue Title</label>
            <input class="input" maxLength=100 minLength=3 placeholder="Issue Title" type="text" v-model="data.title">
            <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
            <label for="textarea">Issue Content</label>
            <textarea
                class="textarea has-fixed-size"
                maxLength=500
                minLength=3
                placeholder="Issue Description"
                @input="count = 500 - ($event.target as HTMLTextAreaElement).value.length"
                v-model="data.description"
            ></textarea>
            <p v-if="errors.description" class="help is-danger">{{ errors.description }}</p>
            <div class="count">{{ count != 0 ? count : 0 }}/500</div>
            <div class="select-group">
              <div class="select">
                <select v-model="data.priority">
                  <option disabled value="">Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="neutral">Neutral</option>
                  <option value="low">Low</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
              <div class="select">
                <select v-model="data.project">
                  <option v-if="!route.id" disabled value="0">Project</option>
                  <option v-if="route.id && projects.length > 1" :value="parseInt(route.id)">{{ projects.filter(p => p.id == parseInt(route.id))[0].name }}</option>
                  <option v-for="project in projects.filter(p => p.id !== parseInt(route.id))" :value="project.id">{{ project.name }}</option>
                </select>
              </div>
              <div class="select">
                <select v-model="data.status">
                  <option disabled value="">State</option>
                  <option v-if="data.project == 0" value="backlog">Backlog</option>
                  <option v-if="data.project == 0" value="open">Open</option>
                  <option v-if="data.project == 0" value="in_progress">In Progress</option>
                  <option v-if="data.project == 0" value="completed">Completed</option>
                  <option v-if="data.project == 0" value="canceled">Canceled</option>
                  <option v-if="data.project != 0 && projectStates.length > 0" v-for="state in projectStates" :value="state.name">{{ useCapitalize(state.name) }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button class="button" type="reset" @click="showModal=false; resetForm()">
          Cancel
        </button>
        <button
            class="button is-dark" type="submit">
          Create
        </button>
      </form>
    </div>
  </div>
</template>