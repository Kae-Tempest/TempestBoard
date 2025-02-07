<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Comment, User} from '~/types/global';
import {useDayjs} from "#dayjs";

const dayjs = useDayjs()

interface Props {
  answer: Comment
  comment: Comment
}

const props = defineProps<Props>()
const showResponseMenu = ref<Boolean>(false)
const user = ref<User | null>(null)
const {isRefresh} = useRefreshData()
const isResponseSend = defineModel()
const isEditing = ref<Boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Use the dropdown state composable
const { activeDropdownId, toggleDropdown, closeDropdown } = useDropdownState()

// Computed property to check if this dropdown is open
const isDropdownOpen = computed(() => activeDropdownId.value === props.answer.id)

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

onMounted(async () => {
  user.value = await useCustomFetch<User>(`/users/${props.answer.user}`)
})

const editedData = reactive({
  content: props.comment.content
})

const handleDeleteComment = async () => {
  await useCustomFetch(`/comments/${props.comment.id}/`, {
    method: 'DELETE',
  })
  isRefresh.value = true
  isResponseSend.value = true
}

const handleEditComment = async () => {
  showResponseMenu.value = false
  if (!isEditing.value) isEditing.value = true
  else {
    await useCustomFetch(`comments/${props.answer.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({...editedData})
    })
    isRefresh.value = true
    isResponseSend.value = true
    isEditing.value = false
  }
}

const handleResolve = async () => {
  if(props.comment.is_resolved) return
  await useCustomFetch(`/comments/${props.answer.id}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: true})
  })
  await useCustomFetch(`/comments/${props.comment.id}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: true})
  })
  
  isResponseSend.value = true
  isRefresh.value = true
}

const handleUnresolved = async () => {
  if(!props.answer.is_resolved) return
  await useCustomFetch(`/comments/${props.answer.id}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: false})
  })

  await useCustomFetch(`/comments/${props.answer.comment_parent}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: false})
  })

  isResponseSend.value = true
  isRefresh.value = true
}

</script>

<template>
  <div class="info">
    <div class="user-date">
      <div v-if="user" class="user-info">
        <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="thumbnail"/>
        <img v-else src="assets/image/user.png" alt="user thumbnail" class="thumbnail"/>
        <span>{{ user.username }}</span>
      </div>
      <!--   formated date / hour  -->
      <span>-</span>
      <span> {{ dayjs().to(dayjs(answer.updated_at)) }}</span>
    </div>
    <div class="action">
      <div v-if="comment.is_resolved && answer.is_resolved" class="is-resolved">
        <font-awesome-icon icon="fa-regular fa-circle-check"/>
      </div>
      <div class="dropdown is-right" :class="{ 'is-active': isDropdownOpen }" ref="dropdownRef" @click="handleDropdownClick">
        <div class="dropdown-trigger">
          <button class="button is-small" @click="toggleDropdown(answer.id)">
                <span class="icon is-small">
                  <font-awesome-icon icon="fa-solid fa-ellipsis"/>
                </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="isDropdownOpen">
          <div class="dropdown-content">
            <div class="item-menu">
              <font-awesome-icon icon="fa-regular fa-trash-can" @click="handleDeleteComment"/>
            </div>
            <div class="item-menu">
              <font-awesome-icon icon="fa-regular fa-pen" @click="handleEditComment"/>
            </div>
            <div v-if="answer.is_thread && !answer.is_resolved && !comment.is_resolved" class="item-menu is-thread" @click="handleResolve">
              <font-awesome-icon icon="fa-solid fa-check"/>
            </div>
            <div v-if="answer.is_thread && answer.is_resolved && comment.is_resolved" class="item-menu is-thread" @click="handleUnresolved">
              <font-awesome-icon icon="fa-solid fa-xmark"/>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
  <div v-if="!isEditing" class="content">
    {{ answer.content }}
    <!-- if attachment show attchment -->
  </div>
  <form @submit.prevent="handleEditComment" v-if="isEditing" class="editing-content">
    <input type="text" class="input" v-model="editedData.content" @keydown.enter="handleEditComment">
    <button class="button" type="submit">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
    </button>
  </form>
</template>
