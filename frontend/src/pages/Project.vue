<script lang="ts" setup>
	import Navbar from "@components/Navbar.vue";
	import { CalendarFold, Pencil, Plus, Settings, Trash, User } from "lucide-vue-next";
	import { ref } from "vue";
	import CreateModal from "@components/Modal/Project/CreateModal.vue";

	const projects = ref([
		{
			id: 1,
			name: "TempestBoard",
			owner: {
				id: 1,
				username: "kae",
				email: "kae.tempest@gloupi.com",
				roles: [],
				admin: false,
			},
			description:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consectetur corporis cumque dolorum est ipsum, nam perferendis repellat tempora veritatis? Accusantium autem dolores molestias nobis quos voluptate voluptatum? Aperiam assumenda commodi consectetur dolore, doloremque dolores dolorum expedita, fuga illo iusto minus nisi placeat quas quasi rerum sit tempora totam voluptates?",
			users: [
				{
					id: 1,
					username: "kae",
					email: "kae.tempest@gloupi.com",
					roles: [],
					admin: false,
				},
			],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 1,
			name: "TempestBoard",
			owner: {
				id: 1,
				username: "kae",
				email: "kae.tempest@gloupi.com",
				roles: [],
				admin: false,
			},
			users: [
				{
					id: 1,
					username: "kae",
					email: "kae.tempest@gloupi.com",
					roles: [],
					admin: false,
				},
			],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 1,
			name: "TempestBoard",
			owner: {
				id: 1,
				username: "kae",
				email: "kae.tempest@gloupi.com",
				roles: [],
				admin: false,
			},
			users: [
				{
					id: 1,
					username: "kae",
					email: "kae.tempest@gloupi.com",
					roles: [],
					admin: false,
				},
			],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]);

	const modalRef = ref<InstanceType<typeof CreateModal> | null>(null);

	const openModalFromParent = () => {
		if (modalRef.value) {
			modalRef.value.openModal();
		}
	};
</script>

<template>
	<div id="project">
		<CreateModal v-show="modalRef?.isOpened" ref="modalRef" />
		<Navbar />
		<section>
			<div class="container">
				<header>
					<h1 class="title">Project</h1>
					<hr class="separator" />
				</header>
				<main>
					<button class="create-button" @click="openModalFromParent()">
						<Plus />
					</button>
					<div class="project-list">
						<div v-for="project in projects" :key="project.id" class="card">
							<div class="media">
								<div class="bg"></div>
							</div>
							<header>
								<h2>{{ project.name }}</h2>
								<div class="date">
									<CalendarFold :size="16" />
									{{
										project.createdAt?.toLocaleString("en-GB", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})
									}}
								</div>
							</header>
							<div class="card-content">
								<p>{{ project.description }}</p>
							</div>
							<footer>
								<div class="actions">
									<button>
										<Trash :size="20" />
									</button>
									<button>
										<Pencil :size="20" />
									</button>
									<button>
										<Settings :size="20" />
									</button>
								</div>
								<div class="users-infos">
									{{ project.users.length }}
									<User />
								</div>
							</footer>
						</div>
					</div>
				</main>
			</div>
		</section>
	</div>
</template>
