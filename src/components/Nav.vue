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
      <div class="right">
         <div class="toad">
         </div>
         <button @click="this.theme()" :class="{day: this.day}">
            <div class="theme"></div>
         </button>
         <RouterLink class="text" to="/updates">Updates</RouterLink>
         <RouterLink class="text" to="/about">About</RouterLink>
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
   align-items: center;
}

.toad {
   overflow: hidden;
}

svg {
   margin: 0 0.5rem;
}

.right svg rect {
   fill: tomato;
}

nav .left {
   display: flex;
   padding-left: 2rem;
}

nav .right {
   display: flex;
   align-items: center;
   padding-right: 2rem;
}

.text, .theme {
   display: inline-block;
   vertical-align: middle;
}

a {
   margin: 0 0.5rem;
   padding: 0.4rem 0.7rem;
   font-size: 0.95rem;
   text-decoration: none;
   color: var(--color-font);
   border-radius: 8px;
   transition: 0.2s ease-in-out;
}

a:hover {
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
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
   width: 27px;
   height: 27px;
   mask-image: var(--theme-icon);
   mask-position: center;
   mask-size: var(--theme-mask-size);
   mask-repeat: no-repeat;
   transition: 0.25s ease-in-out;
   -webkit-mask-image: var(--theme-icon);
   -webkit-mask-position: center;
   -webkit-mask-size: var(--theme-mask-size);
   -webkit-mask-repeat: no-repeat;
}
</style>