<script setup lang="ts">

import type {Issue, Project, User} from "~/types/global";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";

interface Props {
  issue: Issue;
  projects: Project[];
}

const props = defineProps<Props>();
const user = ref<User | null>(null);
onMounted(async () => {
  const {data} = await useCustomFetch<User>(`/users/${props.issue.assigned}/`);
  user.value = data.value;
});

</script>

<template>
  <div class="issue-list">
    <div v-for="project in projects.filter(p => p.id === issue.project)">
      <div class="issue-info">
        <div class="issue-content">
          <div class="priority">
            <PriorityIcon :priority="issue.priority"/>
          </div>
          <div class="tag-number">
            {{ project.name.substring(0, 3).toUpperCase() }}-{{ issue.ticket_id }}
          </div>
          <div class="title-issue">{{ issue.title }}</div>
        </div>
        <div>
          <div class="user-tag">
            {{ user?.username }}
          </div>
          <div class="project-content">
            <div class="tag">{{ project.name }}</div>
            <div>{{ new Date(issue.created_at).toLocaleString('en-GB', {day: 'numeric', month: "short"}) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>