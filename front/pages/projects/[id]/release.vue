<script setup lang="ts">
import {ref, watch} from "vue";
import type {MileStone, Project, User} from "~/types/global";
import {useUserStore} from "~/stores/useUserStore";
import {useCustomFetch} from "~/composables/useCustomFetch";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import CreateMilestoneModal from "~/components/Modals/milestone/CreateMilestoneModal.vue";
import ReleaseMenu from "~/components/Menu/ReleaseMenu.vue";
import ReleaseAdvancementBar from "~/components/Bars/ReleaseAdvancementBar.vue";
import EditMilestoneModal from "~/components/Modals/milestone/EditMilestoneModal.vue";
import SearchBar from "~/components/SearchBar.vue";
import DeleteMilestoneModal from "~/components/Modals/milestone/DeleteMilestoneModal.vue";

useHead({title: 'Home - Tempest Board'})
let user: User | null = useUserStore().getUser;
const projects = ref<Project[]>([])
const {isRefresh} = useRefreshData()
const route = useRoute()
const openModal = ref<boolean>(false)
const openEditModal = ref<boolean>(false)
const openDeleteModal = ref<boolean>(false)
const MilestoneID = ref<number>(0)
const MilestonesList = ref<MileStone[]>([])
const InitialMilestonesList = ref<Milestones[]>([])
const StateFilter = ref<string>("all")
const MilestoneSearch = ref<string>("")
const showSearchBar = ref<boolean>(false)

onMounted(async () => {
  projects.value = await useCustomFetch<Project[]>('/projects/')
  MilestonesList.value = await useCustomFetch<MileStone[]>(`/projects/${route.params.id}/milestones`)
  InitialMilestonesList.value = MilestonesList.value
});

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    projects.value = await useCustomFetch<Project[]>('/projects/')
    MilestonesList.value = await useCustomFetch<MileStone[]>(`/projects/${route.params.id}/milestones`)
    user = useUserStore().getUser;
    isRefresh.value = false
  }
});

watch(() => StateFilter.value, (newVal) => {
  if (newVal === "all" && InitialMilestonesList.value) {
    StateFilter.value = "all"
    MilestonesList.value = InitialMilestonesList.value
  }
  if (newVal !== "all" && InitialMilestonesList.value) {
    MilestonesList.value = InitialMilestonesList.value.filter(m => m.status === newVal)
  }
})

watch(() => MilestoneSearch.value, (newVal) => {
  if (newVal && InitialMilestonesList.value) {
    MilestonesList.value = InitialMilestonesList.value.filter(m => m.name.includes(newVal))
  } else if (MilestonesList.value) MilestonesList.value = InitialMilestonesList.value
})

</script>
<template>
  <div id="release">
    <CreateMilestoneModal v-model:modal="openModal" :project="route.params.id"/>
    <EditMilestoneModal v-model:modal="openEditModal" :milestoneID="MilestoneID"/>
    <DeleteMilestoneModal v-model:modal="openDeleteModal" :milestoneID="MilestoneID"/>
    <SearchBar v-model="showSearchBar"/>
    <Navbar v-if="user" :user="user" :projects="projects" v-model="showSearchBar"/>
    <div class="content">
      <header>
        <div class="title">Release</div>
        <div class="action">
          <div class="select">
            <select name="state" id="state" class="state" v-model="StateFilter">
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="publish">Publish</option>
              <option value="unpublish">Unpublish</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div class="search">
            <input type="text" class="input" placeholder="Search Version" v-model="MilestoneSearch">
            <button class="button">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass"/>
              </span>
            </button>
          </div>
          <div class="create">
            <button class="button" @click="openModal = true">
              <span>Create</span>
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus"/>
              </span>
            </button>
          </div>
        </div>
      </header>
      <div class="hero">
        <table class="table is-striped is-hoverable">
          <thead>
          <tr>
            <th scope="col" class="is-tiny">Version</th>
            <th scope="col" class="is-tiny">State</th>
            <th scope="col" class="is-small">Start Date</th>
            <th scope="col">Advancement</th>
            <th scope="col" class="is-small">Delivery Date</th>
            <th scope="col">Description</th>
            <th scope="col" class="is-tiny">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="milestone in MilestonesList" :key="milestone.id">
            <td class="is-center">{{ milestone.name }}</td>
            <td>{{ useCapitalize(milestone.status) }}</td>
            <td class="is-center">{{ new Date(milestone.start_date).toISOString().substring(0, 10) }}</td>
            <td class="advancement">
              <ReleaseAdvancementBar :milestone="milestone"/>
            </td>
            <td class="is-center">{{ new Date(milestone.delivery_date).toISOString().substring(0, 10) }}</td>
            <td class="is-center">{{ milestone.description || "No Description" }}</td>
            <td class="is-center action-menu">
              <ReleaseMenu :milestone="milestone" v-model="openEditModal" v-model:deleteModal="openDeleteModal" v-model:milestoneID="MilestoneID"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>