<script setup lang="ts">
import {reactive} from 'vue';
import {useUserStore} from '~/stores/useUserStore';
import type {User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";

useHead({title: 'Register - Tempest Board'})
const route = useRoute()
const data = reactive({
  username: '',
  email: '',
  password: '',
  confirm_password: '',
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirm_password: '',
});

const handleSubmit = async () => {

  const res = await useCustomFetch<User>('/register/', {
    method: 'post',
    body: data,
  });
  if (res) {
    useUserStore().setUser(res);
    if(route.query.token) {
      await useCustomFetch<User>(`/accept/`, {
        method: 'post',
        body: {token: route.query.token}
      })
    }
    await navigateTo('/project');
  }
}
</script>
<template>
  <div id="Auth">
    <div>
      <form @submit.prevent=handleSubmit() id="register">
        <div class="flex flex-col">
          <label>Username</label>
          <input
              id="username"
              type="text"
              name="username"
              v-model="data.username"
              class="input"
          />
          <div class="error">{{ errors.username }}</div>
        </div>
        <div>
          <label>Email</label>
          <input
              id="email"
              type="email"
              name="email"
              v-model="data.email"
              class="input"
          />
          <div class="error">{{ errors.email }}</div>
        </div>
        <div>
          <label>Password</label>
          <input
              id="password"
              type="password"
              name="password"
              v-model="data.password"
              class="input"
          />
          <div class="error">{{ errors.password }}</div>
        </div>
        <div>
          <label>Confirm Password</label>
          <input
              id="password_confirmation"
              type="password"
              name="confirm_password"
              v-model="data.confirm_password"
              class="input"
          />
          <div class="error">{{ errors.confirm_password }}</div>
        </div>
        <div>
          <NuxtLink to="/login">Already registered ?</NuxtLink>
          <button type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>