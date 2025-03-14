import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import Sitemap from 'vite-plugin-sitemap'
// import champions from './src/constants/champions'

// const routes = Object.values(champions).map(n => `/champions/${n[1]}`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Sitemap({
        outDir: './public',
        hostname: 'https://aramstats.lol',
        dynamicRoutes: ['/about', '/champions', '/updates'],
        changefreq: 'weekly',
      }),
    glsl(), // requires `"type": "module"` in package.json
  ],
  assetsInclude: [
    '**/*.glb'
  ],
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
    outDir: './public'
  }
})