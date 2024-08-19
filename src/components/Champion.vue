<script>
import names from '@/constants/champions.js'
import Match from './Match.vue'
import { summonerStore } from '../stores/summonerStore'

export default {
   components: {
      Match
   },
   data() {
      return {
         iconTable: names.imageName,
         humanTable: names.humanName,
         matchToggle: false,
         championPool: summonerStore().championPool,
         patchCount: 1,
      }
   },

   mounted() {
      for (let i = 0; i < this.sortedMatches.length; i++) {
         if (!this.data.matches[i-1]) continue
         if (this.sortedMatches[i].gv.split('.').slice(0, 2).join('.') !== this.sortedMatches[i-1].gv.split('.').slice(0, 2).join('.')) {
            this.patchCount++
         }
      }
   },

   methods: {
      newPatch(newPatch, oldPatch) {
         if (!oldPatch) return true

         const clean = j => {
            return j.split('.').slice(0, 2).join('.')
         }

         return (clean(newPatch) !== clean(oldPatch.gv)) ? true : false
      },

      toggleChampion(id) {
         (this.championPool.has(id)) ? this.championPool.delete(id) : this.championPool.add(id)
      },

      onBeforeEnter(el) {
         el.style.opacity = `0`
         el.style.maxHeight = `0`
         el.style.overflow = `hidden`
      },
      
      onAfterEnter(el) {
         el.style.opacity = `1`
         el.style.transition = `all 200ms ease-in-out`
         el.style.maxHeight = `${this.data.matches.length * 39 + this.patchCount * 24}px`
      },

      onBeforeLeave(el) {
         el.style.opacity = `0`
         el.style.maxHeight = `0`
      },

      patchDividers(c, p) {
         if (!p) return true

         const c1 = c.split('.').slice(0, 2).join('.')
         const p1 = p.gv.split('.').slice(0, 2).join('.')
         
         if (c1 !== p1) {
            return true
         } else {
            return false
         }
      }
   },

   computed: {
      championIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/${this.iconTable[this.data.championId]}.png`
      },

      winrate() {
         return Math.round((this.data.wins / this.data.games) * 100)
      },

      cssHeight() {
         return this.data.matches.length * 39
      },

      sortedMatches() {
         return this.data.matches.sort((a, b) => (b.gc) - (a.gc))
      },

   },

   props: {
      data: Object,
      patch: String,
   }
}
</script>

<template>
   <div class="champion-main" ref="championMain" :class="{ 'active-champion': this.championPool.has(this.data.championId) }" @click="this.toggleChampion(this.data.championId)">
      
      <div class="lhs">
         <img class="dropdown" src="@/assets/svg/arrow3.svg" @click.stop="this.matchToggle = !this.matchToggle" :class="{ 'rotate': !this.matchToggle }">
         <div class="name-wrapper">
            <div class="icon-wrapper">
               <img class="icon" :src="championIcon" alt="">
            </div>
            {{ this.humanTable[this.data.championId] }}
         </div>
         <div class="winrate">
            {{ winrate }}%
            <div class="per-minute-sub">
               {{ this.data.wins }}/{{ this.data.games }}
            </div>
         </div>

      </div>

      <div class="rhs">
         <div class="kda">
            {{ this.data.avg.k }}/{{ this.data.avg.d }}/{{ this.data.avg.a }}
         </div>
         <div class="kp">
            {{ this.data.avg.kp }}%
         </div>
   
         <!-- Damage -->
         <div class="primary-stat">
            {{ this.data.avg.tdd }}
            <div class="per-minute-sub">
               {{ this.data.avg.dpm }}
            </div>
         </div>
   
         <!-- Taken -->
         <div class="primary-stat">
            {{ this.data.avg.tdt }}
            <div class="per-minute-sub">
               {{ this.data.avg.dtpm }}
            </div>
         </div>
   
         <!-- Mitigated -->
         <div class="primary-stat">
            {{ this.data.avg.tsm }}
            <div class="per-minute-sub">
               {{ this.data.avg.smpm }}
            </div>
         </div>
   
         <!-- Healing -->
         <div class="primary-stat">
            {{ this.data.avg.th }}
            <div class="per-minute-sub">
               {{ this.data.avg.hpm }}
            </div>
         </div>
   
         <!-- Ally Healing -->
         <div class="primary-stat">
            {{ this.data.avg.ah }}
            <div class="per-minute-sub">
               {{ this.data.avg.ahpm }}
            </div>        
         </div>
   
         <!-- Gold Earned -->
         <div class="primary-stat">
            {{ this.data.avg.ge }}
            <div class="per-minute-sub">
               {{ this.data.avg.gpm }}
            </div>
         </div>
      </div>
   </div>
   <Transition
      @before-enter="this.onBeforeEnter"
      @after-enter="this.onAfterEnter"
      @before-leave="this.onBeforeLeave">
      <div class="match-container" v-if="this.matchToggle">
         <div v-for="(m, i) in this.sortedMatches">
            <Match :patch="this.patch" :data="m" :newPatch="this.newPatch(m.gv, this.sortedMatches[i-1])" :key="i"/>
         </div>
      </div>
   </Transition>
</template>

<style scoped>

   .patch-divider {
      display: flex;
      align-items: flex-end;
      gap: 17px;
      color: var(--color-font-faded);
      font-size: 0.75rem;
   }

   .patch-divider > span {
      width: 13px;
      padding-bottom: 1px;
   }
   .patch-divider hr {
      min-height: 21px;
      width: 1px;
      border: none;
      background-color: var(--cell-border);
      margin: 0;
      margin-left: 12px;
   }

   .active-champion {
      background-color: var(--cold-blue-focus);
   }

   .icon-wrapper {
      height: 34px;
      width: 34px;
      overflow: hidden;
      border: 1px solid var(--cell-border);
   }

   img.icon {
      width: 100%;
      transform: scale(1.1);
   }
   
   .champion-main {
      font-size: 0.8rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
      height: 38px;
      width: 100%;
      cursor: pointer;
      padding: 2px 0;
      border-radius: 3px;
      border: 1px solid transparent;
      transition: background .2s ease-in-out, border .1s ease-in-out;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }

   .champion-main:hover:not(.active-champion) {
      border: 1px solid var(--cell-border);
   }
   /* .dropdown:hover {
      border: 1px solid tomato;
   } */

   .name-wrapper {
      display: flex;
      align-items: center;
   }

   .per-minute-sub {
      font-size: 0.72rem;
      color: var(--color-font-faded);
      /* font-style: italic; */
   }
   
   .rhs, .lhs {
      display: flex;
      gap: 5px;
      align-items: center;
   }

   .name-wrapper {
      width: 160px;
   }

   .icon-wrapper {
      margin-right: 8px;
   }

   .rhs {
      justify-content: flex-end;
   }
   
   .rhs div {
      width: 70px;
   }

   .rhs div:nth-child(1) {
      width: 65px; /* KP */
   }

   .rhs div:nth-child(2) {
      width: 40px; /* KP */
   }
   
   .rhs div:nth-child(4) {
      width: 60px; /* KP */
   }

   .rhs div:nth-child(6) {
      width: 55px; /* Healed */
   }

   .rhs div:nth-child(7) {
      width: 75px; /* Ally Healing */
   }

   .rhs div:nth-child(8) {
      margin-left: 5px;
      width: 40px; /* Gold */
   }

   .dropdown {
      margin-left: 7px;
      margin-right: 5px;
      padding: 10px 0;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }
   
   .rotate {
      transform: rotate(180deg);
   }
</style>