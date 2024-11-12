<script setup lang="ts">
const route = useRoute()

const dataPwd = reactive({
  password:"",
  confirm_password:"",
  uid: route.params.uid,
  token: route.params.token
})

const handleResetPassword = async () => {
  const {data, error} = await useCustomFetch(`/users/password/reset/`, {
    method: "POST",
    body: dataPwd
  })

  if(data) {
    console.log(data)
  } else if (error) {
    console.log(error)
  }
}
</script>

<template>
  <div id="Auth">
    <div>
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
        <button class="button" @click="handleResetPassword">Change Password</button>
      </div>
      </div>
    </div>
  </div>
</template>
