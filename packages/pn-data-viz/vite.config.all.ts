/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		plugins: [react()],
		test: {
			globals: true,
			setupFiles: "./src/setupTests.ts",
			environment: "jsdom",
			reporters: ["default"],
		},
	};
});
