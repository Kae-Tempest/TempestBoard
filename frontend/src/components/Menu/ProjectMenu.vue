<script lang="ts" setup>
	import { ChevronLeft } from "lucide-vue-next";
	import type { Project } from "@interfaces/project.interface.ts";
	import { ref } from "vue";

	interface Props {
		project: Project;
	}

	defineProps<Props>();
	const isOpen = ref<boolean>(false);
</script>

<template>
	<section id="project-menu">
		<div :class="{ 'open':  isOpen}">
			<button class="menu-trigger" @click="isOpen = !isOpen;">
				{{ project?.name }}
				<ChevronLeft />
			</button>
			<div class="menu-content">
				<ul>
					<li>
						<ul>
							<RouterLink to="{{project?.id}}/active">
								<li>Active</li>
							</RouterLink>
							<RouterLink to="{{project?.id}}/backlog">
								<li>Backlog</li>
							</RouterLink>
						</ul>
					</li>
					<li>
						<RouterLink to="/release"> Releases</RouterLink>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>
