<script setup lang="ts">
import {ref} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  priority: string
}

const props = defineProps<Props>()

const priorityValue = ref(0)
const priorityIcon = ['fa-solid fa-chevron-down', 'fa-solid fa-minus', 'fa-solid fa-pause', 'fa-solid fa-angles-up', 'fa-solid fa-circle-exclamation']
if (props.priority === 'MINOR') priorityValue.value = 0
if (props.priority === 'LOW') priorityValue.value = 1
if (props.priority === 'NEUTRAL') priorityValue.value = 2
if (props.priority === 'HIGH') priorityValue.value = 3
if (props.priority === 'URGENT') priorityValue.value = 4

</script>

<template>
  <div class="tooltip">
    <font-awesome-icon :icon="priorityIcon[priorityValue]" :rotation="priorityValue == 2 ? 90 : 0"/>
    <span class="tooltip-text">{{ priority.toLowerCase() }}</span>
  </div>
</template>
