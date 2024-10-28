<script setup lang="ts">
import type {MileStone} from "~/types/global";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

interface Props {
  milestone: MileStone
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement | null>(null)

// Use the dropdown state composable
const {activeDropdownId, toggleDropdown, closeDropdown} = useDropdownState()

// Computed property to check if this dropdown is open
const isDropdownOpen = computed(() => activeDropdownId.value === props.milestone.id)

// Add click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Prevent dropdown from closing when clicking inside
const handleDropdownClick = (event: Event) => {
  event.stopPropagation()
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
            <font-awesome-icon icon="fa-regular fa-trash-can" @click=""/>
          </div>
          <div class="item-menu">
            <font-awesome-icon icon="fa-regular fa-pen" @click=""/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
