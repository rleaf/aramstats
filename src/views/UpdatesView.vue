<script>
import _version from '../constants/version'
import _updates from '../constants/updates'

export default {
   data() {
      return {
         tab: 0,
         version: _version,
         updates: _updates
      }
   },

   methods: {
      getImage(fileName) {
         return new URL(`../assets/${fileName}.webp`, import.meta.url).href
      }
   },
}
</script>

<template>
   <div class="update-main">
      <div class="update-tabs">
         <div class="updates" @click="this.tab = 0" :class="{ active: !this.tab }">Updates</div>
         <div class="versions" @click="this.tab = 1" :class="{ active: this.tab }">Versioning</div>
      </div>
      <div class="updates" v-show="this.tab === 0">
         <div class="update-block" v-for="u in updates">
            <div class="header">
               <div>
                  <h2>{{ u.title }}</h2>
                  <h3 v-if="u.version">v{{ u.version }}</h3>
               </div>
               <h3>{{ u.date }}</h3>
            </div>
            <hr>
            <p v-for="p in u.body">{{ p }}</p>
            <img v-if="u.img" :src="getImage(u.img)" alt="">
            <p class="sub" v-if="u.imgCaption">{{ u.imgCaption }}</p>
         </div>
      </div>
      <div class="versioning" v-show="this.tab === 1">
         <div class="version-block" v-for="v in version">
            <div class="version-header">
               <h2>{{ v.version }}</h2>
               <h3>{{ v.date }}</h3>
            </div>
            <hr>
            <div class="version-body">
               <div class="notes" v-if="v.notes">
                  <p>
                     {{ v.notes }}
                  </p>
               </div>
               <div v-if="v.add">
                  <h4>Added</h4>
                  <ul>
                     <li v-for="a in v.add">{{ a }}</li>
                  </ul>
               </div>
               <div v-if="v.remove">
                  <h4>Removed</h4>
                  <ul>
                     <li v-for="r in v.remove">{{ r }}</li>
                  </ul>
               </div>
               <div v-if="v.fix">
                  <h4>Fixed</h4>
                  <ul>
                     <li v-for="f in v.fix">{{ f }}</li>
                  </ul>
               </div>
               <div v-if="v.adjust">
                  <h4>Adjusted</h4>
                  <ul>
                     <li v-for="a in v.adjust">{{ a }}</li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.notes p {
   color: var(--light600);
   font-style: italic;
   padding-bottom: 1rem;
}

.version-body {
   padding: 1rem;
}

.version-body ul {
   color: var(--color-font);
   font-size: 0.95rem;
   margin-bottom: 2rem;
}

h4 {
   color: var(--color-font);
   font-size: 1.1rem;
   font-weight: normal;
   margin: 0;
}
.version-header {
   display: flex;
   justify-content: space-between;
   align-items: flex-end;
}

.versioning {
   width: 800px;
}

.description {
   font-size: 0.9rem;
   color: var(--light800);
   font-style: italic;
   margin-bottom: 3vh;
}

.update-tabs > div {
   padding: 0.5rem 1rem;
   border-radius: 8px;
   cursor: pointer;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none; /* Non-prefixed version, currently
      supported by Chrome, Edge, Opera and Firefox */
}
.active {
   color: var(--color-font);
   background: var(--hoverButton);
}

.update-tabs {
   color: var(--light900);
   display: flex;
   width: 800px;
   gap: 20px;
   margin-bottom: 2vh;
}
.update-main {
   display: flex;
   width: 100%;
   flex-direction: column;
   align-items: center;
   padding: 8vh 0;
}

.update-block {
   width: 800px;
   margin-bottom: 3vh;
   text-align: center;
}

.update-block img {
   max-width: 80%;
   clear: both;
   max-height: 400px;
}

.header {
   display: flex;
   width: 100%;
   justify-content: space-between;
   align-items: flex-end;
}

.header > div {
   display: flex;
   gap: 1rem;
   align-items: flex-end;
}

a {
   color: var(--color-font);
}

h2 {
   font-weight: normal;
   line-height: 1;
   font-size: 1.3rem;
   text-align: left;
   color: var(--color-font);
   margin-bottom: 0;
}

h3 {
   font-weight: normal;
   font-size: 1rem;
   line-height: 1;
   text-align: left;
   color: var(--light600);
   margin-bottom: 0;
   font-style: italic;
}

p {
   color: var(--color-font);
   line-height: 1.4;
   text-align: left;
   font-size: 0.95rem;
   margin-top: 0.5rem;
}

p.sub {
   text-align: center;
   font-size: 0.8rem;
   color: var(--light600);
   font-style: italic;
   margin-top: 0;
}
</style>
