<script setup lang="ts">

import type {Issue, Project, States, User} from "~/types/global";
import IssueListDetails from "~/components/Issue/ListView/IssueListDetails.vue";
import IssueMenu from "~/components/Menu/IssueMenu.vue";

const allStates = ref<States[]>()
interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
  users: User[];
  filter?: string;
}

const props = defineProps<Props>()

const issueId = ref<number | null>(null);
const MenuPos = ref<{ x: number, y: number }>({x: 0, y: 0});
allStates.value = await useCustomFetch<States[]>('/states/')
const statesFilter = ref<States[]>([])

onMounted(async () => {
  if (props.filter && allStates.value) {
    if(props.filter === 'active') statesFilter.value = allStates.value.filter(s => s.name !== 'backlog' && s.name !== 'completed' && s.name !== 'canceled');
    if(props.filter === 'backlog') statesFilter.value = allStates.value.filter(s => s.name === 'backlog');
  } else {
    statesFilter.value = allStates.value
  }
})


</script>

<template>
  <IssueMenu v-if="issueId" :id="issueId" :pos="MenuPos"/>
  <IssueListDetails v-if="typeView === 'all' && allStates" :issueArray="issueArray" :Projects="Projects" :States="statesFilter" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
  <IssueListDetails v-if="typeView === 'created' && allStates" :issueArray="createdIssue" :Projects="Projects" :States="statesFilter" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
  <IssueListDetails v-if="typeView === 'assigned' && allStates" :issueArray="assignedIssue" :Projects="Projects" :States="statesFilter" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
</template>
