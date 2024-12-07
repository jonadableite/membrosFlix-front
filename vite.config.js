// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		proxy: {
			"/cursos": {
				target: "http://localhost:3001", // URL do seu servidor backend
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
