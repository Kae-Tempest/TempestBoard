<script setup lang="ts">

import {useCustomFetch} from "~/composables/useCustomFetch";
import type {Issue, Project} from "~/types/global";

const showSearchBar = defineModel()
const searchBarRef = ref<HTMLElement | null>(null)
const search = ref<string>("")
const issueList = ref<Issue[]>([])
const ProjectData = await useCustomFetch<Project[]>('/projects/')

onUnmounted(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showSearchBar.value = false
    }
  })
})

onMounted(async () => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showSearchBar.value = false
    }
  })
  issueList.value = await useCustomFetch<Issue[]>(`/my-issues/`)
})

watch(() => search.value, async (newVal) => {
  if (newVal) issueList.value = issueList.value?.filter(i => i.title.includes(newVal) || i.description.includes(newVal))
  if (newVal == "") issueList.value = await useCustomFetch<Issue[]>(`/my-issues/`)
})


</script>

<template>
  <div v-if="showSearchBar" id="searchbar" class="modal is-active" >
    <div class="modal-background" @click="showSearchBar = false"></div>
    <div class="searchbar" ref="searchBarRef">
      <input type="text" class="input" v-model="search">
      <div class="card-list">
        <div v-if="issueList && ProjectData" v-for="issue in issueList" class="card" :key="issue.id">
          <div class="wrapper" @click="navigateTo(`/issues/${issue.id}`)">
            <div class="head">
              <div class="left">
                <div>{{ issue.project_tag }} - {{ issue.ticket_id }}</div>
                <div>{{ issue.title }}</div>
              </div>
              <div class="right">
                <div>{{ issue.assigned.username }}</div>
                <div>{{ ProjectData.find(p => p.id === issue.project)?.name }}</div>
              </div>
            </div>
            <div v-html="issue.description" class="content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>
