<script setup lang="ts">

import type {Issue, Project, User} from "~/types/global";
import PriorityIcon from "~/components/Icon/PriorityIcon.vue";
import Toastify from "toastify-js";

interface Props {
  issue: Issue;
  projects: Project[];
  users: User[];
}

const props = defineProps<Props>();

const IssueAssignedClicked = defineModel<boolean>()
const dropdownIdOpen = defineModel<number | null>('dropdownIdOpen')

const issue = computed(() => props.issue)
const projects = computed(() => props.projects)
const project = computed(() => projects.value.find(p => p.id === issue.value.project))

const users = ref<User[] | null>([]);

const UpdateAssignedUser = async (u: number) => {
  const res = await useCustomFetch(`/issues/${props.issue.id}/`, {
    method: 'PATCH',
    body: {
      "assigned": u
    }
  })
  if (res.error.value) {
    // TODO : TOAST
  }
  if (!res.error.value) {
    const {data} = await useCustomFetch<User>(`/users/${u}/`);
    issue.value.assigned = data.value as User
  } else if (res.error.value) {
    Toastify({
      text: "An error as occurred",
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "toast",
    }).showToast();
  }
  dropdownIdOpen.value = null
}

const onClickUser = () => {
    IssueAssignedClicked.value = true;
    if (issue.value.id !== dropdownIdOpen.value) {
        dropdownIdOpen.value = issue.value.id
    } else if (issue.value.id === dropdownIdOpen.value) {
        dropdownIdOpen.value = null
    } else {
        dropdownIdOpen.value = issue.value.id
    }
}

</script>

<template>
  <div class="issue-list">
    <div v-if="project" class="issue-list-item">
      <div class="issue-info">
        <div class="issue-content">
          <div class="priority">
            <PriorityIcon :priority="issue.priority"/>
          </div>
          <div class="tag-number">
            {{ project.name.substring(0, 3).toUpperCase() }}-{{ issue.ticket_id }}
          </div>
          <div class="title-issue">{{ issue.title }}</div>
        </div>
        <div class="other-info">
          <div class="user-tag">
            <div class="dropdown" :class="{'is-active': dropdownIdOpen === issue.id}">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span @click="onClickUser" class="tag">{{ issue.assigned.username }}</span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <div v-for="user in project.users.filter(u => u != issue.assigned.id)" class="users-list">
                    <div v-if="project.users.length >= 2" @click="IssueAssignedClicked = true; UpdateAssignedUser(user)" class="dropdown-item">{{ users?.find(u => u.id === user)?.username }}</div>
                  </div>
                  <div class="any-user" v-if="project.users.length == 1">Any User..</div>
                </div>
              </div>
            </div>
          </div>
          <div class="project-content">
            <div class="tag">{{ project.name }}</div>
            <div>{{ new Date(issue.created_at).toLocaleString('en-GB', {day: 'numeric', month: "short"}) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
