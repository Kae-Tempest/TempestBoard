<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";

interface Props {
  Projects: Project[]
  issueArray: Issue[]
}

defineProps<Props>()
const IssueInfo = defineModel<{issue: Issue, project: Project} | null>()


const handleSetIssue = (issue: Issue, project: Project) => {
  if (IssueInfo.value?.issue.id !== issue.id) {
    IssueInfo.value = { issue: issue, project: project }
  } else return IssueInfo.value
}

</script>

<template>
  <div v-for="project in Projects" key="project.id" class="issue-list">
    <div v-for="issue in issueArray.filter(i => i.project === project.id).sort((a,b) => a.ticket_id - b.ticket_id)" :key="issue.id" class="issue-card">
      <div class="issue" :class="{'is-active': issue.id === IssueInfo?.issue.id}" @click="handleSetIssue(issue, project)">
        <div class="issue-title">{{ issue.title }}</div>
        <div class="issue-desc"><span v-html="issue.description"></span></div>
        <div class="issue-footer">
          <span>{{ project.name.substring(0, 3).toUpperCase() }}-{{ issue.ticket_id }}</span>
          <div class="icon"><PriorityIcon :priority="issue.priority"/></div>
        </div>
      </div>
    </div>
  </div>
</template>
