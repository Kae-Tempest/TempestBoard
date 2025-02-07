<script setup lang="ts">
const route = useRoute()

const dataPwd = reactive({
  password:"",
  confirm_password:"",
  uid: route.params.uid,
  token: route.params.token
})

const handleResetPassword = async () => {
  const data = await useCustomFetch(`/users/password/reset/`, {
    method: "POST",
    body: JSON.stringify(dataPwd)
  })

  if(data) {
    navigateTo('/login')
  }
}
</script>

<template>
  <div id="Auth">
    <form @submit.prevent="handleResetPassword">
      <div id="reset-password">
        <div>
          <label for="">New Password</label>
          <input type="password" class="input" v-model="dataPwd.password">
        </div>
        <div>
          <label for="">Confirm Password</label>
          <input type="password" class="input" v-model="dataPwd.confirm_password">
        </div>
      <div class="actions">
        <button class="button" type="submit">Change Password</button>
      </div>
      </div>
    </form>
  </div>
</template>
