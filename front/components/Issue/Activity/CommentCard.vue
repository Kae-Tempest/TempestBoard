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
const showResponseInput = ref<Boolean>(false)
const isResponseSend = defineModel()
const isEditing = ref<Boolean>(false)
const {isRefresh} = useRefreshData()


const data = reactive({
  issue: props.comment.issue,
  comment_parent: props.comment.id,
  is_answer: true,
  is_thread: true,
  user: 0,
  content: "",
})
const {data: users, refresh} = await useCustomFetch<User>(`/users/${props.comment.user}`)

onMounted(async () => {
  await refresh()
  user.value = users.value
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
  showMenu.value = false
  if(!isEditing.value) isEditing.value = true
  else {
    await useCustomFetch(`comments/${props.comment.id}/`, {
      method: 'PATCH',
      body: {...editedData}
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
      body: {...data},
    })
    if (res.error.value) console.log('error')
    if (res.data.value) {
      if (!props.comment.is_thread) {
        const resp = await useCustomFetch(`/comments/${res.data.value.comment_parent}/`, {
          method: "PATCH",
          body: {
            is_thread: true
          }
        })
        if (resp.error.value) console.log('error')
        if (resp.data.value) {
          comment.value.is_thread = (resp.data.value as Comment).is_thread
        }
      } if (props.comment.is_resolved) {
        await useCustomFetch(`/comments/${res.data.value.comment_parent}/`, {
          method: "PATCH",
          body: {
            is_resolved: false
          }
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
        <div class="dropdown is-right is-active">
          <div class="dropdown-trigger">
            <button class="button is-small" @click="showMenu = !showMenu">
              <span class="icon is-small">
                <font-awesome-icon icon="fa-solid fa-ellipsis"/>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="showMenu">
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
    <div class="content" v-if="!isEditing">
      {{ comment.content }}
    </div>
    <div v-if="isEditing" class="editing-content">
      <input type="text" class="input" v-model="editedData.content" @keydown.enter="handleEditComment">
      <button class="button" @click="handleEditComment">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
      </button>
    </div>
    <div v-for="answer in commentAnswer" class="comment-answer"  :class="{'is-response': answer.is_resolved && comment.is_resolved, 'is-not-response': !answer.is_resolved && comment.is_resolved }">
      <CommentResponse :answer="answer" :comment="comment" v-model="isResponseSend" v-if="!answer.is_resolved && !comment.is_resolved"/>
      <CommentResponse :answer="answer" :comment="comment" v-model="isResponseSend" v-else-if="answer.is_resolved && comment.is_resolved"/>
    </div>

    <div v-if="showResponseInput || commentAnswer.length > 0" class="input-response">
      <input type="text" placeholder="Leave your comment..." class="input" v-model.trim="data.content" @keydown.enter="handleSendCommentaryResponse">
      <button class="button" @click="handleSendCommentaryResponse">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
      </button>
    </div>
  </div>
</template>