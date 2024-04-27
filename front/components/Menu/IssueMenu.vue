<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import DeleteIssueModal from "~/components/Modals/issue/deleteIssueModal.vue";
import EditIssueModal from "~/components/Modals/issue/editIssueModal.vue";

interface Props {
  id: number | null
  pos: { x: number, y: number }
}

const props = defineProps<Props>();
const showModal = ref(false);
const showEditModal = ref(false);

</script>

<template>
  <deleteIssueModal :issueId="id" v-model="showModal"/>
  <editIssueModal :issueId="id" v-model="showEditModal"/>
  <div class="menu">
    <div class="menu-content" :style="{'left': pos.x - 70 + 'px', 'bottom': `calc(-${pos.y}px + 120px)`}">
      <div class="menu-item" @click="showEditModal = true">
        <font-awesome-icon icon="fa-regular fa-pencil"/>
      </div>
      <div class="menu-item" @click="showModal = true">
        <font-awesome-icon icon="fa-regular fa-trash-can"/>
      </div>
      <div class="menu-item" @click="navigateTo(`/issues/${props.id}`)">
        <font-awesome-icon icon="fa-solid fa-eyes"/>
      </div>
    </div>
  </div>
</template>