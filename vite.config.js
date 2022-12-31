import { fileURLToPath, URL } from 'node:url'
import replace from '@rollup/plugin-replace'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // replace({
    //   "process.env": import.meta.env,
    // })
  ],
  // define: {
  //   "process.env": process.env
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: './backend/public'
  }
})