<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";

interface Props {
  Projects: Project[]
  issueArray: Issue[]
}

defineProps<Props>()
const IssueInfo = defineModel<{issue: Issue, project: Project} | null>()


const handleSetIssue = async (issue: Issue, projectID: number) => {
  if (IssueInfo.value?.issue.id !== issue.id) {
    const {data: project} = await useCustomFetch<Project>(`projects/${projectID}`)
    if(!project.value) return
    IssueInfo.value = { issue: issue, project: project.value }
  } else return IssueInfo.value
}

</script>

<template>
  <div class="issue-list">
    <div v-for="issue in issueArray.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())" :key="issue.id" class="issue-card">
      <div class="issue" :class="{'is-active': issue.id === IssueInfo?.issue.id}" @click="handleSetIssue(issue, issue.project)">
        <div class="issue-title">{{ issue.title }}</div>
        <div class="issue-desc"><span v-html="issue.description"></span></div>
        <div class="issue-footer">
          <span>{{ issue.project_tag }}-{{ issue.ticket_id }}</span>
          <div class="icon"><PriorityIcon :priority="issue.priority"/></div>
        </div>
      </div>
    </div>
  </div>
</template>
