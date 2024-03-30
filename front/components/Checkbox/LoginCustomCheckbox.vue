<script setup lang="ts">

interface Props {
  label: string;
}

defineProps<Props>()
const isCheck = defineModel()


</script>

<template>
  <div id="checkbox">
    <input
        type="checkbox"
        name="remember"
        @click="isCheck = !isCheck"
    />
    <svg
        :class="{'is-active': isCheck}"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <label className="ml-2">{{ label }}</label>
  </div>
</template>
