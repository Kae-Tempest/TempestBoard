<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import IssueListDetails from "~/components/Issue/IssueListDetails.vue";
import IssueMenu from "~/components/Menu/IssueMenu.vue";

interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
}

defineProps<Props>()

const issueId = ref<number | null>(null);
const MenuPos = ref<{ x: number, y: number }>({x: 0, y: 0});
</script>

<template>
  <IssueMenu v-if="issueId" :id="issueId" :pos="MenuPos"/>
  <IssueListDetails v-if="typeView === 'all'" :issueArray="issueArray" :Projects="Projects" v-model="issueId" v-model:pos="MenuPos"/>
  <IssueListDetails v-if="typeView === 'created'" :issueArray="createdIssue" :Projects="Projects" v-model="issueId" v-model:pos="MenuPos"/>
  <IssueListDetails v-if="typeView === 'assigned'" :issueArray="assignedIssue" :Projects="Projects" v-model="issueId" v-model:pos="MenuPos"/>
</template>
