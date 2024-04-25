<script setup lang="ts">

import type {Issue, Project} from "~/types/global";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";

interface Props {
  issues: Issue[];
  projects: Project[];
  state: string;
}

const props = defineProps<Props>();

const startDrag = (e: DragEvent, item: Issue) => {
  if (!e.dataTransfer) return;
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('itemID', item.id.toString());
}

const onDrop = async (e: DragEvent, state: string) => {
  if (!e.dataTransfer) return;
  const itemID = e.dataTransfer.getData('itemID');
  const item = props.issues.find(i => i.id.toString() === itemID);
  if (!item) return;
  item.status = state;
  await useCustomFetch(`/issues/${item.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({status: state}),
  });
}

</script>

<template>
  <div @drop="onDrop($event, state)" @dragenter.prevent @dragover.prevent @click="Menu = !Menu">
    <div v-for="issue in issues.filter(i => i.status === state).sort((a,b) => a.ticket_id - b.ticket_id)" :key="issue.id" draggable="true" @dragstart="startDrag($event, issue)"
         @click="handleMenu(issue, $event)">
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
            <div class="project-content">
              <div class="tag">{{ project.name }}</div>
              <div>{{ new Date(issue.created_at).toLocaleString('en-GB', {day: 'numeric', month: "short"}) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="issues.filter(i => i.status === state).length === 0" class="issue-list">
      <p class="placeholder-issue-list">drop here...</p>
    </div>
  </div>
</template>