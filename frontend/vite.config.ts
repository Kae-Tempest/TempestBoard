import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@img": path.resolve(__dirname, "./src/assets/images"),
			"@interfaces": path.resolve(__dirname, "./src/interfaces"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@enums": path.resolve(__dirname, "./src/enums"),
			"@composable": path.resolve(__dirname, "./src/composable"),
			"@store": path.resolve(__dirname, "./src/store"),
		},
	},
	plugins: [vue()],
	server: {
		host: "0.0.0.0",
	},
});
