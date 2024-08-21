import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueGtag from 'vue-gtag'
import VueHead from 'vue-head'

// import './assets/main.css'
import './assets/new_main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueHead)
app.use(VueGtag, {
   config: { id: "G-PD6QYJ923C"}
})

app.mount('#app')
