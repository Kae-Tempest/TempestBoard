<script setup lang="ts">
import type {User} from "~/types/global";

interface Props {
  user: User
}

const props = defineProps<Props>()
const showModal = defineModel()

const data = reactive({
  old_password: "",
  new_password: "",
  new_password_confirm: ""
})

const handleClose = () => {
  showModal.value = false
  data.old_password = ""
  data.new_password = ""
  data.new_password_confirm = ""
}

const handleChangePassword = async () => {
  const res = await useCustomFetch(`/users/${props.user.id}/change_password/`, {
    method: "POST",
    body: JSON.stringify(data)
  })
  if (res) {
    handleClose()
  }
}

</script>

<template>
  <div class="modal" :class="{'is-active': showModal}">
    <div class="modal-background" @click="handleClose"></div>
    <div class="modal-content">
      <form @submit.prevent="handleChangePassword" class="box">
        <h2 class="title is-2 title">Change Password !</h2>
        <div class="field">
          <div class="control">
            <label for="old_password">Old Password</label>
            <input type="password" id="old_password" class="input" v-model="data.old_password">
            <label for="new_password">New Password</label>
            <input type="password" class="input" id="new_password" v-model="data.new_password">
            <label for="new_password_confirm">Confirm New Password</label>
            <input type="password" class="input" id="new_password_confirm" v-model="data.new_password_confirm">
          </div>
          <div class="action_button">
            <button class="button" @click="handleClose">Cancel</button>
            <button class="button is-dark" type="submit">Save changes</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>