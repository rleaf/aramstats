<script>
export default {
   data() {
      return {
         book: {
            101105: 'No hiding',
            101204: 'Free Money',
            101205: 'Free Ticket\nto Base',
            101206: 'Pop Goes\nthe Poro',
            101306: `Can't Touch This`,
            101201: 'Another Day,\nAnother Bullseye',
            101203: 'Snow Day', 
            101000: 'Aram Authority',
            101100: 'Aram Warrior',
            101200: 'Aram Finesse',
            101300: 'Aram Champion',
            101103: 'Aram Legend',
            101106: 'ARAM Eradication',
            101301: `All Random\nAll Champions`,
            101305: 'Active Participant',
            101302: 'All Random\nAll Flawless',
            101104: 'Bad Medicine',
            101107: 'Farm Champs\nNot Minions',
            101303: 'Rapid Demolition',
            101101: 'DPS Threat',
            101102: 'Double\nDecimation',
            101304: 'Lightning\nRound',
            101108: 'Solo Carry',
            101307: 'NA-RAM',
            101202: 'It was a...\nNear-Hit'
         }
      }
   },

   methods: {
      img(id, tier) {
         return new URL(`../assets/challenge_icons/${id}-${tier}.webp`, import.meta.url).href
      },

      challengeName(id) {
         return this.book[id]
      }
   },

   computed: {
      challenges() {
         console.log(this.data)
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
         <div>
            <p class="challenge-title">
               {{ challengeName(el.challengeId) }}
            </p>
            <p class="percentile">
               Top: {{ Math.round((el.percentile * 10000) ) / 100 }}%
            </p>
         </div>
      </div>
      <div class="challenge-message" v-if="!this.data">
         Update summoner.
      </div>
   </div>
</template>

<style scoped>
.challenge-title {
   white-space: pre;
   font-size: 0.8rem;
}

.challenge img {
   width: 45px;
}

.img-wrapper {
   height: 50px;
}

.challenge {
   display: flex;
   align-items: center;
   gap: 10px;
   color: var(--color-font);
}

.challenge p {
   margin: 0;
}

p.percentile {
   color: var(--color-font-faded);
   font-size: 0.75rem;
}

.challenge-main {
   display: flex;
   flex-direction: column;
   flex-wrap: wrap;
   /* align-content: center;
   justify-content: center; */
   row-gap: 20px;
   border-radius: 15px;
   padding: 15px;
   margin: 20px 0;
   height: 500px;
   background: var(--cell-panel);
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