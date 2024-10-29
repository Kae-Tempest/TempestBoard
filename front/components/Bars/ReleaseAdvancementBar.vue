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
const advancementData = ref<Advancement>()
let backlogDiv: HTMLElement | null
let activeDiv: HTMLElement | null
let completedDiv: HTMLElement | null

onMounted(async () => {

  const {data} = await useCustomFetch<Advancement>(`/projects/${props.milestone.project}/advancement/${props.milestone.id}/`)
  advancementData.value = data.value as Advancement
  await updateBar()
})

watch(() => props.milestone, async (newVal) => {
  if(newVal) {

    const {data} = await useCustomFetch<Advancement>(`/projects/${props.milestone.project}/advancement/${props.milestone.id}/`)
    advancementData.value = data.value as Advancement
    await updateBar()
  }
})

const updateBar = async () => {
  backlogDiv = document.getElementById('backlog');
  activeDiv = document.getElementById('active');
  completedDiv = document.getElementById('completed');
  if (!backlogDiv || !activeDiv || !completedDiv) return
  if (!advancementData.value) return

  const allCount = advancementData.value.backlog_issues + advancementData.value.active_issues + advancementData.value.completed_issues
  let backlogSize: number
  let activeSize: number
  let completedSize: number


  if (allCount !== 0) {
    backlogSize = advancementData.value.backlog_issues / allCount * 100
    activeSize = advancementData.value.active_issues / allCount * 100
    completedSize = advancementData.value.completed_issues / allCount * 100
    backlogDiv.style.borderBottomRightRadius = "0"
    backlogDiv.style.borderTopRightRadius = "0"
    backlogDiv.style.width = backlogSize + "%"
    activeDiv.style.width = activeSize + "%"
    completedDiv.style.width = completedSize + "%"
  } else if(isNaN(allCount)) {
    backlogSize = 0
    activeSize = 0
    completedSize = 0
    backlogDiv.style.width = backlogSize + "%"
    activeDiv.style.width = activeSize + "%"
    completedDiv.style.width = completedSize + "%"
  }


  backlogDiv.style.display = "block"
  activeDiv.style.display = "block"
  completedDiv.style.display = "block"


}



</script>

<template>
  <div class="advancement-bar">
    <div id="backlog" class="backlog"></div>
    <div id="active" class="active"></div>
    <div id="completed" class="completed"></div>
  </div>
</template>
