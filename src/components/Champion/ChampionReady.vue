<script>
import champions from '../../constants/champions'
import { superStore } from '../../stores/superStore'
import Tldr from './components/Tldr.vue'
import Items from './components/Items.vue'
import Runes from './components/Runes.vue'
import StartingSpells from './components/StartingSpells.vue'
import DataTooltip from '../DataTooltip.vue'

export default {
   components: {
      Tldr,
      Items,
      Runes,
      StartingSpells,
      DataTooltip
   },
   data() {
      return {
         championCDN: null,
         abilities: [],
         name: champions.humanName[this.champion._id],
         backName: champions.imageName[this.champion._id],
         patchAlert: false,
         itemTooltip: false,
         itemData: null,
         store: superStore(),
      }

   },

   created() {
      document.title = `${this.name} | ARAM Stats`

      if (this.champion.patch !== this.activePatch) {
         this.patchAlert = true

         setTimeout(() => {
            this.patchAlert = false
         }, 2000);
      }
   },

   methods: {
      // https://ddragon.leagueoflegends.com/cdn/14.14.1/img/spell/AsheSpiritOfTheHawk.png
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

      scrollTo(val) {
         const top = document.querySelector(`#${val}`).offsetTop
         window.scrollTo({
            top: top
            // behavior: 'smooth'
         })
      },

      cleanPatch(patch) {
         return patch.split('.').slice(0, 2).join('.')
      },

      patchChange(patch) {
         this.$router.push({ query: { patch: this.cleanPatch(patch) } })
      }
   },

   computed: {
      champIcon() {
         return `https://ddragon.leagueoflegends.com/cdn/${this.store.patches[0]}/img/champion/${this.backName}.png`
      },

      background() {
         const img = new URL(`../../assets/champion_splash/${this.backName.toLowerCase()}.webp`, import.meta.url).href
         return `radial-gradient(ellipse at top, rgba(var(--surface-rgb), 0.8), rgba(var(--surface-rgb), 1) 73%), no-repeat -10% 25%/100% url('${img}')`
      },

      championWinrate() {
         return `${Math.round((this.champion.wins / this.champion.games) * 1000) / 10}%`
      },

      activePatch() {
         const o = new URLSearchParams(window.location.search).get('patch')
         return (o) ? o : this.cleanPatch(this.store.patches[0])
      },

      title() {
         return (this.store.championCDN) ? this.store.championCDN.title : ''
      },

      aramModifiers() {
         if (!this.store.championCDN) return

         const statMods = {
            'Ability Haste': this.store.championCDN.stats['aramAbilityHaste'],
            'Attack Speed': this.store.championCDN.stats['aramAttackSpeed'],
            'Damage Dealt': this.store.championCDN.stats['aramDamageDealt'],
            'Damage Taken': this.store.championCDN.stats['aramDamageTaken'],
            'Energy Regen': this.store.championCDN.stats['aramEnergyRegen'],
            'Healing': this.store.championCDN.stats['aramHealing'],
            'Shielding': this.store.championCDN.stats['aramShielding'],
            'Tenacity': this.store.championCDN.stats['aramTenacity']
         }

         for (const x of Object.entries(statMods)) {
            if (!x[1] || x[1].flat === 1) {
               delete statMods[x[0]]
               continue
            }
            if (x[1].flat % 1 != 0) {
               const v = Math.round((x[1].flat - 1) * 1000) / 10
               statMods[x[0]] = (x[1].flat - 1 > 0) ? `+${v}%` : `${v}%`
            } else {
               statMods[x[0]] = `${x[1].flat}`
            }
         }

         return statMods
      }
   },
   
   props: {
      champion: null,
      keyProp: null,
   }
}
</script>

<template>
   <Transition name="tooltip-fade">
      <DataTooltip v-if="this.store.tooltip.active" />
   </Transition>
   
   <div class="champion-ready-main">
      <Transition name="fade">
         <div v-if="this.patchAlert" class="alert">
            Patch data unavailable. Defaulting to {{ this.cleanPatch(this.store.patches[0]) }}.
         </div>
      </Transition>
      <div class="gradient-bg" :style="{ background: background }"></div>
      <div class="header">
         <div class="header-titles">

            <div class="header-lhs">
               <div class="header-lhs-image">
                  <img :src="champIcon" alt="">
               </div>
               <div class="header-lhs-one">
                  <div class="name">{{ this.name }}</div>
                  <div class="title">{{ this.title }}</div>
                  <div class="champion-abilities">
                     <div v-for="(id, i) of 'PQWER'"
                        @mouseenter="this.store.setTooltipData({event: $event, key: id, mode: 'skills', skillIndex: i})"
                        @mouseleave="this.store.tooltip.active = false"
                        :key="i">
                        <img v-if="this.store.championCDN" :src="this.store.championCDN.abilities[id][0].icon" rel="preload">
                        <div class="spell-letter">
                           {{ abilityLetter(i) }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div class="header-rhs">
               <div class="main-stats">
                  <div>
                     <span>Rank</span>
                     {{ this.champion.rank }}
                  </div>
                  <div>
                     <span>Pickrate</span>
                     {{ this.champion.pickRate }}%
                  </div>
                  <div>
                     <span>Winrate</span>
                     {{ this.championWinrate }}
                  </div>
                  <div>
                     <span>Games</span>
                     {{ this.champion.games }}
                  </div>
               </div>

               <div class="aram-mods" v-if="this.aramModifiers">
                  <div v-for="(s, i) in Object.entries(this.aramModifiers)" :key="i">
                     <span>{{ s[0] }}</span>
                     {{ s[1] }}
                  </div>
               </div>
            </div>

         </div>

         <div class="settings">
            <div>
               <div class="setting-header">{{ this.champion.patch }}</div>
               <div class="setting-content">
                  <a @click="patchChange(p)" v-for="p in this.store.patches" :key="p">{{ this.cleanPatch(p) }}</a>
               </div>
            </div>
            <div>
               <div class="setting-header">Global*</div>
               <div class="setting-content">
                  <div class="message">
                     *Currently, only global is available. Check <router-link class="about" :to="{ name: 'about' }">about</router-link>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="champion-body">
         <Tldr  @scroll="scrollTo" :champion="this.champion" :patch="this.store.patches[0]" />
         <Items :champion="this.champion" :patch="this.store.patches[0]" :itemData="this.itemData"/>
         <Runes :champion="this.champion" :patch="this.store.patches[0]" />
         <StartingSpells :champion="this.champion" :patch="this.store.patches[0]" :abilities="this.abilities"/>
      </div>
   </div>
</template>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
   transition: opacity 200ms ease-in-out;
}

.tooltip-fade-leave-to,
.tooltip-fade-enter-from {
   opacity: 0;
}

.fade-leave-active {
   transition: opacity 1000ms ease-in-out;
}

.fade-leave-to {
   opacity: 0;
}

.alert {
   font-size: 0.9rem;
   color: var(--on-error);
   position: absolute;
   text-align: center;
   left: 50%;
   margin-top: 10vh;
   transform: translateX(-50%);
   padding: 0.6rem 0.8rem;
   background: var(--error);
   border-radius: 3px;
   z-index: 5;
   max-width: 150px;
}

.gradient-bg {
   position: absolute;
   z-index: -5;
   margin-top: 5vh;
   width: inherit;
   height: 400px;
}
.champion-ready-main {
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   width: 1100px;
}

.header {
   margin-bottom: 5vh;
}

.header-titles {
   margin-top: 5vh;
   padding-top: 5vh;
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   color: var(--color-font);
   border-top: 1px solid var(--outline);
   background: radial-gradient(ellipse at top, var(--surface), var(--surface-rgb) 25%);
}

.main-stats {
   display: flex;
   margin-bottom: 20px;
   gap: 40px;
   font-size: 1.1rem;
}

.main-stats div {
   font-weight: bold;
   color: var(--color-font-focus);
}

.header-rhs span {
   font-size: 0.9rem;
   display: block;
   padding-bottom: 5px;
   color: var(--color-font-faded);
   font-weight: normal;
}

.aram-mods {
   display: flex;
   gap: 10px;
}

.aram-mods div {
   font-size: 0.95rem;
   font-weight: bold;
}

.settings {
   display: flex;
   gap: 20px;
   font-size: 0.9rem;
   color: var(--color-font);
   margin-top: 5vh;
}

.settings > div {
   display: block;
   width: auto;
}

.header-lhs {
   display: flex;
}

.settings .setting-content {
   display: none;
   position: absolute;
   flex-direction: column;
   background: var(--surface);
   border: 1px solid var(--outline-variant);
   border-radius: 3px;
   overflow: hidden;
   z-index: 1;
}

.setting-content > a {
   display: inline-block;
   cursor: pointer;
   min-width: 45px;
   padding: 6px 10px;
}

.setting-content > a:hover {
   background: var(--surface-container-highest);
}

.setting-content .message {
   padding: 0.4rem 0.8rem;
   font-size: 0.8rem;
}

a.about {
   color: var(--color-font);

}

.settings > div:hover .setting-content {
   display: flex;
}

.settings > div .setting-header {
   display: block; 
   text-align: center;
   background: var(--surface);
   border: 1px solid var(--outline-variant);
   color: var(--color-font);
   cursor: pointer;
   min-width: 45px;
   border-radius: 3px;
   padding: 6px 10px;
   margin-bottom: 5px;
   transition: 100ms ease-in-out;
}
.settings > div .setting-header:hover {
   border: 1px solid var(--outline);
}

.header-lhs-one {
   padding-left: 1.5rem;
}

.name {
   display: inline-block;
   font-size: 2.8rem;
   margin: 0;
   font-family: var(--header-font);
   color: var(--color-font-focus);
}

.title {
   display: inline-block;
   margin: 0;
   padding-left: 0.7rem;
   font-size: 1.2rem;
   font-family: var(--header-font);
   /* font-style: italic; */
   color: var(--color-font-faded);
}

.champion-abilities {
   padding-top: 5px;
   height: 38px;
}
.champion-abilities img {
   width: 36px;
   border: 1px solid var(--outline-variant);
}

.champion-abilities > div {
   display: inline-block;
}

.champion-abilities div:not(:first-child) {
   margin-left: 10px;
}

.spell-letter {
   position: relative;
   top: -24px;
   left: -9px;
   font-size: 0.85rem;
   background: var(--surface);
   border-top: 1px solid var(--outline-variant);
   border-right: 1px solid var(--outline-variant);
   text-align: center;
   width: 1rem;
}

.header-lhs-image {
   width: 100px;
   height: 100px;   
   overflow: hidden;
   border: 1px solid var(--outline-variant);
}

.header-lhs-image img {
   width: 100%;
   transform: scale(1.2);
}
</style>