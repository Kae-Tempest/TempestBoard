<script setup lang="ts">
import type {Activity, Comment, Issue, Project, States, User} from "~/types/global";
import {ActivityContent} from "~/enums/AcitivityContentEnum"
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import EditIssueModal from "~/components/Modals/issue/EditIssueModal.vue";
import {useUserStore} from "~/stores/useUserStore";
import {reactive, ref, watch} from "vue";
import CommentCard from "~/components/Issue/Activity/CommentCard.vue";
import ActivityItem from "~/components/Issue/Activity/ActivityItem.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useCustomFetch} from "~/composables/useCustomFetch";
import SearchBar from "~/components/SearchBar.vue";
import {ContentType} from "~/enums/content-type.enum";

const {sendMessage, receivedMessage} = useWebSocket('ws/activity/')
const wsActivityMessage = reactive({
  type: "activity",
  content: ActivityContent.EDIT_STATUS.toString(),
  issue: 0,
  user: 0,
})

type CommentItem = Comment & { itemType: 'comment' }
type ActivityItem = Activity & { itemType: 'activity' }
type MergedItem = CommentItem | ActivityItem

type formType = {
  content: string,
  is_answer: boolean,
  is_thread: boolean,
  is_resolved: boolean,
  attachment: File | null,
}


const showUpdateModal = ref<boolean>(false)
const editedIssueID = ref<number>(0)
const issueInfo = ref<{ issue: Issue, project: Project } | null>(null)
const issueProjectStates = ref<States[]>([])
const activitiesList = ref<MergedItem[]>([])
const isAssignedClicked = ref<Boolean>(false)
const AssignedUpdate = ref<string>()
const isResponseSend = ref<boolean>(false)
const {isRefresh} = useRefreshData()
const route = useRoute()
let user: User | null = useUserStore().getUser

const issue = ref<Issue>()
const projectsData = ref<Project[]>()
const users = ref<User[]>()
const project = ref<Project>()

const data = reactive({
  status: issueInfo.value !== null ? issueInfo.value.issue.status : ""
})
const commentData = reactive<formType>({
  content: '',
  is_answer: false,
  is_thread: false,
  is_resolved: false,
  attachment: null
})

issue.value = await useCustomFetch<Issue>(`/issues/${route.params.id}/`)
projectsData.value = await useCustomFetch<Project[]>('/projects/')
users.value = await useCustomFetch<User[]>(`/users/`)

const projects = projectsData.value || []
const showSearchBar = ref<boolean>(false)

onBeforeUpdate(async () => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      isAssignedClicked.value = false
    }
  })
  if (issueInfo.value === null) {
    if (issue.value) {
      project.value = await useCustomFetch<Project>(`/projects/${issue.value.project}/`)
      if (project.value && issue.value) {
        if (users.value && issue.value.creator) {
          issue.value.creator = users.value.find(u => u.id === issue.value?.creator.id) || users.value[0]
          issue.value.assigned = users.value.find(u => u.id === issue.value?.assigned.id) || users.value[0]
          const selectIssue: Issue = issue.value as Issue
          const selectProject: Project = project.value as Project

          issueInfo.value = {
            issue: selectIssue,
            project: selectProject
          }
        }
      }
    }
  }
})

onMounted(async () => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      isAssignedClicked.value = false
    }
  })
  if (issueInfo.value === null) {
    if (issue.value) {
      project.value = await useCustomFetch<Project>(`/projects/${issue.value.project}/`)
      if (project.value && issue.value) {
        if (users.value && issue.value.creator) {
          issue.value.creator = users.value.find(u => u.id === issue.value?.creator.id) || users.value[0]
          issue.value.assigned = users.value.find(u => u.id === issue.value?.assigned.id) || users.value[0]
          const selectIssue: Issue = issue.value as Issue
          const selectProject: Project = project.value as Project

          issueInfo.value = {
            issue: selectIssue,
            project: selectProject
          }
        }
      }
    }
  }
})

watch(() => issueInfo.value?.issue.status, (newVal) => {
  if (newVal) {
    data.status = newVal
  }
})

watch(() => issueInfo.value?.project.id, async (newVal) => {
  if (newVal !== 0) {
    issueProjectStates.value = await useCustomFetch<States[]>(`/projects/${newVal}/states`)
  }
})

watch(() => issueInfo.value?.issue.id, async (newVal) => {
  if (newVal) await updateMergedList()
})

watch(() => showUpdateModal.value, async (newVal) => {
  if (!newVal) await updateMergedList()
})

watch(() => receivedMessage.value, async (newVal) => {
  if (newVal) await updateMergedList()
})

watch(() => isResponseSend.value, async (newVal) => {
  if (newVal) {
    await updateMergedList()
    isResponseSend.value = false
  }
})

watch(() => isRefresh.value, async (newVal) => {
  if (newVal) {
    issue.value = await useCustomFetch<Issue>(`/issues/${route.params.id}/`)
    projectData.value = await useCustomFetch<Project[]>('/projects/')
    users.value = await useCustomFetch<User[]>(`/users/`)
    user = useUserStore().getUser;
    isRefresh.value = false
  }
});

const handleUpdate = async () => {
  if (!issueInfo.value) return
  const res = await useCustomFetch(`/issues/${issueInfo.value.issue.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({status: data.status}),
  });
  const updatedIssue: Issue = res.data.value as Issue
  wsActivityMessage.issue = updatedIssue.id
  wsActivityMessage.user = user!.id
  sendMessage(JSON.stringify(wsActivityMessage))
  issueInfo.value.issue.status = updatedIssue.status
  issueInfo.value.issue.created_at = updatedIssue.created_at
  await updateMergedList()
  isRefresh.value = true
}

const handleCreateComment = async () => {
  const formData = new FormData()
  formData.append('content', commentData.content)
  formData.append('is_answer', commentData.is_answer.toString())
  formData.append('is_thread', commentData.is_thread.toString())
  formData.append('is_resolved', commentData.is_resolved.toString())
  formData.append('attachment', commentData.attachment as Blob || '')
  formData.append('issue', issueInfo.value?.issue.id.toString() || '')
  formData.append('user', user!.id.toString() || '')

  const res = await useCustomFetch('/comments/', {
    method: 'POST',
    body: formData,
  }, ContentType.applicationMultipartFormData)
  if (res) {
    commentData.content = ""
    isRefresh.value = true
    activitiesList.value = addCommentToMergedArray(activitiesList.value, res)
    setTimeout(async () => {
      await updateMergedList()
    }, 1000)
  }
}

const mergeCommentsAndActivities = (comments: Comment[], activities: Activity[]): MergedItem[] => {
  const commentItems: CommentItem[] = comments.map(comment => ({
    ...comment,
    itemType: 'comment' as const
  }))

  const activityItems: ActivityItem[] = activities.map(activity => ({
    ...activity,
    itemType: 'activity' as const
  }))

  const merged: MergedItem[] = [...commentItems, ...activityItems]

  return merged.sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return dateB.getTime() - dateA.getTime()
  })
}

const updateMergedList = async () => {
  if (!issueInfo.value) return
  const commentIssue = await useCustomFetch<Comment[]>(`/issues/${issueInfo.value.issue.id}/comments/`)
  const activityIssue = await useCustomFetch<Activity[]>(`/issues/${issueInfo.value.issue.id}/activities`)
  activitiesList.value = mergeCommentsAndActivities(commentIssue as Comment[], activityIssue as Activity[])
}

const addCommentToMergedArray = (mergedArray: MergedItem[], newComment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): MergedItem[] => {
  const now = new Date()
  const commentToAdd: CommentItem = {
    ...newComment,
    id: Math.max(...mergedArray.map(item => item.id)) + 1,
    created_at: now,
    updated_at: "",
    itemType: 'comment' as const
  }

  return [commentToAdd, ...mergedArray].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return dateB.getTime() - dateA.getTime()
  })
}

const handleUpdateAssigned = async () => {
  if (AssignedUpdate.value === issueInfo.value?.issue.assigned.username) return
  if (!users.value && !AssignedUpdate.value) return
  let user_id = users.value?.find((u: User) => u.username === AssignedUpdate.value)?.id

  await useCustomFetch(`/issues/${issueInfo.value?.issue.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({assigned: user_id})
  })
  isAssignedClicked.value = false
  wsActivityMessage.issue = issueInfo.value!.issue.id
  wsActivityMessage.user = user!.id
  wsActivityMessage.content = ActivityContent.ASSIGNED_TO + " " + AssignedUpdate.value
  sendMessage(JSON.stringify(wsActivityMessage))
  await updateMergedList()
  isRefresh.value = true
}

</script>

<template>
  <SearchBar v-model="showSearchBar"/>
  <Navbar v-if="user" :user="user" :projects="projects" v-model="showSearchBar"/>
  <div id="issue-details">
    <EditIssueModal :issueId="editedIssueID" v-model="showUpdateModal"/>
    <div class="hero-issue">
      <div v-if="issueInfo !== null" class="issue-info">
        <div class="issue-details">
          <div class="breadcrumb is-small">
            <ul>
              <li>
                <NuxtLink to="/project">{{ issueInfo.project.name }}</NuxtLink>
              </li>
              <li>{{ issueInfo.project.name.substring(0, 3).toUpperCase() }}-{{ issueInfo.issue.ticket_id }}</li>
            </ul>
          </div>
          <div class="content">
            <h2>{{ issueInfo.issue.title }}</h2>
            <div v-if="issueInfo.issue.description" v-html="issueInfo.issue.description"></div>
            <div v-if="issueInfo.issue.description === ''">Any Description</div> <!-- TODO: '<p></p>\n Support -->
            <hr>
            <div class="activity">
              <!--  commentaire  -->
              <div class="header">
                <div>Activity</div>
              </div>
              <div class="wrapper">
                <div v-for="item in activitiesList" :key="item.id" class="activity-list">
                  <template v-if="item.itemType === 'comment'">
                    <CommentCard v-model="isResponseSend" :comment="item" :commentA="activitiesList"/>
                  </template>
                  <template v-else>
                    <ActivityItem :activity="item"/>
                  </template>
                </div>
              </div>
              <div class="comment-input">
                <input type="text" placeholder="Leave your comment..." class="input" v-model="commentData.content"
                       @keydown.enter="handleCreateComment">
                <button class="button" @click="handleCreateComment">
                  <span class="icon">
                    <font-awesome-icon icon="fa-solid fa-paper-plane"/>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div v-if="issueInfo !== null" class="issue-details-info">
        <div class="select">
          <select v-model="data.status" @change="handleUpdate">
            <option disabled value="">State</option>
            <option v-if="issueInfo.project.id === 0" value="backlog">Backlog</option>
            <option v-if="issueInfo.project.id === 0" value="open">Open</option>
            <option v-if="issueInfo.project.id === 0" value="in_progress">In Progress</option>
            <option v-if="issueInfo.project.id === 0" value="completed">Completed</option>
            <option v-if="issueInfo.project.id === 0" value="canceled">Canceled</option>
            <option v-if="issueInfo.project.id !== 0 && issueProjectStates.length > 0"
                    v-for="state in issueProjectStates" :value="state.name">{{ useCapitalize(state.name) }}
            </option>
          </select>
        </div>


        <button class="button" @click="showUpdateModal = true; editedIssueID = issueInfo.issue.id">Edit</button>
        <div class="details-info">
          <div class="details-title">Details</div>
          <div class="infos">
            <div class="info">
              <div class="important-info">
                <div v-if="!isAssignedClicked"
                     @click="AssignedUpdate = issueInfo.issue.assigned.username; isAssignedClicked = true;"
                     class="assigned">Assigned: {{
                    issueInfo.issue.assigned.username
                  }}
                </div>
                <div v-if="isAssignedClicked" class="assigned">
                  <div class="name">
                    Assigned:
                  </div>
                  <div>
                    <input class="input" list="project-users" type="text" @keydown.enter="handleUpdateAssigned"
                           v-model="AssignedUpdate"/>
                    <button class="button" @click="handleUpdateAssigned">
                      <span class="icon">
                        <font-awesome-icon icon="fa-solid fa-paper-plane"/>
                      </span>
                    </button>
                  </div>
                  <datalist id="project-users">
                    <option v-for="user in issueInfo.project.users" :value="users?.find(u => u.id === user)?.username ">
                      {{ users?.find(u => u.id === user)?.username }}
                    </option>
                  </datalist>
                </div>

                <div class="creator">Creator: {{ issueInfo.issue.creator.username }}</div>
                <div class="issue-tags">Tags: Any</div>
                <div class="priority">Priority:
                  <PriorityIcon :priority="issueInfo.issue.priority"/>
                  {{ issueInfo.issue.priority }}
                </div>
              </div>
              <div class="date-info">
                <div>Created : {{
                    new Date(issueInfo.issue.created_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: "short"
                    })
                  }}
                </div>
                <div>Updated : {{
                    new Date(issueInfo.issue.updated_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: "short"
                    })
                  }}
                </div>
              </div>
            </div>
            <div class="time">
              <!--       A Venir       -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>