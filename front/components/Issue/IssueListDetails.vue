<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import {ref, watch} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import IssueIcon from "~/components/Icon/IssueIcon.vue";
import DnDIssue from "~/components/Issue/DnDIssue.vue";
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";

interface Props {
  issueArray: Issue[];
  Projects: Project[];
}

defineProps<Props>()

const stateArray = ["open", "in_progress", "completed", "canceled"];

const showModal = ref(false);
const selectedState = ref("")
const IssueModel = defineModel()
const IssuePos = defineModel('pos')

watch(() => showModal.value, (newVal) => {
  if (!newVal) selectedState.value = ""
})
</script>

<template>
  <CreateIssueModal :projects="Projects" v-model:modal="showModal" :state="selectedState"/>
  <div v-for="state in stateArray" :key="state" class="wrapper-issue-list">
    <div class="issue-header">
      <div class="issue-state">
        <IssueIcon :state="state"/>
        {{ state.toUpperCase() }}
      </div>
      <font-awesome-icon icon="fa-solid fa-plus" @click="showModal=true; selectedState=state" class="issue-add"/>
    </div>
    <DnDIssue :projects="Projects" :issues="issueArray" :state="state" v-model="IssueModel" v-model:pos="IssuePos"/>
  </div>
</template>
