<script lang="ts" setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive, ref, watch} from 'vue'
import type {Project} from "~/types/global";
import IssueIcon from "~/components/Icon/IssueIcon.vue";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import {useUserStore} from "~/stores/useUserStore";

interface Props {
  projects: Project[];
  state?: string;
}

const props = defineProps<Props>()

const showModal = defineModel('modal', {type: Boolean, required: true})
const count = ref(500);
const dropdownOpen = ref(false);
const projectDropdownOpen = ref(false);
const stateDropdownOpen = ref(false);
const SelectedProject = ref("Project");
const SelectedState = ref("State");
const SelectedPriority = ref("Priority");
const priorityIcon = ref("fa-solid fa-chevron-down");
const stateIcon = ref("fa-solid fa-chevron-down")
const user = useUserStore().getUser();
const {isRefresh} = useRefreshData();

const handleClose = () => {
  dropdownOpen.value = false;
  projectDropdownOpen.value = false;
  stateDropdownOpen.value = false;
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClose)
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener('click', handleClose)
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
  if (newVal) handleSetState(newVal);
});

const resetForm = () => {
  data.title = "";
  data.description = "";
  data.priority = "";
  data.project = 0;
  data.status = "";
  SelectedProject.value = "Project";
  SelectedState.value = "State";
  SelectedPriority.value = "Priority";
  priorityIcon.value = "fa-solid fa-chevron-down";
  stateIcon.value = "fa-solid fa-chevron-down";
};


const handleSetPriority = (priority: string) => {
  if (SelectedPriority.value === priority) SelectedPriority.value = "Priority";
  else {
    data.priority = priority.toUpperCase();
    if (priority === "urgent") priorityIcon.value = "fa-solid fa-circle-exclamation";
    else if (priority === "high") priorityIcon.value = "fa-solid fa-angles-up";
    else if (priority === "neutral") priorityIcon.value = "fa-solid fa-pause";
    else if (priority === "low") priorityIcon.value = "fa-solid fa-minus";
    else if (priority === "minor") priorityIcon.value = "fa-solid fa-chevron-down";
    SelectedPriority.value = priority.charAt(0).toUpperCase() + priority.slice(1);
  }
};

const handleSetState = (state: string) => {
  if (SelectedState.value === state) SelectedState.value = "State";
  else {
    data.status = state;
    if (state === "open") stateIcon.value = "fa-regular fa-circle";
    else if (state === "completed") stateIcon.value = "fa-solid fa-circle";
    else if (state === "canceled") stateIcon.value = "fa-solid fa-circle-xmark";
    SelectedState.value = state.charAt(0).toUpperCase() + state.slice(1);
  }
};

const handleSetProject = (id: number, name: string) => {
  if (SelectedProject.value === name) {
    data.project = 0;
    SelectedProject.value = "Project";
  } else {
    data.project = id;
    SelectedProject.value = name;
  }
};

const handleSubmit = async () => {
  if (data.title.length < 3) errors.title = "Title must be at least 3 characters long";
  if (data.description.length < 3) errors.description = "Description must be at least 3 characters long";
  const res = await useCustomFetch('/issues/', {
        method: 'POST',
        body: JSON.stringify(data),
      }
  )
  if (res.error.value !== null) {
    errors.title = res.error.value?.data.title[0];
    errors.description = res.error.value?.data.description[0];
  }
  if (res.data.value !== null) {
    isRefresh.value = true
    showModal.value = false;
  }
};


</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div ref={modalRef} class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create Issue</p>
        <button aria-label="close" class="delete" @click="showModal=false"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <div class="control">
            <input class="input" maxLength=100 minLength=3 placeholder="Issue Title" type="text" v-model="data.title">
            <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
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

            <div :class="{'is-active': dropdownOpen}" class="dropdown">
              <div class="dropdown-trigger">
                <button aria-controls="dropdown-priority" aria-haspopup="true" class="button" @click.stop="dropdownOpen=!dropdownOpen">
                  <span>{{ SelectedPriority }}</span>
                  <span class="icon">
                    <font-awesome-icon :icon="priorityIcon" :rotation="SelectedPriority == 'Neutral' ? 90 : 0"/>
                  </span>
                </button>
              </div>
              <div id="dropdown-priority" class="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <div class="dropdown-item" @click="handleSetPriority('urgent')">
                    <div class="priority">
                      <span>Urgent</span>
                      <span class="icon">
                        <PriorityIcon priority="URGENT"/>
                      </span>
                    </div>
                  </div>
                  <div class="dropdown-item" @click="handleSetPriority('high')">
                    <div class="priority">
                      <span>High</span>
                      <span class="icon">
                        <PriorityIcon priority="HIGH"/>
                      </span>
                    </div>
                  </div>
                  <div class="dropdown-item" @click="handleSetPriority('neutral')">
                    <div class="priority">
                      <span>Neutral</span>
                      <span class="icon">
                        <PriorityIcon priority="NEUTRAL"/>
                      </span>
                    </div>
                  </div>
                  <div class="dropdown-item" @click="handleSetPriority('low')">
                    <div class="priority">
                      <span>Low</span>
                      <span class="icon">
                        <PriorityIcon priority="LOW"/>
                      </span>
                    </div>
                  </div>
                  <div class="dropdown-item" @click="handleSetPriority('minor')">
                    <div class="priority">
                      <span>Minor</span>
                      <span class="icon">
                        <PriorityIcon priority="MINOR"/>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div :class="{'is-active': projectDropdownOpen}" class="dropdown">
              <div class="dropdown-trigger">
                <button aria-controls="dropdown-project" aria-haspopup="true" class="button" @click.stop="projectDropdownOpen=!projectDropdownOpen">
                  <span>{{ SelectedProject }}</span>
                  <span class="icon">
                    <font-awesome-icon icon="fa-solid fa-chevron-down"/>
                  </span>
                </button>
              </div>
              <div id="dropdown-project" class="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <div v-for="project in projects" class="dropdown-item">
                    <div @click="handleSetProject(project.id, project.name)">
                      {{ project.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div :class="{'is-active': stateDropdownOpen}" class="dropdown">
              <div class="dropdown-trigger">
                <button aria-controls="dropdown-state" aria-haspopup="true" class="button" @click.stop="stateDropdownOpen=!stateDropdownOpen">
                  <span>{{ SelectedState }}</span>
                  <span class="icon dropdown-icon">
                    <span :class="{'open-issue-icon': SelectedState == 'Open', 'completed-issue-icon': SelectedState == 'Completed', 'canceled-issue-icon': SelectedState == 'Canceled'}">
                      <font-awesome-icon v-if="SelectedState != 'In_progress'" :icon="stateIcon"/>
                    </span>
                    <IssueIcon state="in_progress" v-if="SelectedState == 'In_progress'"/>
                  </span>
                </button>
              </div>
              <div id="dropdown-project" class="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <div class="dropdown-item dropdown-icon" @click="handleSetState('open')">
                    Open
                    <IssueIcon state="open"/>
                  </div>
                  <div class="dropdown-item dropdown-icon" @click="handleSetState('in_progress')">
                    In Progress
                    <IssueIcon state="in_progress"/>
                  </div>
                  <div class="dropdown-item dropdown-icon" @click="handleSetState('completed')">
                    Completed
                    <IssueIcon state="completed"/>
                  </div>
                  <div class="dropdown-item dropdown-icon" @click="handleSetState('canceled')">
                    Canceled
                    <IssueIcon state="canceled"/>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button btn-error" @click="showModal=false; resetForm()">
          Cancel
        </button>
        <button
            class="button btn-success" @click="handleSubmit()">
          Create
        </button>
      </footer>
    </div>
  </div>
</template>