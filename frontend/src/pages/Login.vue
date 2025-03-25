<script lang="ts" setup>
	import logo from "@img/logo_black.svg";
	import { useCustomFetch } from "@composable/useCustomFetch.ts";
	import { ref } from "vue";
	import type { loginForm } from "@interfaces/auth.interface.ts";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const payload = ref<loginForm>({
		email: "",
		password: "",
	});

	const handleLogin = async () => {
		try {
			await useCustomFetch("/login", {
				method: "POST",
				body: JSON.stringify(payload.value),
			});
			await router.push("/");
		} catch (error) {
			console.log(error);
		}
	};
</script>

<template>
	<div id="login">
		<form class="login" @submit.prevent="handleLogin">
			<header>
				<h1>Login</h1>
				<img :src="logo" alt="Logo" />
			</header>
			<input id="email" v-model="payload.email" name="email" placeholder="Email.." required type="email" />
			<input
				id="password"
				v-model="payload.password"
				name="password"
				placeholder="Password.."
				required
				type="password" />
			<div class="actions">
				<button type="submit">Login</button>
				<div class="link">
					<span>Forgot Password ?</span>
					<RouterLink to="/register">No Account ?</RouterLink>
				</div>
			</div>
		</form>
	</div>
</template>
