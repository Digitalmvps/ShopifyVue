// @ts-nocheck
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import path from "path";
import { dynamicImport } from 'vite-plugin-dynamic-import'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import laravel from 'vite-plugin-laravel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    laravel({
        postcss: [
            tailwindcss(),
            autoprefixer(),
        ],
    }),,
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
})
