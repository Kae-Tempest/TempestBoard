import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@img/*": "./src/assets/images/**",
			"@interfaces/*": "./src/interfaces/**",
			"@pages/*": "./src/pages/**",
			"@components/*": "./src/components/**",
			"@enums/*": "./src/enums/**",
			"@composable/*": "./src/composable/**"
		}
	},
	plugins: [vue()],
	server: {
		host: "0.0.0.0"
	}
});
