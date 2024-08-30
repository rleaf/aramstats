<script>
export default {
   data() {
      return {
         rouletteArr: [
            'https://preview.redd.it/dhywo66hzm7d1.jpeg?auto=webp&s=283c651d3956bb6492688825a1c941c5b65acedd',
            'https://preview.redd.it/jdskl1qgy46d1.jpeg?auto=webp&s=38a508dedcec217b3fabd248da0113e98999adb6',
            'https://i.redd.it/6p956lq5yiq81.jpg',
            'https://i.redd.it/k8obvr07gfb91.png',
            'https://i.redd.it/uek3ydziwvtb1.jpg',
            'https://i.redd.it/5l3ooufx99ta1.jpg',
            'https://i.redd.it/sz2ffo73jkqa1.jpg',
         ]
      }
   },

   computed: {
      roulette() {
         const dice = Math.floor(Math.random() * this.rouletteArr.length)
         return this.rouletteArr[dice]
      }
   }
}
</script>

<template>
   <div class="fof-main">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <img :src="this.roulette" alt="">
   </div>
</template>

<style scoped>

.fof-main {
   display: flex;
   flex-direction: column;
   width: 100%;
   align-items: center;
   margin-top: 15vh;
   text-align: center;
}

h1 {
   font-family: var(--header-font);
   color: var(--color-font-focus);
   margin: 0;
}

img {
   margin-top: 3vh;
   width: 400px;
}

p {
   color: var(--color-font);
   font-size: 0.9rem;
}
</style>