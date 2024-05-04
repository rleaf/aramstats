<script>
export default {
   data() {
      return {
         rouletteArr: [
            'https://cdn.discordapp.com/attachments/160890057459236864/1235082968226336791/884bea0a13f7f916f82f4594099b4904919fe2f3.png?ex=66350e66&is=6633bce6&hm=7a76769d225a358e207fb6e4ca99166830cca77a4dfbd91002a7a860f4790a2f&',
            'https://i.redd.it/6p956lq5yiq81.jpg',
            'https://i.redd.it/k8obvr07gfb91.png',
            'https://i.redd.it/uek3ydziwvtb1.jpg',
            'https://i.redd.it/5l3ooufx99ta1.jpg',
            'https://i.redd.it/sz2ffo73jkqa1.jpg',
         ]
      }
   },

   computed: {
      dne() {
         try {
            decodeURI(this.user.name)
         } catch (e) {
            return 'Malformed name. Check input.'     
         }
         return `${this.user.name}#${this.user.tagLine} (${this.user.region}) does not exist.`
      },

      roulette() {
         const dice = Math.floor(Math.random() * this.rouletteArr.length)
         return this.rouletteArr[dice]
      }
   },

   props: {
      user: {},
      response: null,
      status: null
   }
}
</script>

<template>
   <div class="dne-main">
      <div v-if="this.response === 'Summoner is not parsed.' || this.response === 'Summoner deleted.'">
         <p v-if="this.response === 'Summoner is not parsed.'">Hello, it seems this summoner has never been parsed.</p>
         <p v-else>Sorry, something went wrong on the backend that requires this summoner to be re-parsed :(</p>
         <p class="sub">
            This process can take some time, upwards of 20 minutes, because all viable games and corresponding timelines in the match history are examined.
            <router-link :to="{ name: 'user', params: { region: 'na', gameName: 'Night Owl', tagLine: 'NA1' } }" target="_blank">Here</router-link> is what you can expect to see when the account finishes.
         </p>
         <div @click="$emit('initParse')" class="button">Parse Summoner</div>
      </div>
      <div v-if="this.response === 'Summoner does not exist.'">
         <h2>{{ this.dne }}</h2>
         <br>
         <img :src="this.roulette" alt="">
      </div>

      <div v-if="this.response === 'Forbidden'">
         <h2>API key expired :(</h2>
         <img :src="this.roulette" alt="">
      </div>
      <div v-if="this.status === 504">
         <h2>Riot API servers are probably down.</h2>
         <img :src="this.roulette" alt="">
      </div>
      <div v-if="this.status === 500">
         <h2>Aramstats database seems to be down.</h2>
         <p>I'm a big fan of unscheduled maintenance but feel free to ping me on Discord @<code>ryli.</code> just in case.</p>
         <img :src="this.roulette" alt="">
      </div>
   </div>
</template>

<style scoped>

.button {
   width: 200px;
   margin: 0 auto;
   margin-top: 50px;
   cursor: pointer;
   border-radius: 3px;
   border: 1px solid var(--cell-border);
   background: var(--off-blue);
   font-size: 0.9rem;
   padding: 0.35rem 0.75rem;
   color: var(--color-font);
   font-weight: 600;
   transition: 150ms ease-in-out;
}

.button:hover {
   background: var(--cold-blue-focus);
}

code {
   background: var(--light-16);
   padding: 0.05rem 0.1rem;
   border-radius: 5px;
}
.dne-main {
   display: flex;
   width: 100%;
   justify-content: center;
   margin-top: 15vh;
   text-align: center;
}

img {
   max-height: 60vh;
}

h2 {
   font-weight: normal;
   color: var(--color-font);
   font-size: 0.9rem;
}

p {
   color: var(--color-font);
   width: 500px;
   font-size: 0.9rem;
   line-height: 1.5;
}

p.sub {
   font-size: 0.8rem;
   line-height: 1.5;
   font-weight: normal;
   color: var(--color-font-faded);
}

a {
   color: var(--color-font-faded);
   transition: color 200ms ease-in-out;
}

a:hover {
   color: var(--color-font);
}
</style>