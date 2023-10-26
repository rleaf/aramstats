<script>
import axios from 'axios'
import champions from '../../constants/champions'

export default {
   data() {
      return {
         builds: null,
         itemBin: [],
         backName: champions.imageName[this.champion.id],
         abilities: [],
         title: '',
         tab: 1,
      }
   },

   created() {
      console.log(this.backName)
      console.log(this.champion)
      this.getChampData()
   },
      
   methods: {
      abilityLetter(idx) {
         switch (idx) {
            case 0:
               return 'P'
            case 1:
               return 'Q'
            case 2:
               return 'W'
            case 3:
               return 'E'
            case 4:
               return 'R'
         }
      },

      getAbilityImages(name, idx) {
         return (idx === 0) ? `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/passive/${name}` :
            `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/spell/${name}.png`
      },

      getChampData() {
         const url = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/data/en_US/champion/${this.backName}.json`
         axios.get(url).then(res => {
            const tomato = res.data.data[this.backName]
            console.log('tomato', tomato)
            this.title = tomato.title
            this.abilities.push(tomato.passive.image.full)
            for (const spell of tomato.spells) {
               this.abilities.push(spell.id)
            }
         })
      },

      mythicImage(Id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${Id}.png`
      },

      toggleItemBin(Id) {
         const idx = this.itemBin.indexOf(Id)
         if (idx === -1) {
            this.itemBin.push(Id)
         }
         else {
            this.itemBin.splice(idx, 1)
         }
      }

   },

   computed: {
      background() {
         const img = new URL(`../../assets/champion_splash/${this.backName.toLowerCase()}.webp`, import.meta.url).href
         return `linear-gradient(to right, rgba(var(--tint100RGB), 1.0), rgba(var(--tint100RGB), 0.9) 10%, rgba(var(--tint100RGB), .8) 60%, rgba(var(--tint100RGB), .7) 90%), no-repeat -20% 15%/100% url('${img}')`
      },

      winrate() {
         return `${Math.round((this.champion.wins / this.champion.games) * 1000) / 10}%`
      },

      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.backName}.png`
      }
   },

   props: {
      champion: null,
      patch: null
   }
}


</script>

<template>
   <div class="champion-ready-main">
      <div class="champion-wrapper">
         <div class="champion-head" :style="{ background: background }">
            <div class="champion-profile">
               <div class="champion-image">
                  <img :src="champIcon" alt="" @click="test()">
               </div>
               <div class="champion-right">
                  <div class="champion-name">
                     {{this.champion.name}} <h2>{{ this.title }}</h2>
                  </div>
                  <div class="champion-abilities">
                     <div v-for="(img, i) in this.abilities">
                        <img :src="getAbilityImages(img, i)" rel="preload">
                        <div class="spell-letter">
                           {{ abilityLetter(i) }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="champion-header-cell">
               <h3>Winrate</h3>
               {{ winrate }}
               <h4>
                  {{ this.champion.games }} games
               </h4>
            </div>
         </div>
   
         <!-- <div class="body-tabs">
            <div class="tab" @click="this.tab = 1">
               General
            </div>
            <div class="tab" @click="this.tab = 2">
               Builds & Items
            </div>
         </div> -->

         <div class="body">
            <div class="tldr body-1">
               <h2>tldr</h2>
               <div class="body-2">
                  toad
               </div>
            </div>
            
            <div class="builds body-1">
               <h2>Builds</h2>
               <div class="item-bin">
                  <img :src="mythicImage(i)" @click="this.toggleItemBin(i)" rel="preload" v-for="i in Object.keys(this.champion.items)">
               </div>

            </div>

            <div class="abilities body-1">
               <h2>Abilities</h2>
               
            </div>

            <div class="runes body-1">
               <h2>Runes</h2>
            </div>
            <!-- <div class="builds" v-if="this.tab === 1">
            </div>

            <div class="items" v-if="this.tab === 2">
            </div> -->
         </div>
   
      </div>
   </div>
</template>

<style scoped>
   .champion-name {
      display: inline-block;
   }

   .champion-name h2 {
      display: inline-block;
      margin: 0;
      margin-left: 0.2rem;
      font-style: italic;
      font-size: 1rem;
      font-weight: normal;
      color: var(--tint400);
   }
   .champion-right {
      display: flex;
      height: 100%;
      justify-content: space-evenly;
      flex-direction: column;
      font-size: 1.5rem;
   }
   .champion-profile {
      gap: 20px;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
   }

   .champion-head {
      display: flex;
      border-radius: 15px;
      align-items: center;
      height: 200px;
      padding: 0;
      /* justify-content: space-between; */
      gap: 4rem;
      width: 100%;
      font-size: 1.3rem;
      font-weight: bold;
      color: var(--color-font);
   }

   .champion-head h3 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: normal;
      color: var(--tint400);
   }
   
   .champion-head h4 {
      margin: 0;
      font-size: 0.9rem;
      font-style: italic;
      font-weight: normal;
      color: var(--tint400);

   }

   .champion-image {
      overflow: hidden;
      margin-left: 40px;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      box-shadow: 0 0 0 4px var(--color-background);
   }

   .champion-abilities {
      height: 38px;
   }
   .champion-abilities img {
      width: 36px;
      border: 1px solid var(--tint400);
   }
   
   .champion-abilities > div {
      display: inline-block;
   }

   .spell-letter {
      position: relative;
      top: -23px;
      left: -9px;
      font-size: 0.85rem;
      background: rgba(13, 17, 28, 0.9);
      font-weight: normal;
      text-align: center;
      width: 0.9rem;

   }
   .champion-abilities div:not(:first-child) {
      margin-left: 10px;
   }

   .champion-image img {
      width: 100%;
      transform: scale(1.1);
      /* border-radius: 100%; */
   }

   .champion-wrapper {
      width: 1100px;
   }

   .champion-ready-main {
      margin-top: 10vh;
      display: flex;
      align-items: center;
      flex-direction: column;
   }

   .body-tabs {
      margin-top: 50px;
      color: var(--color-font);
      border-bottom: 1px solid var(--tint400);
      width: 100%;
   }

   .body-tabs div:first-child {
      /* margin-left: 0.8rem; */
   }

   .body-tabs div:not(:first-child) {
      margin: 0 1rem;
   }

   .body {
      margin-top: 50px;
   }

   .body div:not(:first-child) {
      margin-top: 20px;
   }

   .body-2 {
      background: var(--tint100);
      border-radius: 15px;
   }
   .body h2 {
      color: var(--tint400);
      margin: 1rem;
      font-size: 1.1rem;
      font-style: italic;
      font-weight: normal;
   }

   .tab {
      background: var(--tint100);
      font-size: 0.9rem;
      border-radius: 10px 10px 0 0;
      border-top: 1px solid var(--tint400);
      border-left: 1px solid var(--tint400);
      border-right: 1px solid var(--tint400);
      cursor: pointer;
      padding: 0.5rem 1rem;
      display: inline-block;
      transition: 0.25s;
   }

   .tab:hover {
      background: var(--hoverButton);
   }

   .item-bin {
      /* margin: 1rem 0; */
      /* text-align: center; */
      padding: 1rem 0;
      border-radius: 15px;
      background: var(--tint100);
      justify-content: center;
      /* align-items: center; */
      width: 100%;
   }

   .item-bin img {
      width: 40px;
      /* filter: brightness(0.8) saturate(0.5); */

   }
</style>