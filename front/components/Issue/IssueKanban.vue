<script setup lang="ts">
import type {Issue, Project, States} from "~/types/global";
import IssueKanbanDetails from "~/components/Issue/issueKanbanDetails.vue";


interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
}

defineProps<Props>()
const {data: allStates, refresh} = await useCustomFetch<States[]>('/states/')

onMounted(() => {
  refresh()
})


</script>

<template>
  <IssueKanbanDetails v-if="typeView === 'all'" :issueArray="issueArray" :Projects="Projects" :States="allStates"/>
  <IssueKanbanDetails v-if="typeView === 'created'" :issueArray="createdIssue" :Projects="Projects" :States="allStates"/>
  <IssueKanbanDetails v-if="typeView === 'assigned'" :issueArray="assignedIssue" :Projects="Projects" :States="allStates"/>
</template>