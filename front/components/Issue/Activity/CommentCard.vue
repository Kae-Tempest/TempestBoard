<script setup lang="ts">
import type {Activity, Comment, User} from '~/types/global';
import {useDayjs} from '#dayjs'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
const commentAnswer = computed(() => props.commentA.filter(i => i.itemType === 'comment').filter(c => c.is_answer && c.comment_parent === props.comment.id))
const user = ref<User | null>(null)
const connectedUser: User | null = useUserStore().getUser
const showMenu = ref<boolean>(false)
const showResponseInput = ref<boolean>(false)
const isResponseSend = defineModel()
const { isRefresh } = useRefreshData()


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
  if(showMenu.value) return
  showResponseInput.value = true
}

const resetForm = () => {
  data.content = ""
  data.user = 0
}

const handleSendCommentaryResponse = async () => {
  if(connectedUser && data.content !== "") {
    data.user = connectedUser.id
    if(data.user === 0 && data.content === "") return
    const res = await useCustomFetch<Comment>(`/comments/`, {
      method: "POST",
      body: {...data},
    })
    if (res.error.value) console.log('error')
    if (res.data.value) {
      const resp = await useCustomFetch(`/comments/${res.data.value.comment_parent}/`, {
        method: "PATCH",
        body: {
          is_thread: true
        }
      })
      if (resp.error.value) console.log('error')
      if (resp.data.value) {
        comment.value.is_thread = (resp.data.value as Comment).is_thread
        resetForm()
        isResponseSend.value = true
        isRefresh.value = true
      }
    }
  }
}

</script>

<template>
  <div class="comment" v-if="!comment.is_answer"  @click="handleShowResponseInput">
    <div class="info">
      <div class="user-date">
        <div v-if="user" class="user-info">
          <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="thumbnail"/>
          <img v-else src="assets/image/user.png" alt="user thumbnail" class="thumbnail"/>
          <span>{{ user.username }}</span>
        </div>
        <!--   formated date / hour  -->
        <span>-</span>
        <span> {{ dayjs().to(dayjs(comment.updated_at)) }}</span>
      </div>
      <div class="actions">
        <div v-if="comment.is_resolved" class="is-resolved"><font-awesome-icon icon="fa-regular fa-circle-check" /></div>
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
              <div class="item-menu"><font-awesome-icon icon="fa-regular fa-trash-can" /></div>
              <div class="item-menu"><font-awesome-icon icon="fa-regular fa-pen" /></div>
              <div v-if="comment.is_thread && !comment.is_resolved" class="item-menu is-thread"><font-awesome-icon icon="fa-solid fa-check" /></div>
              <div v-if="comment.is_thread && comment.is_resolved" class="item-menu is-thread"><font-awesome-icon icon="fa-solid x-mark" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      {{ comment.content }}
      <!-- if attachment show attchment -->
    </div>
    <div v-for="answer in commentAnswer.sort((a, b) => {const dateA = new Date(a.created_at);const dateB = new Date(b.created_at);return dateA.getTime() - dateB.getTime()})" class="comment-answer">
      ok --> {{ answer.id }} {{ answer.content }}

      <!--      {{ answer.content }}-->
    </div>
    
    <div v-if="showResponseInput || commentAnswer.length > 0" class="input-response">
      <input type="text" placeholder="Leave your comment..." class="input" v-model.trim="data.content" @keydown.enter="handleSendCommentaryResponse">
      <button class="button" @click="handleSendCommentaryResponse">
        <span class="icon">
          <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </span>
      </button>
    </div>

    <!-- if reply show reply input else show at click -->
  </div>
</template>