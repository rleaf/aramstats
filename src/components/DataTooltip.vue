<script setup>
import { superStore } from '@/stores/superStore'
import { computed, onMounted, ref } from 'vue'
const store = superStore()

const tip = ref(null)
const data = computed(() => store.items[store.tooltip.key])
const spells = computed(() => {
   return [
      props.champCDN.passive,
      props.champCDN.spells[0],
      props.champCDN.spells[1],
      props.champCDN.spells[2],
      props.champCDN.spells[3]
   ]
})

onMounted(() => {
   tip.value.style.left = store.tooltip.x + 'px'
   tip.value.style.top = store.tooltip.y + 'px'

   const height = (store.tooltip.mode === 'items') ? `-${tip.value.offsetHeight - 30}px` :
      `120px`
   // if (store.tooltip.mode === 'items') {
   //    tip.value.style.transform = `translate(-50%, -${tip.value.offsetHeight - 30}px)`
   // } else {
   //    tip.value.style.transform = `translate(-50%, -${tip.value.offsetHeight - 30}px)`
   // }
   tip.value.style.transform = `translate(-50%, ${height})`
   console.log(props.champCDN)
})

const props = defineProps({
   champCDN: null,
})
</script>

<template>
   <div ref="tip" class="item-tooltip-main">

      <div v-if="store.tooltip.mode === 'items'">
         <div class="header">
            <h1>{{ data.name }}</h1>
            <h2>({{ data.gold.total }})</h2>
         </div>
         <div class="plain-text">{{ data.plaintext }}</div>
         <div class="description" v-html="data.description" />
      </div>
      <div v-else-if="store.tooltip.mode === 'spells'" class="spells-tooltip-main">
         <div class="header">
            <h1>{{ spells[store.tooltip.skillIndex].name }}</h1>
         </div>
         <div class="plain-text">{{ spells[store.tooltip.skillIndex].description }}</div>
         <div v-html="spells[store.tooltip.skillIndex].tooltip" class="description" />
      </div>
      
   </div>
</template>

<style scoped>
.item-tooltip-main {
   position: absolute;
   z-index: 5;
   color: var(--color-font);
   background: var(--cell-panel);
   border: 1px solid var(--cell-border);
   padding: 0.5rem 1rem;
   font-size: 0.8rem;
   border-radius: 3px;
   max-width: 300px;
}

.header {
   display: flex;
   gap: 10px;
   align-items: baseline;
   /* margin-top: 0.5rem; */
   margin-bottom: 0.8rem;
   /* justify-content: space-between; */
}

h1 {
   /* display: inline-block; */
   color: var(--color-font-focus);
   font-size: 0.9rem;
   font-weight: bold;
   margin: 0;
}

h2 { 
   /* display: inline-block; */
   /* color: #ccad49; */
   font-size: 0.8rem;
   font-weight: normal;
   margin: 0;
}

.plain-text {
   padding-bottom: 0.5rem;
   /* font-size: 0.75rem; */
   /* color: var(--color-font-faded); */
}


/* mainText {
   color: blue;
} */
</style>