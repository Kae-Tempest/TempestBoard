<script setup lang="ts">
import {reactive} from 'vue';
import {useUserStore} from '~/stores/useUserStore';
import type {User} from "~/types/global";
import {useCustomFetch} from "~/composables/useCustomFetch";
import Toastify from "toastify-js";

useHead({title: 'Register - Tempest Board'})

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
  const res = await useCustomFetch<User>('/users/', {
    method: 'post',
    body: JSON.stringify(data),
  });
  if (res.data.value != null) {
    const user = res.data.value;
    useUserStore().setUser(user);
    await navigateTo('/project');
  } else if (res.error.value?.data) {
    if (res.error.value?.data?.username) errors.username = res.error.value?.data?.username[0];
    if (res.error.value?.data?.email) errors.email = res.error.value?.data?.email[0];
    if (res.error.value?.data?.password) errors.password = res.error.value?.data?.password[0];
    if (res.error.value?.data?.confirm_password) errors.confirm_password = res.error.value?.data?.confirm_password[0];
  } else {
    Toastify({
      text: "An Error as occurred",
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "toast",
    }).showToast();
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