<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Project, User} from "~/types/global";
import MenuProject from "~/components/Menu/MenuProject.vue";
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";

interface Props {
  user: User
  projects: Project[]
}

const props = defineProps<Props>()

const isDropDownOpen = ref(false);
const isShowModal = ref(false)
const thumbnail = ref('')

onMounted(() => {
  document.addEventListener('click', () => isDropDownOpen.value = false)
  if (props.user.thumbnail) {
    thumbnail.value = props.user.thumbnail
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', () => isDropDownOpen.value = false)
})


const logout = async () => {
  await useCustomFetch('/logout/', {
    method: 'GET'
  })
  navigateTo('/login')
}


</script>

<template>
  <CreateIssueModal :projects="projects" v-model:modal="isShowModal"/>
  <div id="navbar">
    <div>
      <div>
        <img src="https://placehold.co/30" alt=""/>
        <h1>
          <NuxtLink to="/">Tempest Board</NuxtLink>
        </h1>
        <div :class="{'is-active' : isDropDownOpen}" class="dropdown is-right">
          <div class="dropdown-trigger" aria-controls="user-menu" aria-haspopup="true" @click.stop="isDropDownOpen = !isDropDownOpen">
            <img v-if="thumbnail" :src="thumbnail" alt="user thumbnail" class="dropdown-thumbnail"/>
            <img v-else src="assets/image/user.png" alt="user thumbnail" class="dropdown-thumbnail"/>
          </div>
          <div class="dropdown-menu" id="user-menu">
            <div class="dropdown-content">
              <ul>
                <li>
                  <NuxtLink to="#">Profile</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="#">Settings</NuxtLink>
                </li>
                <NuxtLink to="/project"><li>
                  Project
                </li></NuxtLink>
                <li>
                  <button @click="logout()">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button @click="isShowModal = true">
        <font-awesome-icon icon="fa-solid fa-pen-to-square"/>
        New Issue
      </button>
      <button>
        <font-awesome-icon icon="fa-solid fa-magnifying-glass"/>
      </button>
    </div>

    <nav>
      <ul>
        <li class="is-active">
          <NuxtLink to="/">My Issues</NuxtLink>
        </li>

        <li v-for="project in projects">
          <MenuProject :project="project"/>
        </li>
      </ul>
    </nav>
  </div>
</template>

