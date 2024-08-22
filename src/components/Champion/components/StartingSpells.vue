<script>
import UXTooltip from '@/components/UXTooltip.vue'
import StartingSpellsModal from './modals/StartingSpellsModal.vue'
import { superStore } from '@/stores/superStore'

export default {
   components: {
      UXTooltip,
      StartingSpellsModal,
   },
   data() {
      return {
         store: superStore()
      }
   },

   methods: {
      itemImage(id) {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/item/${id}.png`
      },

      spellImage(id) {
         return new URL(`../../../assets/spells/${id}.webp`, import.meta.url).href
      },
      
      getAbilityImages(ability) {
         if (this.store.championCDN) {
            return this.store.championCDN.abilities[ability.toUpperCase()][0].icon
         }
      },

      winrate(total, win) {
         return (win / total * 100).toFixed(1) + '%'
      },
   },

   props: {
      champion: null,
      patch: null,
      abilities: null,
   }
}
</script>

<template>
   <div class="starting-spells-main" id="spells">
      <div class="section-header">
         <h1>Starting Items / Spells / Skill Priority</h1>
         <StartingSpellsModal />
      </div>
      <div class="section">
         <div>
            <div class="sub-section-header">
               <div class="title">Starting Items</div>
               <UXTooltip :tip="'starting'" />
            </div>
            <div class="iter-wrapper">
               <div v-for="(i, i2) in this.champion.starting" :key="i2">
                  <div>
                     <div class="winrate">{{ this.winrate(i.v.games, i.v.wins) }}</div>
                     <div class="total">{{ i.v.games }}</div>
                  </div>
                  <div class="images">
                     <img v-if="i.k === '0000'" src="@/assets/images/no_items.jpg">
                     <img v-else :src="this.itemImage(o)" v-for="(o, o2) in i.k.split('_')" :key="o2">
                  </div>
                  
               </div>
            </div>
         </div>
         <div>
            <div class="sub-section-header">
               <div class="title">Spells</div>
               <UXTooltip :tip="'spells'" />
            </div>
            <div class="iter-wrapper">
               <div v-for="(i, i2) in this.champion.spells" :key="i2">
                  <div>
                     <div class="winrate">{{ this.winrate(i.v.games, i.v.wins) }}</div>
                     <div class="total">{{ i.v.games }}</div>
                  </div>
                  <div class="images">
                     <img :src="this.spellImage(o)" v-for="(o, o2) in i.k.split('_')" :key="o2">
                  </div>
               </div>
            </div>
         </div>
         <div>
            <div class="sub-section-header">
               <div class="title">Skill Priority</div>
               <UXTooltip :align="'right'" :tip="'skillPriority'" />
            </div>
            <div class="iter-wrapper">
               <div v-for="(i, i2) in this.champion.skills" :key="i2">
                  <div>
                     <div class="winrate">{{ this.winrate(i.v.games, i.v.wins) }}</div>
                     <div class="total">{{ i.v.games }}</div>
                  </div>
                  <div class="images">
                     <div class="skill-wrapper" v-for="(o, o2) in i.k.split('')" :key="o2">
                        <div class="skill">
                           <div>{{ o.toUpperCase() }}</div>
                           <img :src="this.getAbilityImages(o)">
                        </div>
                        <svg v-if="o2 < 2" xmlns="http://www.w3.org/2000/svg" width="19" height="36" fill="none" viewBox="0 0 19 12">
                           <path fill="var(--color-font)" stroke="var(--color-background)" d="m4.125 1.825-.427-.445-.33.527L.987 5.722.813 6l.174.278 2.381 3.814.33.528.427-.445 3.663-3.814L8.134 6l-.346-.36-3.663-3.815Z"/>
                           <path fill="var(--color-font)" d="M9.723 6 4.673.743l.352-.564L19 6 5.017 11.826l-.349-.561L9.722 6Z"/>
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
@import url(./styles.css);

.section {
   color: var(--color-font);
   display: flex;
   padding-top: 10px;
   justify-content: space-between;
}

.winrate {
   font-size: 0.8rem;
   text-align: center;
}

.total {
   font-size: 0.75rem;
   text-align: center;
   color: var(--color-font-faded);
}

.iter-wrapper {
   min-width: 240px;
}
.iter-wrapper > div {
   display: flex;
   gap: 10px;
   align-items: center;
   margin: 5px 0;
   padding: 8px 10px;
}
.images {
   height: 34px;
}

.images div {
   display: inline-block;
}
.skill {
   position: relative;
}
.skill div {
   position: absolute;
   top: 17px;
   left: 6px;
   z-index: 1;
   font-size: 0.85rem;
   background: var(--color-background);
   text-align: center;
   width: 1rem;
}

.section img {
   width: 34px;
   border: 1px solid var(--cell-border);
}
.section img:not(:first-child) {
   margin-left: 5px;
}

svg {
   margin:0 3px;
}
</style>