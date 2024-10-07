<script setup lang="ts">
import type {Activity, Comment, Issue, Project, States, User} from "~/types/global";
import {ActivityContent} from "~/enums/AcitivityContentEnum"
import CreateIssueModal from "~/components/Modals/issue/CreateIssueModal.vue";
import IssueCardList from "~/components/Issue/DetailView/IssueCardList.vue";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import EditIssueModal from "~/components/Modals/issue/EditIssueModal.vue";
import {useUserStore} from "~/stores/useUserStore";
import {reactive} from "vue";
import CommentCard from "~/components/Issue/Activity/CommentCard.vue";
import ActivityItem from "~/components/Issue/Activity/ActivityItem.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { sendMessage } = useWebSocket('ws/activity/')
const wsActivityMessage = reactive({
  type: "activity",
  content: ActivityContent.EDIT_STATUS,
  issue: 0,
  user: 0,
})

interface Props {
  issueArray: Issue[];
  createdIssue: Issue[];
  assignedIssue: Issue[];
  Projects: Project[];
  typeView: string;
  users: User[];
}
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

const props = defineProps<Props>()

const selectedProject = ref<Number>(0)
const selectedState = ref<String>("")
const selectedView = ref<String>("all")
const projectStates = ref<States[]>([])
const showModal = ref<boolean>(false)
const showUpdateModal = ref<boolean>(false)
const editedIssueID = ref<number>(0)
const issueInfo = ref<{ issue: Issue, project: Project } | null>(null)
const isFiltered = ref<Boolean>(false)
const filteredIssueArray = ref<Issue[]>([])
const issueProjectStates = ref<States[]>([])
const searchedTitle = ref<String>("")
const activitiesList = ref<MergedItem[]>([])
const {isRefresh} = useRefreshData()
const user = useUserStore().getUser()

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

onBeforeUpdate(() => {
  if (issueInfo.value === null) {
    if (props.issueArray.length > 0 && props.Projects.length > 0) {
      const project = props.Projects.find(p => p.id === props.issueArray[0].project)
      const issue = props.issueArray.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
      if (project && issue) {
        issueInfo.value = {issue, project}
      }
    }
  }
})

onMounted(() => {
  if (issueInfo.value === null) {
    if (props.issueArray.length > 0 && props.Projects.length > 0) {
      const project = props.Projects.find(p => p.id === props.issueArray[0].project)
      const issue = props.issueArray[0]
      if (project && issue) {
        issueInfo.value = {issue, project}
      }
    }
  }
})

watch(() => props.issueArray, () => {
  if(!issueInfo.value) return
  if (props.issueArray.length > 0 && props.Projects.length > 0) {
    const project = props.Projects.find(p => p.id === issueInfo.value?.project.id)
    const issue = props.issueArray.find(i => i.id === issueInfo.value?.issue.id)
    if (project && issue) {
      issueInfo.value = {issue, project}
    }
  }
})

watch(() => issueInfo.value?.issue.status, (newVal) => {
  if (newVal) {
    data.status = newVal
  }
})

watch(() => selectedProject.value, async (newVal) => {
  if (newVal !== 0) {
    let projectID = newVal as number
    const {data: projectSate} = await useCustomFetch<States[]>(`/project/${newVal}/states`)
    projectStates.value = projectSate.value as States[]
    handleFilter(undefined, projectID)

  }
})

watch(() => searchedTitle.value, (newVal) => {
  const title = newVal as string
  handleFilter(title)
})

watch(() => selectedState.value, (newVal) => {
  if (newVal) {
    let state = newVal as string
    handleFilter(undefined, undefined, state)
  }
})

watch(() => issueInfo.value?.project.id, async (newVal) => {
  if (newVal !== 0) {
    const {data: projectSate} = await useCustomFetch<States[]>(`/project/${newVal}/states`)
    issueProjectStates.value = projectSate.value as States[]
  }
})

watch(() => issueInfo.value?.issue.id, async (newVal) => {
  if (newVal) await updateMergedList()
})

watch(() => showUpdateModal.value, async (newVal) => {
  if(!newVal) await updateMergedList()
})

const handleFilter = (title?: string, project?: number, state?: string) => {
  isFiltered.value = !(!title && !project && !state);
  if (selectedView.value == "all") {
    if (project) {
      if (selectedState.value !== "") {
        filteredIssueArray.value = props.issueArray.filter(i => i.project === project && i.status === selectedState.value)
      } else {
        filteredIssueArray.value = props.issueArray.filter(i => i.project === project)
      }
    }
    if (title) {
      if (selectedState.value !== "") {
        filteredIssueArray.value = props.issueArray.filter(i => i.title.includes(title) && i.status === selectedState.value)
      }
      if (selectedProject.value !== 0) {
        filteredIssueArray.value = props.issueArray.filter(i => i.title.includes(title) && i.project === selectedProject.value)
      }
      if (selectedState.value !== "" && selectedProject.value !== 0) {
        filteredIssueArray.value = props.issueArray.filter(i => i.title.includes(title) && i.status === selectedState.value && i.project === selectedProject.value)
      } else {
        filteredIssueArray.value = props.issueArray.filter(i => i.title.includes(title))
      }
    }
    if (state) {
      if (selectedProject.value !== 0) {
        filteredIssueArray.value = props.issueArray.filter(i => i.project === selectedProject.value && i.status === state)
      } else {
        filteredIssueArray.value = props.issueArray.filter(i => i.status === state)

      }
    }
  } else if (selectedView.value === "creator") {
    if (project) {
      filteredIssueArray.value = props.createdIssue.filter(i => i.project === project)
    }
    if (title) {
      filteredIssueArray.value = props.createdIssue.filter(i => i.title.includes(title))
    }
    if (state) {
      filteredIssueArray.value = props.createdIssue.filter(i => i.status === state)
    }
  } else if (selectedView.value === "assigned") {
    if (project) {
      filteredIssueArray.value = props.assignedIssue.filter(i => i.project === project)
    }
    if (title) {
      filteredIssueArray.value = props.assignedIssue.filter(i => i.title.includes(title))
    }
    if (state) {
      filteredIssueArray.value = props.assignedIssue.filter(i => i.status === state)
    }
  }
}

const updateIssueArray = (arr: Issue[], issue: Issue) => {
  const idx = arr.findIndex(i => i.id === issue.id)
  if(idx != 0) {
    arr[idx] = issue
  }
}

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
  updateIssueArray(props.issueArray, updatedIssue)
  updateIssueArray(props.createdIssue, updatedIssue)
  updateIssueArray(props.assignedIssue, updatedIssue)
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
  })
  if(res.data.value) {
    commentData.content = ""
    isRefresh.value = true
    activitiesList.value = addCommentToMergedArray(activitiesList.value, res.data.value as Comment)
    setTimeout(async () => {
      await updateMergedList()
    }, 1000)
  }
}

const mergeCommentsAndActivities = (comments: Comment[], activities: Activity[]): MergedItem[] => {
  console.log(comments)
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
    return dateB.getTime() - dateA.getTime() // Sort in descending order (newest first)
  })
}

const updateMergedList = async () => {
  console.log(issueInfo.value, 'issueInfo')
  if(!issueInfo.value) return
  console.log('merged')
  const {data: commentIssue} = await useCustomFetch<Comment[]>(`/issues/${issueInfo.value.issue.id}/comments/`)
  const {data: activityIssue} = await useCustomFetch<Activity[]>(`/issues/${issueInfo.value.issue.id}/activities`)
  activitiesList.value = mergeCommentsAndActivities(commentIssue.value as Comment[] , activityIssue.value as Activity[])
}

const addCommentToMergedArray = ( mergedArray: MergedItem[], newComment: Omit<Comment, 'id' | 'created_at' | 'updated_at'> ): MergedItem[] => {
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


</script>

<template>
  <div id="details">
    <CreateIssueModal :projects="Projects" v-model:modal="showModal"/>
    <EditIssueModal :issueId="editedIssueID" v-model="showUpdateModal"/>
    <header>
      <div class="left-side">
        <div>
          <input class="input" v-model="searchedTitle" type="text" placeholder="Search tickets"/>
        </div>
        <div class="select-group">
          <div class="select">
            <select v-model="selectedProject">
              <option disabled value="0">Project</option>
              <option v-for="project in Projects" :value="project.id">{{ project.name }}</option>
            </select>
          </div>
          <div class="select">
            <select v-model="selectedState">
              <option disabled value="">State</option>
              <option v-if="selectedProject === 0" value="backlog">Backlog</option>
              <option v-if="selectedProject === 0" value="open">Open</option>
              <option v-if="selectedProject === 0" value="in_progress">In Progress</option>
              <option v-if="selectedProject === 0" value="completed">Completed</option>
              <option v-if="selectedProject === 0" value="canceled">Canceled</option>
              <option v-if="selectedProject !== 0 && projectStates.length > 0" v-for="state in projectStates" :value="state.name">{{ useCapitalize(state.name) }}</option>
            </select>
          </div>
          <div class="select">
            <select v-model="selectedView">
              <option value="all">All</option>
              <option value="created">Created</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
        </div>
      </div>
      <div class="right-side">
        <button class="button" @click="showModal = true">
          <span>Create</span>
          <span class="icon">
            <font-awesome-icon icon="fa-solid fa-plus"/>
          </span>
        </button>
      </div>
    </header>
    <div class="hero-issue">
      <IssueCardList v-if="selectedView === 'all' && !isFiltered" :Projects="Projects" :issueArray="issueArray" v-model="issueInfo"/>
      <IssueCardList v-if="selectedView === 'created' && !isFiltered" :Projects="Projects" :issueArray="createdIssue" v-model="issueInfo"/>
      <IssueCardList v-if="selectedView === 'assigned' && !isFiltered " :Projects="Projects" :issueArray="assignedIssue" v-model="issueInfo"/>
      <IssueCardList v-if="isFiltered" :Projects="Projects" :issueArray="filteredIssueArray" v-model="issueInfo"/>

      <div v-if="issueInfo !== null"  class="issue-info">
        <div class="issue-details">
          <div class="breadcrumb is-small">
            <ul>
              <li><NuxtLink to="/project">{{ issueInfo.project.name }}</NuxtLink></li>
              <li>{{ issueInfo.project.name.substring(0, 3).toUpperCase() }}-{{ issueInfo.issue.ticket_id }}</li>
            </ul>
          </div>
          <div class="content">
            <h2>{{ issueInfo.issue.title }}</h2>
            <div v-if="issueInfo.issue.description" v-html="issueInfo.issue.description"></div>
            <div v-if="issueInfo.issue.description === '<p></p>\n'">Any Description</div>
            <hr>
            <div class="activity">
              <!--  commentaire  -->
              <div class="header">
                <div>Activity</div>
              </div>
              <div v-for="item in activitiesList" :key="item.id" class="activity-list">
                   <template v-if="item.itemType === 'comment'">
                     <CommentCard :comment="item"/>
                   </template>
                   <template v-else>
                      <ActivityItem :activity="item" />
                   </template>
              </div>
              <div class="comment-input">
                <input type="text" placeholder="Leave your comment..." class="input" v-model="commentData.content" @keydown.enter="handleCreateComment">
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
            <option v-if="issueInfo.project.id !== 0 && issueProjectStates.length > 0" v-for="state in issueProjectStates" :value="state.name">{{ useCapitalize(state.name) }}</option>
          </select>
        </div>


        <button class="button" @click="showUpdateModal = true; editedIssueID = issueInfo.issue.id">Edit</button>
        <div class="details-info">
          <div class="details-title">Details</div>
          <div class="infos">
            <div class="info">
              <div class="important-info">
                <div class="assigned">Assigned: {{ issueInfo.issue.assigned.username }}</div>
                <div class="creator">Creator: {{ issueInfo.issue.creator.username }}</div>
                <div class="issue-tags">Tags: Any</div>
                <div class="priority">Priority:
                  <PriorityIcon :priority="issueInfo.issue.priority"/>
                  {{ issueInfo.issue.priority }}
                </div>
              </div>
              <div class="date-info">
                <div>Created : {{ new Date(issueInfo.issue.created_at).toLocaleString('en-GB', {day: 'numeric', month: "short"}) }}</div>
                <div>Updated : {{ new Date(issueInfo.issue.updated_at).toLocaleString('en-GB', {day: 'numeric', month: "short"}) }}</div>
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