<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import type {Project, States} from "~/types/global";
import {useUserStore} from "~/stores/useUserStore";
import Toastify from "toastify-js";

interface Props {
  projects: Project[];
  state?: string;
}

const props = defineProps<Props>()

const showModal = defineModel('modal', {type: Boolean, required: true})
const count = ref(500);
const user = useUserStore().getUser();
const projectStates = ref<States[]>([])
const {isRefresh} = useRefreshData();

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
  project: 0,
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
    const {data: projectState} = await useCustomFetch<States[]>(`/project/${newVal}/states`)
    projectStates.value = projectState.value as States[]
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
  // if (data.description.length < 3) errors.description = "Description must be at least 3 characters long";
  const res = await useCustomFetch('/issues/', {
        method: 'POST',
        body: JSON.stringify(data),
      }
  )
  if (res.error.value !== null) {
    errors.title = res.error.value?.data.title[0];
    errors.description = res.error.value?.data.description[0];
    Toastify({
      text: 'An error occurred',
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "toast",
    }).showToast();
  }
  if (res.data.value !== null) {
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
      <div class="box">
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
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Neutral</option>
                  <option>Low</option>
                  <option>Minor</option>
                </select>
              </div>
              <div class="select">
                <select v-model="data.project">
                  <option disabled value="0">Project</option>
                  <option v-for="project in projects" :value="project.id">{{ project.name }}</option>
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
        <button class="button" @click="showModal=false; resetForm()">
          Cancel
        </button>
        <button
            class="button is-dark" @click="handleSubmit()">
          Create
        </button>
      </div>
    </div>
  </div>
</template>