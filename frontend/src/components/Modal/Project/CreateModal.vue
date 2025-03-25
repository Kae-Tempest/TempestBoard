<script lang="ts" setup>
	import { X } from "lucide-vue-next";
	import { onBeforeUnmount, onMounted, ref } from "vue";
	import type { ProjectPayload } from "@interfaces/project.interface.ts";
	import { useUserStore } from "@store/useUserStore.ts";
	import { useCustomFetch } from "@composable/useCustomFetch.ts";
	import { ContentType } from "@enums/content-type.enum.ts";

	const dialogRef = ref<HTMLDialogElement | null>(null);
	const isOpened = ref(false);
	const userStore = useUserStore();

	const payload = ref<ProjectPayload>({
		name: "",
		description: "",
		owner: 0,
		thumbnail: null,
		state: "in_progress",
	});

	const handleSetThumb = (e: Event) => {
		const target = e.target;
		if (target instanceof HTMLInputElement && target.files) {
			payload.value.thumbnail = target.files?.[0];
		}
	};

	const handleCreate = async () => {
		await userStore.getUserFromApi();
		payload.value.owner = userStore.id;

		if (payload.value.thumbnail) {
			const formData = new FormData();
			formData.append("name", payload.value.name);
			formData.append("state", payload.value.state);
			formData.append("owner", payload.value.owner.toString());
			formData.append("thumbnail", payload.value.thumbnail as Blob);
			if (payload.value.description) {
				formData.append("description", payload.value.description);
			}

			await useCustomFetch(
				"/projects",
				{
					method: "POST",
					body: formData,
				},
				ContentType.applicationMultipartFormData,
			);
		} else if (!payload.value.thumbnail) {
			await useCustomFetch("/projects", {
				method: "POST",
				body: JSON.stringify(payload.value),
			});
		}
	};

	const openModal = () => {
		if (dialogRef.value) {
			dialogRef.value.showModal();
			isOpened.value = true;
		}
	};

	const closeModal = () => {
		if (dialogRef.value) {
			dialogRef.value.close();
			isOpened.value = false;
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape" && isOpened.value && dialogRef.value) {
			isOpened.value = false;
		}
	};

	onMounted(() => {
		document.addEventListener("keydown", handleKeyDown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("keydown", handleKeyDown);
	});

	defineExpose({
		openModal,
		isOpened,
	});
</script>

<template>
	<dialog id="CreateProjectModal" ref="dialogRef">
		<div class="modal">
			<header>
				<h2>Create Project</h2>
				<X @click="closeModal()" />
			</header>
			<hr />
			<form class="form" @submit.prevent="handleCreate">
				<input v-model="payload.name" placeholder="Name..." type="text" required />
				<textarea v-model="payload.description" placeholder="Project description..."></textarea>
				<input id="" name="" type="file" @change="handleSetThumb($event)" />
				<div class="actions">
					<button type="reset" @click="closeModal()">Cancel</button>
					<button type="submit">Create</button>
				</div>
			</form>
		</div>
	</dialog>
</template>
