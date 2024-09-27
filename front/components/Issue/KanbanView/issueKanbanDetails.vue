<script setup lang="ts">
import type {Issue, Project, States} from "~/types/global";
import {ref, watch} from "vue";
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  issueArray: Issue[];
  Projects: Project[];
  States: States[];
}

const props = defineProps<Props>()
const draggedItem = ref(0)
const showModal = ref(false);
const selectedState = ref("")

watch(() => showModal.value, (newVal) => {
  if (!newVal) selectedState.value = ""
})

const startDrag = (e: DragEvent, item: Issue) => {
  if (!e.dataTransfer) return;
  const target = e.target as HTMLElement;
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('itemID', item.id.toString());
  // Créer un aperçu personnalisé
  const clone = target.cloneNode(true) as HTMLElement;
  clone.classList.add('drag-clone')
  document.body.appendChild(clone);

  // Utiliser l'aperçu personnalisé
  e.dataTransfer.setDragImage(clone, e.offsetX, e.offsetY);

  draggedItem.value = item.id;

  // Supprimer le clone après un court délai pour qu'il ne soit pas visible
  setTimeout(() => document.body.removeChild(clone), 0);
}

const onDrop = async (e: DragEvent, state: string) => {
  if (!e.dataTransfer) return;
  draggedItem.value = -1
  const itemID = e.dataTransfer.getData('itemID');
  const item = props.issueArray.find(i => i.id.toString() === itemID);
  if (!item) return;
  item.status = state;
  await useCustomFetch(`/issues/${item.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({status: state}),
  });
}
</script>

<template>
  <div id="kanban">
    <CreateIssueModal :projects="Projects" v-model:modal="showModal" :state="selectedState"/>
    <div v-for="state in States" :key="state.name" class="state-list" @drop="onDrop($event, state.name)" @dragenter.prevent @dragover.prevent>
      <div class="header">
        <div class="state-name">{{ useCapitalize(state.name) }}</div>
        <div class="action-icon">
          <div class="button is-small">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-ellipsis"/>
            </span>
          </div>
          <div class="button is-small" @click="showModal=true; selectedState=state.name">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-plus"/>
            </span>
          </div>
        </div>
      </div>
      <div v-for="project in Projects" key="project.id" class="issue-list">
        <div v-for="issue in issueArray.filter(i => i.project === project.id).filter(i => i.status === state.name).sort((a,b) => a.ticket_id - b.ticket_id)"
             :key="issue.id" draggable="true" @dragstart="startDrag($event, issue)"
             class="issue-card" :class="{'dragging': draggedItem === issue.id}">
          <div class="issue">
            <div class="issue-title">{{ issue.title }}</div>
            <div class="issue-desc">
              <span v-html="issue.description"></span>
            </div>
            <div class="issue-footer">
              <span>{{ project.name.substring(0, 3).toUpperCase() }}-{{ issue.ticket_id }}</span>
              <div class="icon">
                <PriorityIcon :priority="issue.priority"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>