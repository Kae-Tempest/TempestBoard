import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: true,
        }),
        reactRefresh({
            excludeExports: ["mapStateToProps", "mapDispatchToProps"],
        }),
    ],
});
