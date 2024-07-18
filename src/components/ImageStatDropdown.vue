<script>
import UXTooltip from './UXTooltip.vue';
import { summonerStore } from '@/stores/summonerStore'

export default {
   components: {
      UXTooltip
   },

   data() {
      return {
         store: summonerStore(),
         state: false
      }
   },
   
   methods: {
      assetImage(id) {
         return (this.header === 'Summoner Spells') ?
            new URL(`../assets/spells/${id}.webp`, import.meta.url).href :
            new URL(`../assets/runes/${id}.png`, import.meta.url).href

      }
   },

   computed: {
      imageSize() {
         switch (this.header) {
            case 'Summoner Spells':
               return 'spell-images'
            case 'Keystone Runes':
               return 'rune-images'
            case 'Secondary Trees':
               return 'tree-images'
            default:
               return 'spell-images'
         }  
      },

      maxHeight() {
         if (this.header !== 'Summoner Spells' && this.store.championPool.size === 0) {
            return 'max-height: 25px'
         }
         return `max-height: ${Math.round(this.stats.length / 2) * 45}px`
      }
   },

   props: {
      header: null,
      stats: null,
      tooltip: null,
   }
}
</script>

<template>
<div class="stat-main" :class="{ 'main-truncated': this.state }">
   <div class="stat-header">
      <div class="header-title" @click="this.state = !this.state" v-if="this.header">
         {{ this.header }}
         <img class="arrow"  src="@/assets/svg/arrow3.svg" :class="{ 'arrow-up': this.state }" alt="">
      </div>
      <UXTooltip :align="'left'" :tip="this.tooltip" />
   </div>
   <div class="stat-body bordered"  :class="{ 'truncated': this.state }" :style="this.maxHeight">
      <div v-if="this.header !== 'Summoner Spells' && this.store.championPool.size === 0" class="helper">Click on some champions to see this stat</div>
      <div class="loop" v-for="(s, j) in this.stats" :class="{ 'o': Math.round(j/2) % 2 === 0 }" :key="j">

         <div class="stat-wrapper">
            <img :class="this.imageSize" :src="this.assetImage(s[0])" alt="">
            <div>
               <span>
                  <span v-if="this.header === 'Summoner Spells'">Casts: </span>
                  <span v-else="this.header === 'Summoner Spells'">Wins: </span>

                  <span v-if="this.store.championPool.size > 0" style="color: var(--color-font);">{{ s[1][1] }}</span>
                  <span v-else style="color: var(--color-font);">-</span>
               </span>
               <span>
                  Games:
                  <span v-if="this.store.championPool.size > 0" style="color: var(--color-font);">{{ s[1][0] }}</span>
                  <span v-else style="color: var(--color-font);">-</span>
               </span>
            </div>
         </div>

      </div>
   </div>
</div>
</template>

<style scoped>

.helper {
   font-size: 0.75rem;
   line-height: 2;
   font-style: italic;
   color: var(--color-font-faded);
}
.stat-main {
   padding-bottom: 25px;
}

.header-title {
   padding: 0.2rem 0.4rem;
   border-radius: 3px;
   transition: all 200ms ease-in-out;
}

.spell-images {
   border-radius: 3px;
   width: 32px;
   height: 32px;
}

.rune-images {
   width: 34px;
   filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5));
   height: 34px;
}

.tree-images {
   filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
   width: 24px;
   height: 24px;
}

.header-title:hover {
   background: var(--cold-blue-focus);
}

.stat-header {
   display: flex;
   font-size: 0.85rem;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 5px;
}

.stat-header .header-title {
   font-weight: 600;
   cursor: pointer;
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

.stat-body {
   overflow: hidden;
   display: flex;
   flex-wrap: wrap;
   justify-content: space-between;
   transition: max-height 200ms ease-in-out;
}

.bordered {
   border-left: 1px solid var(--cell-border);
   padding-left: 0.4rem;
}

.main-truncated {
   padding-bottom: 5px;
}

div.truncated {
   max-height: 0 !important;
   opacity: 1;
}

.arrow {
   margin-left: 5px;
}

.arrow-up {
   transform: rotate(180deg);
}

.stat-wrapper {
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.loop {
   font-size: 0.8rem;
   flex: 0 0 44%;
   margin-top: 1px;
   padding: 0.25rem 0.35rem;
   border-radius: 3px;
}

.loop div > span {
   text-align: right;
   display: block;
   color: var(--color-font-faded);
   line-height: 1.5;
   font-size: 0.72rem;
}

.o {
   background: var(--alpha-01);
}
</style>