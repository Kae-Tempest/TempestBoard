import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/Login.vue";
import MyIssue from "./pages/MyIssue.vue";
import Register from "./pages/Register.vue";
import Project from "./pages/Project.vue";

const routes = [
	{ path: "/", component: MyIssue },
	{ path: "/login", component: Login },
	{ path: "/register", component: Register },
	{ path: "/project", component: Project }
];

export const router = createRouter({ history: createWebHistory(), routes });
