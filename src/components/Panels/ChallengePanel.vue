<script>
export default {
   data() {
      return {
         book: {
            101105: 'No hiding',
            101000: 'Aram Authority',
            101100: 'Aram Warrior',
            101200: 'Aram Finesse',
            101300: 'Aram Champion',
            101103: 'Aram Legend',
            101106: 'ARAM Eradication',
            101301: 'All Random All Champions',
            101305: 'Active Participant',
            101302: 'All Random All Flawless',
            101303: 'Rapid Demolition',
            101101: 'DPS Threat',
            101304: 'Lightning Round',
            101108: 'Solo Carry',
            101307: 'NA-RAM',
            101202: 'It was a... Near-Hit'
         }
      }
   },

   methods: {
      img(id, tier) {
         return new URL(`../../assets/challenge_icons/${id}-${tier}.png`, import.meta.url).href
      },

      challengeName(id) {
         return this.book[id]
      }
   },

   computed: {
      challenges() {
         return this.data.sort((a, b) => {
            const x = this.challengeName(a.challengeId)
            const y = this.challengeName(b.challengeId)
            
            return x.localeCompare(y)
         })
      }
   },

   props: {
      data: null,
   }

}
</script>

<template>
   <div class="challenge-main">
      <div class="challenge" v-for="el in challenges" :key="el.challengeId" v-if="this.data">
         <div class="img-wrapper">
            <img :src="img(el.challengeId, el.level)" />
         </div>
         <p>
            {{ challengeName(el.challengeId) }}
         </p>
         <p class="percentile">
            Percentile: {{ el.percentile }}
         </p>
      </div>
      <div class="challenge-message" v-if="!this.data">
         Update summoner.
      </div>
   </div>
</template>

<style scoped>
   .challenge img {
      width: 70px;
   }

   .img-wrapper {
      height: 75px;
   }

   .challenge {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 171px;
      color: var(--color-font);
      font-size: 14px;
   }

   .challenge p {
      margin: 0;
   }

   p.percentile {
      color: var(--light700);
      font-size: 12px;
   }
   .challenge-main {
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      height: 390px;
      border-radius: 10px;
      background: var(--profile-panel);
   }

   .challenge-scroll {
      overflow: hidden;
   }
   .challenge-message {
      position: relative;
      left: 50%;
      transform: translateX(-50%); 
      color: var(--color-font);
   }
</style>