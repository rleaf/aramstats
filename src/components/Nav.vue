<script>
   import { RouterLink, RouterView } from 'vue-router'

   export default {
      inheritAttrs: false,
      data() {
         return {
            day: false
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
      }
   }

</script>

<template>
   <nav>
      <div class="left">
         <RouterLink to="/">Home</RouterLink>
      </div>
      <div class="right">
         <button @click="this.theme()" :class="{day: this.day}">
            <div class="theme"></div>
         </button>
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
   padding-left: 0.5rem;
   padding-right: 0.5rem;
   font-size: 1.1rem;
   text-decoration: none;
   color: var(--color-font);
   transition: 0.4s;
}

a:hover {
   color: var(--color-font-hover);
}

button {
   background: none;
   outline: none;
   border: none;
   cursor: pointer;
   padding: 0;
   margin-right: 1.5rem;
}

.theme {
      background-color: var(--color-font);
      width: 1.5rem;
      height: 1.5rem;
      /* mask-image: var(--themeSVG); */
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