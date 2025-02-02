<script setup lang="ts">
import type {Project, User} from "~/types/global";
import {reactive} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import TransferOwnerProjectModal from "~/components/Modals/user/TransferOwnerProjectModal.vue";
import ChangePasswordModal from "~/components/Modals/user/ChangePasswordModal.vue";

interface Props {
  user: User
}

type formType = {
  thumbnail: File | null,
  first_name: string,
  last_name: string,
  username: string,
  email: string
}

const props = defineProps<Props>()
const showProfileModal = defineModel()
const previewImage = ref<string>("")
const confirmDelete = ref<boolean>(false)
const projectModal = ref<Project | null>(null)
const userProjects = ref<Project[]>([])
const showModal = ref<boolean>(false)
const projectIndex = ref<number>(0)
const projectIsTransferred = ref<boolean>(false)
const showChangePasswordModal = ref<boolean>(false)
const userProject = ref<Project[]>()


onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showProfileModal.value = false
      if (previewImage.value) {
        URL.revokeObjectURL(previewImage.value)
      }
    }
  })
})

onMounted(() => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showProfileModal.value = false
      resetForm()
    }
  })
})

watch(() => showProfileModal.value, (newVal) => {
  if (newVal) {
    data.first_name = props.user.first_name
    data.last_name = props.user.last_name
    data.username = props.user.username
    data.email = props.user.email
  }
})

const resetForm = () => {
  data.thumbnail = null
  data.first_name = ""
  data.last_name = ""
  data.username = ""
  data.email = ""
}

const data = reactive<formType>({
  thumbnail: null,
  first_name: props.user.first_name,
  last_name: props.user.last_name,
  username: props.user.username,
  email: props.user.email
})

const handleSetThumb = (e: Event) => {
  const target = e.target
  if (target instanceof HTMLInputElement && target.files) {
    const file = target.files[0]
    data.thumbnail = file

    // Create a URL for the preview image
    if (previewImage.value) {
      URL.revokeObjectURL(previewImage.value)
    }
    previewImage.value = URL.createObjectURL(file)
  }
}

const handleUpdateProfile = async () => {
  const formData = new FormData()
  formData.append('first_name', data.first_name?.toString() || '')
  formData.append('last_name', data.last_name)
  formData.append('username', data.username)
  formData.append('thumbnail', data.thumbnail as Blob || '')
  formData.append('email', data.email)

  const res = await useCustomFetch<User>(`/users/${props.user.id}/`, {
    method: "patch",
    body: formData
  })

  if (res.error.value) return
  if (res.data.value) {
    useUserStore().setUser(res.data.value)
    showProfileModal.value = false
    resetForm()
    useRefreshData().isRefresh.value = true
  }
}

const handleDelete = async () => {
  userProject.value = await useCustomFetch<Project[]>(`/users/${props.user.id}/project/`)
  userProjects.value = userProject.value?.reverse() as Project[]
  if (userProject.value && userProject.value.length > 0) {
    showProfileModal.value = false
    showModal.value = true
    projectModal.value = userProjects.value[0]
    projectIndex.value++
  } else {
    await useCustomFetch(`/users/${props.user.id}/`, {
      method: "delete"
    })
    useUserStore().clearUser()
    navigateTo('/login')
  }
}

watch(() => projectIsTransferred.value, async (newVal) => {
  if (newVal) {
    if (userProjects.value.length >= projectIndex.value) {
      projectModal.value = userProjects.value[projectIndex.value]
      projectIndex.value++
      projectIsTransferred.value = false
    }
    if (userProjects.value.length < projectIndex.value) {
      showModal.value = false
      projectIsTransferred.value = false
      await useCustomFetch(`/users/${props.user.id}/`, {
        method: "delete"
      })
      useUserStore().clearUser()
      navigateTo('/login')
    }
  }
})

const handleOpenChangePasswordModal = () => {
  showProfileModal.value = false
  showChangePasswordModal.value = true
}

</script>

<template>
  <TransferOwnerProjectModal :project="projectModal" v-model="showModal" v-model:isTransferred="projectIsTransferred"/>
  <ChangePasswordModal v-model="showChangePasswordModal" :user="user"/>
  <div id="profile" v-if="user">
    <div :class="{'is-active': showProfileModal}" class="modal">
      <div class="modal-background" @click="showProfileModal = false"></div>
      <div class="modal-content">
        <div class="box">
          <div class="profile-header">
            <div class="header-top">
              <div class="user-info">
                <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="avatar"/>
                <img v-else src="assets/image/user.png" alt="user thumbnail" class="avatar"/>
                <div class="text-info">
                  <h2 class="name">{{ user.username }} {{ user.first_name !== "" ? "- " + user.first_name : "" }}
                    {{ user.last_name !== "" ? user.last_name : "" }}</h2>
                  <span class="email">{{ user.email }}</span>
                </div>
              </div>
              <div class="action-buttons">
                <button class="button is-warning" @click="handleOpenChangePasswordModal">change password</button>
              </div>
            </div>
          </div>

          <div class="edit-form">
            <div class="form-group">
              <label>Name</label>
              <div class="name-inputs">
                <input type="text" placeholder="First name" class="input" v-model="data.first_name"/>
                <input type="text" placeholder="Last name" class="input" v-model="data.last_name"/>
              </div>
            </div>

            <div class="form-group">
              <label>Email address</label>
              <input type="email" class="input" v-model="data.email"/>
            </div>

            <div class="form-group">
              <label>Username</label>
              <div class="username-input">
                <input type="text" class="input" v-model="data.username"/>
              </div>
            </div>

            <div class="form-group">
              <label>Profile photo</label>
              <div class="photo-upload">
                <div class="avatar">
                  <img v-if="previewImage" :src="previewImage" alt="">
                  <img v-else-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail"
                       class="dropdown-thumbnail"/>
                  <img v-else src="assets/image/user.png" alt="user thumbnail" class="dropdown-thumbnail"/>
                </div>
                <input class="input" type="file" name="resume" @input="handleSetThumb($event)"/>
              </div>
            </div>

            <div class="modal-actions">
              <div class="delete-btn">
                <button class="button is-danger" @click="confirmDelete = !confirmDelete">Delete user</button>
                <button class="button is-danger is-confirm" :class="{'is-display': confirmDelete}"
                        @click="handleDelete">
                <span class="icon">
                  <font-awesome-icon icon="fa-solid fa-trash"/>
                </span>
                </button>
              </div>
              <div class="right-actions">
                <button class="button" @click="resetForm(); showProfileModal=false">Cancel</button>
                <button class="button is-dark" @click="handleUpdateProfile">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>