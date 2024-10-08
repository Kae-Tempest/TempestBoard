<script setup lang="ts">
import {ref, watch} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Issue, Project, User} from "~/types/global";
import {useUserStore} from "~/stores/useUserStore";
import {useCustomFetch} from "~/composables/useCustomFetch";
import IssueList from "~/components/Issue/IssueList.vue";

useHead({title: 'Home - Tempest Board'})
const viewMode = ref("list");
const typeView = ref("all");
const Title = ref("All");

const issueArray = ref<Issue[]>([]);
const AssignedIssues = ref<Issue[]>([]);
const CreateIssues = ref<Issue[]>([]);

const user: User | null = useUserStore().getUser();
const users = ref<User[] | null>([])

const projects = ref<Project[]>([])

const {isRefresh} = useRefreshData()

const {data, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})
const {data: issueData, refresh: issueRefresh} = await useCustomFetch(`/my-issues/`, {immediate: false})
const {data: userList, refresh: userRefresh } = await useCustomFetch<User[]>(`/users/`)

onMounted(async () => {
  await refresh()
  await issueRefresh()
   await userRefresh()
  projects.value = data.value as Project[]

  issueArray.value = issueData.value as Issue[]
  AssignedIssues.value = issueArray.value.filter((issue) => issue.assigned.id === user?.id)
  CreateIssues.value = issueArray.value.filter((issue) => issue.creator.id === user?.id)

  users.value = userList.value
});

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    await issueRefresh()
    issueArray.value = issueData.value as Issue[]
    AssignedIssues.value = issueArray.value.filter((issue) => issue.assigned.id === user?.id)
    CreateIssues.value = issueArray.value.filter((issue) => issue.creator.id === user?.id)
    await refresh()
    projects.value = data.value as Project[]
    isRefresh.value = false
  }
});

</script>
<template>
  <div id="my_issue">
    <Navbar v-if="user" :user="user" :projects="projects"/>
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
        <div class="tabs is-small">
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
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
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
        <div class="tabs">
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
          <IssueList v-if="viewMode === 'list'" :issueArray="issueArray" :Projects="projects" :assignedIssue="AssignedIssues" :createdIssue="CreateIssues" :typeView="typeView" :users="users"/>
          <IssueKanban v-if="viewMode === 'kanban'" :issueArray="issueArray" :Projects="projects" :assignedIssue="AssignedIssues" :createdIssue="CreateIssues" :typeView="typeView"/>
        </div>
      </div>
    </div>
  </div>
</template>