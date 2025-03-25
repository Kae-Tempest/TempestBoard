<script lang="ts" setup>
	import LogoBack from "@img/logo_text_black.svg";
	import defaultUser from "@img/user.png";
	import { Search, SquarePen } from "lucide-vue-next";
	import { onBeforeUnmount, onMounted, ref } from "vue";
	import ProjectMenu from "./Menu/ProjectMenu.vue";

	const isOpen = ref<boolean>(false);
	const dropdownRef = ref<HTMLElement | null>(null);
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
			users: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]);

	const openDropdown = () => {
		isOpen.value = !isOpen.value;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node) && isOpen.value) {
			isOpen.value = false;
		}
	};

	onMounted(() => {
		document.addEventListener("click", handleClickOutside);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("click", handleClickOutside);
	});
</script>

<template>
	<aside id="navbar">
		<header>
			<img :src="LogoBack" alt="Icon app" class="logo" />
			<div ref="dropdownRef" class="dropdown">
				<div class="dropdown-trigger" @click="openDropdown()">
					<img :src="defaultUser" alt="user thumbnail" class="dropdown-thumbnail" />
				</div>
				<div :class="{ active: isOpen }" class="dropdown-menu">
					<menu>
						<li>Profile</li>
						<RouterLink to="/project">
							<li>Project</li>
						</RouterLink>
						<li>Logout</li>
					</menu>
				</div>
			</div>
		</header>

		<div class="actions-container">
			<button class="new_issue">
				<SquarePen :size="20" />
				New Issue
			</button>
			<button class="search">
				<Search :size="20" />
			</button>
		</div>

		<nav>
			<menu>
				<li>My Issue</li>
				<li>
					<menu v-for="project in projects" :key="project.id" class="menu">
						<ProjectMenu :project="project" />
					</menu>
				</li>
			</menu>
		</nav>
	</aside>
</template>
