<script setup lang="ts">
import {ref} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  priority: string
}

const props = defineProps<Props>()

const priorityValue = ref(0)
const priorityIcon = ['fa-solid fa-chevron-down', 'fa-solid fa-minus', 'fa-solid fa-pause', 'fa-solid fa-angles-up', 'fa-solid fa-circle-exclamation']

const updateIcon = (priority: string) => {
  if (priority === 'Minor') priorityValue.value = 0
  if (priority === 'Low') priorityValue.value = 1
  if (priority === 'Neutral') priorityValue.value = 2
  if (priority === 'High') priorityValue.value = 3
  if (priority === 'Urgent') priorityValue.value = 4
}

onMounted(() => {
  updateIcon(useCapitalize(props.priority))
})

watch(() => props.priority, (newVal) => {
  if(newVal) updateIcon(useCapitalize(newVal))
})

</script>

<template>
  <div class="tooltip">
    <font-awesome-icon :icon="priorityIcon[priorityValue]" :rotation="priorityValue == 2 ? 90 : undefined"/>
    <span class="tooltip-text">{{ priority.toLowerCase() }}</span>
  </div>
</template>
