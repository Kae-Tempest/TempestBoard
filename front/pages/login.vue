<script setup lang="ts">
import CustomCheckbox from '~/components/Checkbox/LoginCustomCheckbox.vue';
import {useUserStore} from "~/stores/useUserStore";
import type {User} from "~/types/global";
import Toastify from "toastify-js";
import ResetPasswordLayout from "~/components/layout/ResetPasswordLayout.vue";

useHead({title: 'Login - Tempest Board'})

const showResetPasswordLayout = ref<boolean>(false)

const data = reactive({
  email: '',
  password: '',
  remember: false,
});
const errors = reactive({
  msg: '',
});

const handleCheckboxChange = (newValue: any) => {
  data.remember = newValue;
};

const handleSubmit = async () => {
  const res = await useCustomFetch('/login/', {
    method: 'post',
    body: JSON.stringify(data),
  });
  if (res.data.value != null) {
    const user = res.data.value as User;
    useUserStore().setUser(user);
    await navigateTo('/');
  } else {
    Toastify({
      text: res.error.value?.data?.msg || 'An error occurred',
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "toast",
    }).showToast();
  }
};


</script>

<template>
  <ResetPasswordLayout v-model="showResetPasswordLayout" />
  <div id="Auth">
    <div>
      <form @submit.prevent="handleSubmit()" id="login">
        <div>
          <label>Email</label>
          <input
              id="email"
              type="email"
              name="email"
              v-model="data.email"
              class="input"
          />
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
          <div class="error">{{ errors.msg }}</div>
        </div>
        <CustomCheckbox
            label="Remember me"
            @update:checked="handleCheckboxChange"
            v-model="data.remember"
        />
        <div class="action_btn">
          <NuxtLink to="/register">No account ?</NuxtLink>
          <span @click="showResetPasswordLayout = true">Forgotten password</span>
          <button type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>