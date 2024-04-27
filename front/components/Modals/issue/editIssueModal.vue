<script lang="ts" setup>
import type {Issue} from "~/types/global";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import {ref} from "vue";
import IssueIcon from "~/components/Icon/IssueIcon.vue";

interface Props {
  issueId: number
}

const props = defineProps<Props>()
const showModal = defineModel()
const {isRefresh} = useRefreshData()
const priorityIcon = ref("fa-solid fa-chevron-down");
const stateIcon = ref("fa-solid fa-chevron-down")
const SelectedPriority = ref("Priority");
const SelectedState = ref("State");
const dropdownOpen = ref(false);
const stateDropdownOpen = ref(false);


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

watch(showModal, async () => {
  const {data: issue} = await useCustomFetch<Issue>(`/issues/${props.issueId}/`)
  data.title = issue.value?.title || "Any Issue";
  data.description = issue.value?.description || "Any Issue";
  data.priority = issue.value?.priority || "Any Issue";
  data.status = issue.value?.status || "Any Issue";

  handleSetPriority(data.priority);
  handleSetState(data.status);
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


const handleSetPriority = (priority: string) => {
  if (SelectedPriority.value.toLowerCase() === priority.toLowerCase()) {
    priorityIcon.value = "fa-solid fa-chevron-down";
    SelectedPriority.value = "Priority";
  } else {
    data.priority = priority.toUpperCase();
    if (priority.toLowerCase() === "urgent") priorityIcon.value = "fa-solid fa-circle-exclamation";
    else if (priority.toLowerCase() === "high") priorityIcon.value = "fa-solid fa-angles-up";
    else if (priority.toLowerCase() === "neutral") priorityIcon.value = "fa-solid fa-pause";
    else if (priority.toLowerCase() === "low") priorityIcon.value = "fa-solid fa-minus";
    else if (priority.toLowerCase() === "minor") priorityIcon.value = "fa-solid fa-chevron-down";
    SelectedPriority.value = priority.charAt(0).toUpperCase() + priority.slice(1);
  }
  dropdownOpen.value = false;
};

const handleSetState = (state: string) => {
  if (SelectedState.value.toLowerCase() === state) {
    stateIcon.value = "fa-solid fa-chevron-down";
    SelectedState.value = "State";
  } else {
    data.status = state;
    if (state === "open") stateIcon.value = "fa-regular fa-circle";
    else if (state === "completed") stateIcon.value = "fa-solid fa-circle";
    else if (state === "canceled") stateIcon.value = "fa-solid fa-circle-xmark";
    SelectedState.value = state.charAt(0).toUpperCase() + state.slice(1);
  }
  stateDropdownOpen.value = false;
};

</script>

<template>

  <div :class="{'is-active': showModal}" class="modal edit-modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <header class="box-header">
          <h3 class="modal-card-title">Create Issue</h3>
          <button aria-label="close" class="delete" @click="showModal=false"></button>
        </header>
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input v-model="data.title" class="input" placeholder="Title..." type="text">
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea v-model="data.description" class="textarea" placeholder="Description.."></textarea>
          </div>
        </div>
        <div class="double-field">
          <div :class="{'is-active': dropdownOpen}" class="dropdown priority-dropdown">
            <div class="dropdown-trigger">
              <button aria-controls="dropdown-priority" aria-haspopup="true" class="button" @click.stop="dropdownOpen=!dropdownOpen">
                <span>{{ SelectedPriority }}</span>
                <span class="icon">
                    <font-awesome-icon :icon="priorityIcon" :rotation="SelectedPriority == 'Neutral' ? 90 : undefined"/>
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
          <div :class="{'is-active': stateDropdownOpen}" class="dropdown">
            <div class="dropdown-trigger">
              <button aria-controls="dropdown-state" aria-haspopup="true" class="button" @click.stop="stateDropdownOpen=!stateDropdownOpen">
                <span>{{ SelectedState }}</span>
                <span class="icon dropdown-icon">
                    <span :class="{'open-issue-icon': SelectedState == 'Open', 'completed-issue-icon': SelectedState == 'Completed', 'canceled-issue-icon': SelectedState == 'Canceled'}">
                      <font-awesome-icon v-if="SelectedState != 'In_progress'" :icon="stateIcon"/>
                    </span>
                    <IssueIcon v-if="SelectedState == 'In_progress'" state="in_progress"/>
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
        <div class="field is-grouped">
          <div class="control">
            <button class="button btn-cancel" @click="showModal=false">Cancel</button>
          </div>
          <div class="control">
            <button class="button btn-edit" @click="handleEdit()">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>