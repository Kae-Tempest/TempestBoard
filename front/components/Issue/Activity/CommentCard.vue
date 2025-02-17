<script setup lang="ts">
import type {Activity, Comment, User} from '~/types/global';
import {useDayjs} from '#dayjs'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import CommentResponse from "~/components/Issue/Activity/CommentResponse.vue";

const dayjs = useDayjs()

type CommentItem = Comment & { itemType: 'comment' }
type ActivityItem = Activity & { itemType: 'activity' }
type MergedItem = CommentItem | ActivityItem

interface Props {
  comment: Comment
  commentA: MergedItem[]
}

const props = defineProps<Props>()
const comment = computed(() => props.comment)
const commentAnswer = computed(() => props.commentA.filter(i => i.itemType === 'comment').filter(c => c.is_answer && c.comment_parent === props.comment.id).sort((a, b) => {const dateA = new Date(a.created_at);const dateB = new Date(b.created_at);return dateA.getTime() - dateB.getTime()}))
const user = ref<User | null>(null)
const connectedUser: User | null = useUserStore().getUser
const showMenu = ref<Boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)
const showResponseInput = ref<Boolean>(false)
const isResponseSend = defineModel()
const isEditing = ref<Boolean>(false)
const {isRefresh} = useRefreshData()

// Use the dropdown state composable
const { activeDropdownId, toggleDropdown, closeDropdown } = useDropdownState()

// Computed property to check if this dropdown is open
const isDropdownOpen = computed(() => activeDropdownId.value === props.comment.id)

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


const data = reactive({
  issue: props.comment.issue,
  comment_parent: props.comment.id,
  is_answer: true,
  is_thread: true,
  user: 0,
  content: "",
})

onMounted(async () => {
  user.value = await useCustomFetch<User>(`/users/${props.comment.user}`)
})

const handleShowResponseInput = () => {
  if (showMenu.value) return
  showResponseInput.value = true
}

const resetForm = () => {
  data.content = ""
  data.user = 0
}

const editedData = reactive({
  content: props.comment.content
})

const handleDeleteComment = async () => {
  for (const answer of props.commentA) {
    if ((answer as Comment).comment_parent === props.comment.id) {
      await useCustomFetch(`/comments/${answer.id}/`,{
        method: 'DELETE',
      })
    }
  }
  await useCustomFetch(`/comments/${props.comment.id}/`,{
    method: 'DELETE',
  })
  isRefresh.value = true
  isResponseSend.value = true
}

const handleEditComment = async () => {
  closeDropdown()
  if(!isEditing.value) isEditing.value = true
  else {
    await useCustomFetch(`/comments/${props.comment.id}/`, {
      method: 'PATCH',
      body: JSON.stringify({...editedData})
    })
    isRefresh.value = true
    isResponseSend.value = true
    isEditing.value = false
  }
}

const handleSendCommentaryResponse = async () => {
  if (connectedUser && data.content !== "") {
    data.user = connectedUser.id
    if (data.user === 0 && data.content === "") return
    const res = await useCustomFetch<Comment>(`/comments/`, {
      method: "POST",
      body: JSON.stringify({...data}),
    })
    if (res) {
      if (!props.comment.is_thread) {
        const resp = await useCustomFetch<Comment>(`/comments/${res.comment_parent}/`, {
          method: "PATCH",
          body: JSON.stringify({
            is_thread: true
          })
        })
        if (resp) {
          comment.value.is_thread = resp.is_thread
        }
      } if (props.comment.is_resolved) {
        await useCustomFetch(`/comments/${res.comment_parent}/`, {
          method: "PATCH",
          body: JSON({
            is_resolved: false
          })
        })
      }
      resetForm()
      isResponseSend.value = true
      isRefresh.value = true
    }
  }
}

const handleResolved = async () => {
  if(props.comment.is_resolved) return
  await useCustomFetch(`/comments/${props.comment.id}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: true})
  })
  isResponseSend.value = true
  isRefresh.value = true
}

const handleUnresolved = async () => {
  if(!props.comment.is_resolved) return
  await useCustomFetch(`/comments/${props.comment.id}/`,{
    method: "PATCH",
    body: JSON.stringify({is_resolved: false})
  })

  for (const answer of props.commentA) {
    if((answer as Comment).is_resolved) {
      await useCustomFetch(`/comments/${answer.id}/`,{
        method: "PATCH",
        body: JSON.stringify({is_resolved: false})
      })
    }
  }

  isResponseSend.value = true
  isRefresh.value = true
}

</script>

<template>
  <div class="comment" v-if="!comment.is_answer" @click="handleShowResponseInput">
    <div class="info">
      <div class="user-date">
        <div v-if="user" class="user-info">
          <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="thumbnail"/>
          <img v-else src="assets/image/user.png" alt="user thumbnail" class="thumbnail"/>
          <span>{{ user.username }}</span>
        </div>
        <span>-</span>
        <span> {{ dayjs().to(dayjs(comment.updated_at)) }}</span>
      </div>
      <div class="actions">
        <div v-if="comment.is_resolved" class="is-resolved">
          <font-awesome-icon icon="fa-regular fa-circle-check"/>
        </div>
        <div class="dropdown is-right" :class="{ 'is-active': isDropdownOpen }" ref="dropdownRef" @click="handleDropdownClick">
          <div class="dropdown-trigger">
            <button class="button is-small" @click="toggleDropdown(comment.id)">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-ellipsis"/>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="isDropdownOpen">
            <div class="dropdown-content">
              <div class="item-menu" @click="handleDeleteComment">
                <font-awesome-icon icon="fa-regular fa-trash-can"/>
              </div>
              <div class="item-menu" @click="handleEditComment">
                <font-awesome-icon icon="fa-regular fa-pen"/>
              </div>
              <div v-if="comment.is_thread && !comment.is_resolved" class="item-menu is-thread" @click="handleResolved">
                <font-awesome-icon icon="fa-solid fa-check"/>
              </div>
              <div v-if="comment.is_thread && comment.is_resolved" class="item-menu is-thread" @click="handleUnresolved">
                <font-awesome-icon icon="fa-solid fa-xmark"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-justify-content-space-between" v-if="!isEditing">
      <div class="content" >
        {{ comment.content }}
      </div>
      <span> <font-awesome-icon icon="fa-regular fa-chevron-down"/> </span>
    </div>
    <form @submit.prevent="handleEditComment" v-if="isEditing" class="editing-content">
      <input type="text" class="input" v-model="editedData.content">
      <button class="button" type="submit">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
      </button>
    </form>
    <div v-for="answer in commentAnswer" class="comment-answer"  :class="{'is-response': answer.is_resolved && comment.is_resolved, 'is-not-response': !answer.is_resolved && comment.is_resolved }">
      <CommentResponse :answer="answer" :comment="comment" v-model="isResponseSend" v-if="!answer.is_resolved && !comment.is_resolved"/>
      <CommentResponse :answer="answer" :comment="comment" v-model="isResponseSend" v-else-if="answer.is_resolved && comment.is_resolved"/>
    </div>

    <form @submit.prevent="handleSendCommentaryResponse" v-if="showResponseInput && !isEditing || commentAnswer.length > 0 && !isEditing" class="input-response">
      <input type="text" placeholder="Leave your comment..." class="input" v-model.trim="data.content">
      <button class="button" type="submit">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
      </button>
    </form>
  </div>
</template>