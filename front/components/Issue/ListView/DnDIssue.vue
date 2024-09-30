<script setup lang="ts">

import type {Issue, Project, User} from "~/types/global";
import {ActivityContent} from "~/enums/AcitivityContentEnum"
import IssueDetails from "~/components/Issue/ListView/IssueDetails.vue";
import {reactive} from "vue";
import {useUserStore} from "~/stores/useUserStore";


interface Props {
  issues: Issue[];
  projects: Project[];
  state: string;
  users: User[];
}

const props = defineProps<Props>();

const IssueID = defineModel()
const IssuePos = defineModel('pos')
const IssueAssignedClicked = ref<boolean>(false)
const dropdownIdOpen = defineModel<number | null>('dropdownIdOpen')
const { sendMessage } = useWebSocket('ws/activity/')
const wsActivityMessage = reactive({
  type: "activity",
  content: ActivityContent.EDIT_STATUS,
  issue: 0,
  user: 0,
})

const handleMenu = (issue: Issue, e: MouseEvent) => {
  if (!IssueAssignedClicked.value) {
    if (IssueID.value === issue.id) {
      IssueID.value = null
    } else {
      IssueID.value = issue.id
      IssuePos.value = {x: e.offsetX, y: e.clientY}
    }
  }
  IssueAssignedClicked.value = false
}

const startDrag = (e: DragEvent, item: Issue) => {
  if (!e.dataTransfer) return;
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('itemID', item.id.toString());
}

const onDrop = async (e: DragEvent, state: string) => {
  if (!e.dataTransfer) return;
  const itemID = e.dataTransfer.getData('itemID');
  const item = props.issues.find(i => i.id.toString() === itemID);
  if (!item) return;
  item.status = state;
  await useCustomFetch(`/issues/${item.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({status: state}),
  });
  wsActivityMessage.issue = item.id
  wsActivityMessage.user = useUserStore().getUser()!.id
  sendMessage(JSON.stringify(wsActivityMessage))
}
</script>

<template>
  <div @drop="onDrop($event, state)" @dragenter.prevent @dragover.prevent class="dnd-issue-wrapper">
    <div v-for="issue in issues.filter(i => i.status === state).sort((a,b) => a.ticket_id - b.ticket_id)" :key="issue.id" draggable="true" @dragstart="startDrag($event, issue)"
         @click="handleMenu(issue, $event)" class="dnd-issue-list">
      <IssueDetails :projects="projects" :issue="issue" :users="users" v-model="IssueAssignedClicked" v-model:dropdown-id-open="dropdownIdOpen" />
    </div>
    <div v-if="issues.filter(i => i.status === state).length === 0" class="issue-list">
      <p class="placeholder-issue-list">drop here...</p>
    </div>
  </div>
</template>
