<script setup lang="ts">
import type {MileStone} from "~/types/global";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  milestone: MileStone
}

const props = defineProps<Props>()
const showModal = defineModel()
const milestoneID = defineModel('milestoneID')
const dropdownRef = ref<HTMLElement | null>(null)
const {activeDropdownId, toggleDropdown, closeDropdown} = useDropdownState()
const isDropdownOpen = computed(() => activeDropdownId.value === props.milestone.id)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleDropdownClick = (event: Event) => {
  event.stopPropagation()
}

const handleDeleteMilestone = async () => {
  await useCustomFetch(`/milestones/${props.milestone.id}/`,{
    method: 'delete'
  })
  useRefreshData().isRefresh.value = true
}
</script>

<template>
  <div class="action">
    <div class="dropdown is-right" :class="{ 'is-active': isDropdownOpen }" ref="dropdownRef" @click="handleDropdownClick">
      <div class="dropdown-trigger">
        <button class="button is-small" @click="toggleDropdown(milestone.id)">
          <span class="icon is-small">
            <font-awesome-icon icon="fa-solid fa-ellipsis"/>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="isDropdownOpen">
        <div class="dropdown-content">
          <div class="item-menu">
            <font-awesome-icon icon="fa-regular fa-trash-can" @click="handleDeleteMilestone"/>
          </div>
          <div class="item-menu">
            <font-awesome-icon icon="fa-regular fa-pen" @click="showModal = true; milestoneID = milestone.id"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
