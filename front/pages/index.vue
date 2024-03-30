<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Issue, Project} from "~/types/global";
import {useUserStore} from "~/stores/useUserStore";
import {useCustomFetch} from "~/composables/useCustomFetch";
import IssueList from "~/components/Issue/IssueList.vue";

const viewMode = ref("list");
const typeView = ref("all");
const Title = ref("All");
const issueArray = ref<Issue[]>([]);
const AssignedIssues = ref<Issue[]>([]);
const CreateIssues = ref<Issue[]>([]);
const user = useUserStore().user;
const projects = ref<Project[]>([])
const {isRefresh} = useRefreshData()

const {data, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})
const {data: issueData, refresh: issueRefresh} = await useCustomFetch(`/issues/`, {immediate: false})

onMounted(async () => {
  await refresh()
  await issueRefresh()
  projects.value = data.value as Project[]
  issueArray.value = issueData.value as Issue[]
  AssignedIssues.value = issueArray.value.filter((issue) => issue.assigned === user?.id)
  CreateIssues.value = issueArray.value.filter((issue) => issue.creator === user?.id)

});

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    await issueRefresh()
    issueArray.value = issueData.value as Issue[]
    AssignedIssues.value = issueArray.value.filter((issue) => issue.assigned === user?.id)
    CreateIssues.value = issueArray.value.filter((issue) => issue.creator === user?.id)
    await refresh()
    projects.value = data.value as Project[]
  }
});

</script>
<template>
  <div id="my_issue">
    <Navbar :user="user" :projects="projects"/>
    <div class="content">
      <div class="header">
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
          <ul>
            <li>
              <div>My Issue</div>
            </li>
            <li class="is-active">
              <div aria-current="page">{{ Title }}</div>
            </li>
          </ul>
        </nav>
        <div class="tabs is-toggle is-small">
          <ul>
            <li :class="{ 'is-active': viewMode === 'list' }" @click="viewMode = 'list'">
              <a>
                <font-awesome-icon icon="fa-solid fa-bars"/>
              </a>
            </li>
            <li :class="{ 'is-active': viewMode === 'kanban' }" @click="viewMode = 'kanban'">
              <a>
                <font-awesome-icon icon="fa-solid fa-grip-vertical"/>
              </a>
            </li>
            <li :class="{ 'is-active': viewMode === 'details' }" @click="viewMode = 'details'">
              <a>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#457b9d" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2.5" cy="4.5" r="1.5"/>
                  <circle cx="2.5" cy="8.5" r="1.5"/>
                  <circle cx="2.5" cy="12.5" r="1.5"/>
                  <rect x="6" y="3" width="11" height="11" rx="1"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="typeview-tabs">
        <div class="tabs is-toggle">
          <ul>
            <li :class="{ 'is-active': typeView === 'all' }" @click="typeView = 'all'; Title = 'All'">
              <a>All</a>
            </li>
            <li :class="{ 'is-active': typeView === 'created' }" @click="typeView = 'created'; Title = 'Created'">
              <a>Created</a>
            </li>
            <li :class="{ 'is-active': typeView === 'assigned' }" @click="typeView = 'assigned'; Title = 'Assigned'">
              <a>Assigned</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="issues">
        <div>
          <IssueList :issueArray="issueArray" :Projects="projects" :assignedIssue="AssignedIssues" :createdIssue="CreateIssues" :typeView="typeView" @isCreated="handleRefresh()"/>
        </div>
      </div>
    </div>
  </div>
</template>