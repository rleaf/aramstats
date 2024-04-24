<script>
import Tooltip from './Tooltip.vue';
import { summonerStore } from '@/stores/summonerStore'

export default {
   components: {
      Tooltip
   },
   data() {
      return {
         store: summonerStore(),
         state: false
      }
   },
   
   methods: {
      // toggle() {
      //    this.state = !this.state

      //    if (this.state) {
      //       this.$refs.matchContainer.style.display = 'block'
      //       this.$refs.matchContainer.style.opacity = `1`
      //       setTimeout(() => this.$refs.matchContainer.style['max-height'] = `${this.data.matches.length * 39}px`, 500)
      //    } else {
      //       this.$refs.matchContainer.style['max-height'] = `0px`
      //       this.$refs.matchContainer.style.opacity = `0`
      //       setTimeout(() => this.$refs.matchContainer.style.display = 'none', 500)
      //    }
      // },
   },

   props: {
      header: null,
      stats: null,
      persist: false,
      encounters: false,
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
      <Tooltip v-if="!this.persist" :align="'left'" :tip="this.tooltip" />
   </div>
   <div class="stat-body" :class="{ 'truncated': this.state, 'bordered': !this.persist }" :style="`max-height: ${this.stats.length * 25}px`">
      
      <div v-if="this.encounters" class="encounters" v-for="(s, i) in this.stats" :class="{ 'o': i % 2 === 0 }" :key="i">
         <span>
            {{ s[0] }}
         </span>
         <span>
            {{ s[1][0] }}/{{ s[1][1] }}
         </span>
         <span>
            {{ Math.round(s[1][0] / s[1][1] * 1000) / 10 }}%
         </span>
      </div>

      <div v-else v-for="(s, j) in this.stats" :class="{ 'o': j % 2 === 0 }" :key="j">
         {{ s[0] }}
         <span v-if="this.persist">{{ s[1] }}</span>
         <span v-else-if="this.store.championPool.size > 0">{{ s[1] }}</span>
         <span v-else style="color: var(--color-font-faded);">-</span>
      </div>
   </div>
</div>
</template>

<style scoped>
.stat-main {
   padding-bottom: 25px;
}

.header-title {
   padding: 0.2rem 0.4rem;
   border-radius: 3px;
   transition: all 200ms ease-in-out;
}

.header-title:hover {
   background: var(--cold-blue-focus);
   /* font-size: 1.3rem; */
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

.stat-body div {
   font-size: 0.8rem;
   display: flex;
   margin-top: 1px;
   padding: 0.2rem 0.5rem;
   border-radius: 3px;
   justify-content: space-between;
   align-items: center;
}

.stat-body span {
   font-size: 0.8rem;
}

.encounters span:first-child {
   width: 60%;
   overflow-wrap: break-word;
}

.encounters span:last-child {
   width: 16%;
   text-align: right;
   /* margin-left: auto; */
}


.o {
   background: var(--alpha-01);
}
</style>