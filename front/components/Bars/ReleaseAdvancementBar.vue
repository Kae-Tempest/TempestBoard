<script setup lang="ts">
import type {MileStone} from "~/types/global";

interface Props {
  milestone: MileStone
}

type Advancement = {
  backlog_issues: number;
  active_issues: number;
  completed_issues: number;
}

const props = defineProps<Props>()

const {data, refresh} = await useCustomFetch<Advancement>(`/projects/${props.milestone.project}/advancement/${props.milestone.id}/`)


onMounted(async () => {
  await refresh()
  if (!data.value) return

  const backlogDiv: HTMLElement | null = document.getElementById('backlog');
  const activeDiv: HTMLElement | null = document.getElementById('active');
  const completedDiv: HTMLElement | null = document.getElementById('completed');

  if (!backlogDiv || !activeDiv || !completedDiv) return

  const allCount = data.value.backlog_issues + data.value.active_issues + data.value.completed_issues
  let backlogSize: number
  let activeSize: number
  let completedSize: number


  if (allCount !== 0) {
    backlogSize = data.value.backlog_issues / allCount * 100
    activeSize = data.value.active_issues / allCount * 100
    completedSize = data.value.completed_issues / allCount * 100
    backlogDiv.style.borderBottomRightRadius = "0"
    backlogDiv.style.borderTopRightRadius = "0"
  } else {
    backlogSize = 0
    activeSize = 0
    completedSize = 0
  }
  
  backlogDiv.style.width = backlogSize + "%"
  activeDiv.style.width = activeSize + "%"
  activeDiv.style.display = "block"
  completedDiv.style.width = completedSize + "%"
  completedDiv.style.display = "block"

})


</script>

<template>
  <div class="advancement-bar">
    <div id="backlog" class="backlog"></div>
    <div id="active" class="active"></div>
    <div id="completed" class="completed"></div>
  </div>
</template>
