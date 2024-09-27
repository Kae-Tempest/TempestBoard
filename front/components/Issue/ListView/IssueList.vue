<script setup lang="ts">

import type {Issue, Project, States, User} from "~/types/global";
import IssueListDetails from "~/components/Issue/ListView/IssueListDetails.vue";
import IssueMenu from "~/components/Menu/IssueMenu.vue";

interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
  users: User[];
}

defineProps<Props>()

const issueId = ref<number | null>(null);
const MenuPos = ref<{ x: number, y: number }>({x: 0, y: 0});
const {data: allStates, refresh} = await useCustomFetch<States[]>('/states/')

onMounted(() => {
  refresh()
})


</script>

<template>
  <IssueMenu v-if="issueId" :id="issueId" :pos="MenuPos"/>
  <IssueListDetails v-if="typeView === 'all'" :issueArray="issueArray" :Projects="Projects" :States="allStates" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
  <IssueListDetails v-if="typeView === 'created'" :issueArray="createdIssue" :Projects="Projects" :States="allStates" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
  <IssueListDetails v-if="typeView === 'assigned'" :issueArray="assignedIssue" :Projects="Projects" :States="allStates" v-model="issueId" v-model:pos="MenuPos" :Users="users"/>
</template>
