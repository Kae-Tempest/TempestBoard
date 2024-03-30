<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {useUserStore} from "~/stores/useUserStore";
import type {Project} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import DeleteProjectModal from "~/components/Modals/Project/DeleteProjectModal.vue";
import CreateProjectModal from "~/components/Modals/Project/CreateProjectModal.vue";
import EditProjectModal from "~/components/Modals/Project/EditProjectModal.vue";

const user = useUserStore().getUser();
const projects = ref<Project[]>([]);
const {data, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})
const selectedProject = ref<Project | null>(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const {isRefresh} = useRefreshData()

onMounted(async () => {
  await refresh()
  projects.value = data.value as Project[]
})

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    await refresh()
    projects.value = data.value as Project[]
    isRefresh.value = false
  }
});

const handleOpenEditModal = (project: Project) => {
  selectedProject.value = project
  showEditModal.value = true
}

const handleOpenDeleteModal = (project: Project) => {
  selectedProject.value = project
  showDeleteModal.value = true
}

</script>
<template>
  <div id="project">
    <Navbar :user="user" :projects="projects"/>
    <header>
      <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
        <ul>
          <li>Projects</li>
        </ul>
      </nav>
      <button class="add-project" @click="showCreateModal=true">New Project</button> <!-- Open Creation Modal -->
    </header>
    <div class="content">
      <div>
        <!--   Modals   -->
        <CreateProjectModal v-model="showCreateModal"/>
        <DeleteProjectModal :project="selectedProject" v-model="showDeleteModal"/>
        <EditProjectModal :project="selectedProject" v-model="showEditModal"/>
        <!--   Project List   -->
        <div v-for="project in projects">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <img v-if="project?.thumbnail" :src="project.thumbnail" alt="Placeholder image"/>
                </div>
                <div class="media-content">
                  <h2>{{ project.name }}</h2>
                </div>
              </div>
              <div class="content">
                <p class="">{{ project.description }}</p>
                <div class="content-footer">
                  <div class="btn-action">
                    <button class="del" @click="handleOpenDeleteModal(project)"> <!-- Delete Modal -->
                      <font-awesome-icon icon="fa-solid fa-trash-can"/>
                    </button>
                    <button class="edit" @click="handleOpenEditModal(project)"> <!-- Edit Modal -->
                      <font-awesome-icon icon="fa-solid fa-pen"/>
                    </button>
                  </div>
                  <div class="date">
                    <time dateTime="2016-1-1">Created: {{ new Date(project.created_at).toLocaleString('en-GB', {day: 'numeric', month: "short", year: "numeric"}) }}</time>
                    <time dateTime="2016-1-1">Updated: {{ new Date(project.updated_at).toLocaleString('en-GB', {day: 'numeric', month: "short", year: "numeric"}) }}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>