<script setup lang="ts">
const showLayout = defineModel()
const emailData = reactive({
  email: ""
})

const handleSendEmail = async () => {
  const data = await useCustomFetch(`/password/reset/`, {
    method: 'post',
    body: emailData
  })

  if(data) {
    showLayout.value = false
  }

}

</script>

<template>
  <div class="modal is-layout" :class="{'is-active': showLayout}">
    <div class="modal-background" @click="showLayout = false; emailData.email = ''"></div>
    <div class="modal-content">
      <div class="box">
        <div class="control">
        <h2 class="title is-2">Reset Password</h2>
          <div class="field">
            <label>Email: </label>
            <input type="text" class="input" v-model="emailData.email">
          </div>
        </div>
        <div class="action-btn">
          <button class="button" @click="showLayout = false; emailData.email = ''">Cancel</button>
          <button class="button is-dark" @click="handleSendEmail">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
