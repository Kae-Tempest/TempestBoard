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

useHead({title: 'Home - Tempest Board'})
const user: User | null = useUserStore().getUser;
const projects = ref<Project[]>([])
const {isRefresh} = useRefreshData()
const route = useRoute()
const openModal = ref<boolean>(false)
const openEditModal = ref<boolean>(false)
const editMilestoneID = ref<number>(0)

const {data, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})
const {data: Milestones, refresh: refreshMilestone} = await useCustomFetch<MileStone[]>(`/projects/${route.params.id}/milestones`)

onMounted(async () => {
  await refresh()
  await refreshMilestone()
  projects.value = data.value as Project[]
});

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    await refresh()
    projects.value = data.value as Project[]
    isRefresh.value = false
  }
});

</script>
<template>
  <div id="release">
    <CreateMilestoneModal v-model:modal="openModal" :project="route.params.id[0]"/>
    <EditMilestoneModal v-model:modal="openEditModal" :milestoneID="editMilestoneID"/>
    <Navbar v-if="user" :user="user" :projects="projects"/>
    <div class="content">
      <header>
        <div class="title">Release</div>
        <div class="action">
          <div class="select">
            <select name="state" id="state" class="state">
              <option disabled value="">State</option>
              <option value="open">Open</option>
              <option value="publish">Publish</option>
              <option value="unpublish">Unpublish</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div class="search">
            <input type="text" class="input" placeholder="Search Version">
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
            <tr v-for="milestone in Milestones" :key="milestone.id">
              <td class="is-center">{{ milestone.name }}</td>
              <td>{{ useCapitalize(milestone.status) }}</td>
              <td class="is-center">{{ new Date(milestone.start_date).toISOString().substring(0, 10) }}</td>
              <td class="advancement">
                <ReleaseAdvancementBar :milestone="milestone"/>
              </td>
              <td class="is-center">{{ new Date(milestone.delivery_date).toISOString().substring(0, 10) }}</td>
              <td class="is-center">{{ milestone.description || "No Description" }}</td>
              <td class="is-center action-menu">
                <ReleaseMenu :milestone="milestone" v-model="openEditModal" v-model:milestoneID="editMilestoneID"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>