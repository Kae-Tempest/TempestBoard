<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Project} from "~/types/global";

interface Props {
  project: Project
}

defineProps<Props>()

const isMenuOpen = ref(true)

</script>

<template>
  <div class="menu is-menu">
    <div class="menu-list">
      <div class="menu-button" @click="isMenuOpen = !isMenuOpen">
        <span class="">{{ project.name }}</span>
        <font-awesome-icon icon="fa-solid fa-chevron-right" :class="{'is-menu-open': isMenuOpen}"/>
      </div>
      <div class="is-menu-list" :class="{'is-menu-close': !isMenuOpen}">
        <ul class="menu-list">
          <li>
            <span>Issues</span>
            <ul>
              <li>
                <NuxtLink :to="{ name: 'projects-id-active' , params: { id: project.id }}">Active</NuxtLink>
              </li>
              <li>
                <NuxtLink :to="{ name: 'projects-id-backlog' , params: { id: project.id }}">Backlog</NuxtLink>
              </li>
            </ul>
          </li>
          <li>
            <NuxtLink :to="{ name: 'projects-id-release' , params: { id: project.id }}">Releases</NuxtLink>
          </li>
          <li>
            <span>Repos</span>
            <ul>
              <li>
                <NuxtLink to="#">Pull Requests</NuxtLink>
              </li>
              <li>
                <NuxtLink to="#">Issues</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>