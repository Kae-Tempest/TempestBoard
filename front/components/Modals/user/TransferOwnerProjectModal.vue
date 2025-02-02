<script setup lang="ts">
import type {Project, User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";

interface Props {
  project: Project | null
}

const props = defineProps<Props>()
const showModal = defineModel()
const isTransferred = defineModel('isTransferred')
const userList = await useCustomFetch<User[]>(`/users/`)
const connected_user = useUserStore().getUser

const data = reactive({
  creator: 0
})

const handleCancel = () => {
  showModal.value = false
}

const handleTransfer = async () => {
  if(!props.project) return
  const res = await useCustomFetch(`/projects/${props.project.id}/`, {
    method: "patch",
    body: data
  })
  if(res) {
    data.creator = 0
    isTransferred.value = true
  }
}

</script>

<template>
    <div class="modal" :class="{'is-active': showModal}">
      <div class="modal-background" @click="handleCancel"></div>
      <div class="modal-content">
        <div class="box">
          <h2>Owner Transfer - {{ project?.name }}</h2>
          <div class="select">
            <select v-if="userList" v-model="data.creator">
              <option :value="user" v-for="user in project?.users.filter(u => u !== connected_user?.id)">{{ userList.find(u => u.id === user)?.username }}</option>
            </select>
          </div>
          <div class="actions">
            <button class="button" @click="handleCancel">Cancel</button>
            <button class="button is-dark" @click="handleTransfer()">Save changes</button>
          </div>
        </div>
      </div>
    </div>
</template>