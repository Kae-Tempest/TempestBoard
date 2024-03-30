<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import IssueListDetails from "~/components/Issue/IssueListDetails.vue";

interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
}

defineProps<Props>()
defineEmits(['isCreated']);
</script>

<template>
  <IssueListDetails v-if="typeView === 'all'" :issueArray="issueArray" :Projects="Projects"/>
  <IssueListDetails v-if="typeView === 'created'" :issueArray="createdIssue" :Projects="Projects"/>
  <IssueListDetails v-if="typeView === 'assigned'" :issueArray="assignedIssue" :Projects="Projects"/>
</template>
