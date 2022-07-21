// @ts-nocheck
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import path from "path";
import { dynamicImport } from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	vue(),
	ViteRequireContext,
	dynamicImport
],
resolve: {
	alias: [{
		find: "@",
        replacement: path.resolve(__dirname, "src"),
	}]
  },
  build: {
    outDir: 'dist/client'
  }
})
