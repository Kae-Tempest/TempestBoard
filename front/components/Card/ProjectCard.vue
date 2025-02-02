<script setup lang="ts">

import type {Project, User} from "~/types/global";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  project: Project
  user: User
}

const props = defineProps<Props>()

const showEditModal = defineModel('edit')
const showDeleteModal = defineModel('delete')
const showSettingsModal = defineModel('settings')
const selectedProject = defineModel('selectedProject')

const handleOpenEditModal = (project: Project) => {
  selectedProject.value = project
  showEditModal.value = true
}

const handleOpenDeleteModal = (project: Project) => {
  selectedProject.value = project
  showDeleteModal.value = true
}

const handleOpenSettingsModal = (project: Project) => {
  selectedProject.value = project
  showSettingsModal.value = true
}

const handleLeaveProject = async (project: Project) => {
  await useCustomFetch(`/projects/${project.id}/leave/${props.user.id}/`, {
    method: "DELETE",
  })
  useRefreshData().isRefresh.value = true
}

</script>

<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <img v-if="project?.thumbnail" :src="project.thumbnail" alt="Placeholder image"/>
        <div v-else></div>
      </div>
      <div class="content">
        <h2>{{ project.name }}</h2>
        <p>{{ project.description }}</p>
        <div class="content-footer">
          <div class="btn-action">
            <button v-if="user?.id == project.creator" class="button" @click="handleOpenDeleteModal(project)">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-trash-can"/>
              </span>
            </button>
            <button v-if="user?.id == project.creator" class="button" @click="handleOpenEditModal(project)">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-pen"/>
              </span>
            </button>
            <button v-if="user?.id == project.creator" class="button" @click="handleOpenSettingsModal(project)">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-gear"/>
              </span>
            </button>
            <button v-if="user?.id != project.creator" class="button" @click="handleLeaveProject(project)">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-trash-can"/>
              </span>
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
</template>