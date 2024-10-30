<script setup lang="ts">

import {useCustomFetch} from "~/composables/useCustomFetch";
import type {Issue, Project} from "~/types/global";

const showSearchBar = defineModel()
const searchBarRef = ref<HTMLElement | null>(null)
const search = ref<string>("")
const issueList = ref<Issue[]>([])
const {data: issueData, refresh: issueRefresh} = await useCustomFetch<Issue[]>(`/my-issues/`)
const {data: ProjectData, refresh} = await useCustomFetch<Project[]>('/projects/', {immediate: false})

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
  await issueRefresh()
  await refresh()
  issueList.value = issueData.value as Issue[]
})

watch(() => search.value, (newVal) => {
  if (newVal) issueList.value = issueData.value?.filter(i => i.title.includes(newVal)) as Issue[]
})


</script>

<template>
  <div v-if="showSearchBar" id="searchbar" class="modal is-active" >
    <div class="modal-background" @click="showSearchBar = false"></div>
    <div class="searchbar" ref="searchBarRef">
      <input type="text" class="input" v-model="search">
      <div class="card-list">
        <div v-if="search !== '' && issueList && ProjectData" v-for="issue in issueList" class="card" :key="issue.id">
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
