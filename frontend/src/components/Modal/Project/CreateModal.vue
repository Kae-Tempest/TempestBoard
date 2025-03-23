<script lang="ts" setup>
	import { X } from "lucide-vue-next";
	import { onBeforeUnmount, onMounted, ref } from "vue";

	const dialogRef = ref<HTMLDialogElement | null>(null);
	const isOpened = ref(false);

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
		isOpened
	});
</script>

<template>
	<dialog id="CreateProjectModal" ref="dialogRef">
		<div class="modal">
			<header>
				<h2>Create Project</h2>
				<X @click="closeModal()" />
			</header>
			<hr>
			<form class="form">
				<input placeholder="Name..." type="text">
				<textarea placeholder="Project description..."></textarea>
				<input id="" name="" type="file">
				<div class="actions">
					<button type="reset" @click="closeModal()">Cancel</button>
					<button type="submit">Create</button>
				</div>
			</form>
		</div>
	</dialog>
</template>
