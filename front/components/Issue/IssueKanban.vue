<script setup lang="ts">
import type {Issue, Project} from "~/types/global";
import IssueKanbanDetails from "~/components/Issue/issueKanbanDetails.vue";


interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
}

defineProps<Props>()


</script>

<template>
  <IssueKanbanDetails v-if="typeView === 'all'" :issueArray="issueArray" :Projects="Projects"/>
  <IssueKanbanDetails v-if="typeView === 'created'" :issueArray="createdIssue" :Projects="Projects"/>
  <IssueKanbanDetails v-if="typeView === 'assigned'" :issueArray="assignedIssue" :Projects="Projects"/>
</template>