<script>
export default {
   data() {
      return {
         book: {
            101105: ['No hiding', 'Kill enemies near one of their own turrets in ARAM'],
            101204: ['Free Money', 'Kill minions in ARAM	'],
            101205: ['Free Ticket to Base', 'Successfully Execute to the outer tower before 10 minutes in ARAM'],
            101206: ['Pop Goes the Poro', 'Cause a Poro to explode in ARAM'],
            101306: [`Can't Touch This`, 'Win ARAM games without being killed by an enemy champion (you can still be executed)'],
            101201: ['Another Day, Another Bullseye', 'Hit skillshots (ranged untargeted abilities) on champions in ARAM'],
            101203: ['Snow Day', 'Hit snowballs on champions in ARAM'], 
            101000: ['Aram Authority', 'Earn points from challenges in the ARAM Warrior, ARAM Finesse, and ARAM Champion groups'],
            101100: ['Aram Warrior', 'Earn points from challenges in the ARAM Warrior group'],
            101200: ['Aram Finesse', 'Earn points from challenges in the ARAM Finesse group'],
            101300: ['Aram Champion', 'Earn points from challenges in the ARAM Champion group'],
            101103: ['Aram Legend', 'Go Legendary in ARAM games'],
            101106: ['ARAM Eradication', 'Get Pentakills in ARAM'],
            101301: [`All Random All Champions`, 'Earn an S- grade or higher on different champions in ARAM'],
            101305: ['Active Participant', 'Have over 90% Kill Participation in ARAM games'],
            101302: ['All Random All Flawless', 'Earn S grades or higher in ARAM'],
            101104: ['Bad Medicine', 'Kill opponents who recently received a health pack in ARAM'],
            101107: ['Farm Champs Not Minions', 'Get Takedowns in ARAM'],
            101303: ['Rapid Demolition', 'Take the first turret in ARAM before five minutes have passed'],
            101101: ['DPS Threat', 'Deal more than 1800 Damage Per Minute in ARAM games'],
            101102: ['Double Decimation', 'Get two Pentakills in a single ARAM game'],
            101304: ['Lightning Round', 'Win ARAM games before 10 minutes have passed'],
            101108: ['Solo Carry', `Deal 40% or more of your team's damage to champions in ARAM`],
            101307: ['NA-RAM', 'Win ARAM Games'],
            101202: ['It was a... Near-Hit', 'Dodge skillshots (ranged untargeted abilities) in ARAM']
         }
      }
   },

   methods: {
      img(id, tier) {
         return new URL(`../assets/challenge_icons/${id}-${tier}.webp`, import.meta.url).href
      },

      challengeName(id) {
         return this.book[id][0]
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
      <div class="challenge-wrapper">

         <div class="challenge" v-for="el in challenges" :key="el.challengeId" v-if="this.data">
            <div class="img-wrapper">
               <img :src="img(el.challengeId, el.level)" />
            </div>
            <div class="title">
               <p class="challenge-title">
                  {{ this.challengeName(el.challengeId) }}
               </p>
               <p class="percentile">
                  Top: {{ Math.round((el.percentile * 10000) ) / 100 }}%
               </p>
            </div>
            <div class="description">
               {{ this.book[el.challengeId][1] }}
            </div>
         </div>
      </div>
      <div class="challenge-message" v-if="!this.data">
         Update summoner.
      </div>
   </div>
</template>

<style scoped>
.challenge-title {
   /* white-space: pre; */
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
   width: 370px;
   gap: 10px;
   color: var(--color-font);
}

.title {
   width: 100px;
}

.challenge p {
   margin: 0;
}

p.percentile {
   color: var(--color-font-faded);
   font-size: 0.75rem;
}

.description {
   color: var(--color-font-faded);
   font-size: 0.8rem;
   width: 50%;
   font-style: italic;
}

.challenge-wrapper {
   display: flex;
   width: 50%;
   flex-direction: column;
   /* flex-wrap: wrap; */
   /* align-content: center;
   justify-content: center; */
   row-gap: 10px;
   padding: 30px;
   /* height: 750px; */
   
}

.challenge-main {
   border-radius: 15px;
   margin: 20px 0;
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