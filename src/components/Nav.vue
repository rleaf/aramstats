<script>
   import { RouterLink, RouterView } from 'vue-router'
   import { userReadyStore } from '../stores/userReady'

   export default {
      inheritAttrs: false,
      data() {
         return {
            day: false,
            store: userReadyStore()
         }
      },

      mounted() {
         if (JSON.parse(localStorage.getItem('theme'))) this.theme()
      },

      methods: {
         theme() {
            this.day = !this.day
            document.querySelector('body').classList.toggle('day')
            localStorage.setItem('theme', JSON.stringify(this.day))
         }
      },
   }

</script>

<template>
   <nav>
      <div class="left">
         <RouterLink to="/">Home</RouterLink>
         <RouterLink to="/champions">Champions</RouterLink>
      </div>
      <!-- <input v-if="this.store.userReady" type="text"> -->
      <div class="right">
         <button @click="this.theme()" :class="{day: this.day}">
            <div class="theme"></div>
         </button>
         <RouterLink class="text" to="/about">About</RouterLink>
         <RouterLink class="text" to="/updates">Updates</RouterLink>
      </div>
   </nav>
   <RouterView />
</template>

<style scoped>

nav {
   height: 5rem;
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
}


nav .left {
   padding-left: 2rem;
}

nav .right {
   padding-right: 2rem;
}

.text, .theme {
   display: inline-block;
   vertical-align: middle;
}

a {
   margin: 0 0.5rem;
   padding: 0.4rem 0.7rem;
   font-weight: 500;
   font-size: 1rem;
   text-decoration: none;
   color: var(--color-font);
   transition: 0.4s;
   border-radius: 8px;
}

a:hover {
   transition: 0.2s ease-in-out;
   background: var(--tint200);
}


button {
   background: none;
   outline: none;
   border: none;
   cursor: pointer;
   padding: 0;
   margin-right: 0.5rem;
}

.theme {
      background-color: var(--color-font);
      width: 1.5rem;
      height: 1.5rem;
      mask-image: var(--themeIcon);
      mask-position: center;
      mask-size: 60%;
      mask-repeat: no-repeat;
      /* -webkit-mask-image: var(--themeSVG); */
      -webkit-mask-image: var(--themeIcon);
      -webkit-mask-position: center;
      -webkit-mask-size: 85%;
      -webkit-mask-repeat: no-repeat;
   }

</style>