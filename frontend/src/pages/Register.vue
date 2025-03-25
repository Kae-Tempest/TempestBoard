<script lang="ts" setup>
	import logo from "@img/logo_black.svg";
	import { useCustomFetch } from "@composable/useCustomFetch.ts";
	import { ref } from "vue";
	import type { registerForm } from "@interfaces/auth.interface.ts";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const payload = ref<registerForm>({
		username: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	const handleRegister = async () => {
		try {
			await useCustomFetch("/register", {
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
	<div id="register">
		<form class="register" @submit.prevent="handleRegister">
			<header>
				<h1>Register</h1>
				<img :src="logo" alt="Logo" />
			</header>
			<input
				id="username"
				v-model="payload.username"
				minlength="3"
				name="username"
				placeholder="Username.."
				required
				type="text" />
			<input id="email" v-model="payload.email" name="email" placeholder="Email.." required type="email" />
			<input
				id="password"
				v-model="payload.password"
				name="password"
				placeholder="Password.."
				required
				type="password" />
			<input
				id="confirm_password"
				v-model="payload.confirm_password"
				name="confirm_password"
				placeholder="Confirm Password.."
				required
				type="password" />
			<div class="actions">
				<button type="submit">Register</button>
				<div class="link">
					<RouterLink to="/login">Already an Account ?</RouterLink>
				</div>
			</div>
		</form>
	</div>
</template>
