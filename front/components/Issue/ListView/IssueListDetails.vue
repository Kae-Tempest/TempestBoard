<script setup lang="ts">

import type {Issue, Project, States, User} from "~/types/global";
import {ref, watch} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import DnDIssue from "~/components/Issue/ListView/DnDIssue.vue";
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";

interface Props {
  issueArray: Issue[];
  Projects: Project[];
  States: States[];
  Users: User[];
}

const props = defineProps<Props>()


const showModal = ref(false);
const selectedState = ref("")
const dropdownIdOpen = ref<number | null>(null)
const IssueID = defineModel()
const IssuePos = defineModel('pos')
const filteredState = computed(() => filterUniqueState(props.States))

const filterUniqueState = (states: States[]): States[] => {
  const uniqueStates = new Map<string, States>();

  states.forEach(state => {
    if (!uniqueStates.has(state.name) || state.updated_at > uniqueStates.get(state.name)!.updated_at) {
      uniqueStates.set(state.name, state);
    }
  });

  return Array.from(uniqueStates.values());
}



watch(() => showModal.value, (newVal) => {
  if (!newVal) selectedState.value = ""
})

watch(() => dropdownIdOpen.value, (newVal) => {
  if(newVal) IssueID.value = null
})

watch(() => IssueID.value, (newVal) => {
  if(newVal) dropdownIdOpen.value = null
})

</script>

<template>
  <CreateIssueModal :projects="Projects" v-model:modal="showModal" :state="selectedState"/>
  <div v-for="state in filteredState" :key="state.name" class="wrapper-issue-list">
    <div class="issue-header">
      <div class="issue-state">
<!--        <IssueIcon :state="state.name"/>-->
        {{ useCapitalize(state.name).toUpperCase() }}
      </div>
      <font-awesome-icon icon="fa-solid fa-plus" @click="showModal=true; selectedState=state.name" class="issue-add"/>
    </div>
    <DnDIssue :projects="Projects" :issues="issueArray" :state="state.name" :users="Users" v-model="IssueID" v-model:pos="IssuePos" v-model:dropdown-id-open="dropdownIdOpen"/>
  </div>
</template>
