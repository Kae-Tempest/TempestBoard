<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Project, User} from "~/types/global";
import MenuProject from "~/components/Menu/MenuProject.vue";
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";
import ProfileModal from "~/components/Modals/user/ProfileModal.vue";
import {navigateTo} from "#imports";

interface Props {
  user: User
  projects: Project[]
}

const props = defineProps<Props>()
const showSearchBar = defineModel()

const isDropDownOpen = ref<boolean>(false);
const isShowModal = ref<boolean>(false)
const showProfileModal = ref<boolean>(false)

const { isDark } = useSystemTheme()

onMounted(async () => {
  document.addEventListener('click', () => isDropDownOpen.value = false)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', () => isDropDownOpen.value = false)
})

const logout = async () => {
  await useCustomFetch('/logout/')
  navigateTo('/login')
}


const returntoHome = () => {
  navigateTo('/')
}

</script>

<template>
  <CreateIssueModal :projects="projects" v-model:modal="isShowModal"/>
  <ProfileModal :user="user" v-model="showProfileModal"/>
  <div id="navbar">
    <div>
      <div>
        <img v-if="!isDark" onclick="returntoHome()" src="assets/image/icon_dark.png" alt="Icon app" />
        <img v-if="isDark" onclick="returntoHome()" src="assets/image/icon_white.png" alt="Icon app" />
        <div :class="{'is-active' : isDropDownOpen}" class="dropdown is-right">
          <div class="dropdown-trigger" aria-controls="user-menu" aria-haspopup="true" @click.stop="isDropDownOpen = !isDropDownOpen">
            <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="dropdown-thumbnail"/>
            <img v-else-if="!isDark" src="assets/image/user.png" alt="user thumbnail" class="dropdown-thumbnail"/>
            <img v-else-if="isDark" src="assets/image/user_light.png" alt="user thumbnail" class="dropdown-thumbnail"/>
          </div>
          <div class="dropdown-menu" id="user-menu">
            <div class="dropdown-content">
              <ul>
                <li @click="showProfileModal = true">
                  Profile
                </li>
                <NuxtLink to="/project">
                  <li>
                    Project
                  </li>
                </NuxtLink>
                <li @click="logout()">
                  <button>
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
      <button @click="showSearchBar = true;">
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

