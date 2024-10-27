<script setup lang="ts">
import type {Issue, Project, States} from "~/types/global";
import IssueKanbanDetails from "~/components/Issue/KanbanView/issueKanbanDetails.vue";


interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
  filter?: string;
}

const props = defineProps<Props>()
const {data: allStates, refresh} = await useCustomFetch<States[]>('/states/')
const statesFilter = ref<States[]>([])

onMounted(async () => {
  await refresh()
  if (props.filter && allStates.value) {
    if(props.filter === 'active') statesFilter.value = allStates.value.filter(s => s.name !== 'backlog' && s.name !== 'completed' && s.name !== 'canceled');
    if(props.filter === 'backlog') statesFilter.value = allStates.value.filter(s => s.name === 'backlog');
  } else {
    statesFilter.value = allStates.value as States[]
  }
})


</script>

<template>
  <IssueKanbanDetails v-if="typeView === 'all' && allStates" :issueArray="issueArray" :Projects="Projects" :States="statesFilter"/>
  <IssueKanbanDetails v-if="typeView === 'created' && allStates" :issueArray="createdIssue" :Projects="Projects" :States="statesFilter"/>
  <IssueKanbanDetails v-if="typeView === 'assigned' && allStates" :issueArray="assignedIssue" :Projects="Projects" :States="statesFilter"/>
</template>