<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import type {Project, User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";
import CreateProjectModal from "~/components/Modals/Project/CreateProjectModal.vue";
import {useUserStore} from "~/stores/useUserStore";
import EditProjectModal from "~/components/Modals/Project/EditProjectModal.vue";
import DeleteProjectModal from "~/components/Modals/Project/DeleteProjectModal.vue";
import ProjectSettingsModal from "~/components/Modals/Project/ProjectSettingsModal.vue";
import SearchBar from "~/components/SearchBar.vue";

useHead({title: 'Project - Tempest Board'})

let user: User | null = useUserStore().getUser;
const projects = ref<Project[]>([]);
const {data, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})

const showSearchBar = ref<boolean>(false)
const showCreateModal = ref(false)
const showEditModal = ref<Boolean>(false)
const showDeleteModal = ref<Boolean>(false)
const showSettingsModal = ref<Boolean>(false)
const selectedProject = ref<Project | null>(null)


const {isRefresh} = useRefreshData()

onMounted(async () => {
  await refresh()
  if(data.value) {
    projects.value = data.value as Project[]
  } else {
    await refresh()
    if(data.value) projects.value = data.value as Project[]
  }
})

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    await refresh()
    projects.value = data.value as Project[]
    user = useUserStore().getUser
    isRefresh.value = false
  }
});

</script>
<template>
  <div id="project">
    <SearchBar v-model="showSearchBar"/>
    <Navbar v-if="user" :user="user" :projects="projects" v-model="showSearchBar"/>
    <header>
      <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
        <ul>
          <li>Projects</li>
        </ul>
      </nav>
      <button class="add-project" @click="showCreateModal=true">New Project</button>
    </header>
    <div class="content">
      <div>
        <!--   Modals   -->
        <CreateProjectModal v-model="showCreateModal"/>
        <DeleteProjectModal v-if="selectedProject" :project="selectedProject" v-model="showDeleteModal"/>
        <EditProjectModal v-if="selectedProject" :project="selectedProject" v-model="showEditModal"/>
        <ProjectSettingsModal v-if="selectedProject" :project="selectedProject" v-model="showSettingsModal"/>
        <!--   Project List   -->
        <div v-for="project in projects.sort((p, p2) => p.id - p2.id)">
          <CardProjectCard v-if="user" :project="project" :user="user" v-model:edit="showEditModal" v-model:delete="showDeleteModal" v-model:settings="showSettingsModal"
                           v-model:selectedProject="selectedProject"/>
        </div>
      </div>
    </div>
  </div>
</template>