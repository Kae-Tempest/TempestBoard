import { defineStore } from "pinia";
import type { User } from "../interfaces/user.interface.ts";
import { ref } from "vue";
import { useCustomFetch } from "@composable/useCustomFetch.ts";

export const useUserStore = defineStore("userStore", () => {
	const user = ref<User | null>(null);
	const id = ref<number>(0);

	const setUser = (data: User | null) => {
		if (data) {
			user.value = data;
			id.value = data.ID;
		} else {
			user.value = null;
			id.value = 0;
		}
	};

	const getUserFromApi = async () => {
		try {
			const userData = await useCustomFetch<User>("/users/me");
			console.log(userData);
			if (userData) {
				console.log(userData);
				setUser(userData as User);
				console.log("user data", user.value?.ID);
			}
		} catch (error) {
			console.error("Failed to fetch user data", error);
		}
	};

	return {
		user,
		id,
		setUser,
		getUserFromApi,
	};
});
