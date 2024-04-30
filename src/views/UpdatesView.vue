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
         return new URL(`../assets/images/${fileName}.webp`, import.meta.url).href
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
            <div class="update-links" v-if="u.links && u.links.length">
               <h4>Links</h4>
               <ul>
                  <li v-for="a in u.links"><a :href="a[1]" target="_blank">{{ a[0] }}</a></li>
               </ul>
            </div>
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
               <div class="notes" v-if="v.notes && v.notes.length">
                  <p>
                     {{ v.notes }}
                  </p>
               </div>
               <div v-if="v.add && v.add.length">
                  <h4>Added</h4>
                  <ul>
                     <li v-for="a in v.add">{{ a }}</li>
                  </ul>
               </div>
               <div v-if="v.remove && v.remove.length">
                  <h4>Removed</h4>
                  <ul>
                     <li v-for="r in v.remove">{{ r }}</li>
                  </ul>
               </div>
               <div v-if="v.fix && v.fix.length">
                  <h4>Fixed</h4>
                  <ul>
                     <li v-for="f in v.fix">{{ f }}</li>
                  </ul>
               </div>
               <div v-if="v.adjust && v.adjust.length">
                  <h4>Adjusted</h4>
                  <ul>
                     <li v-for="a in v.adjust">{{ a }}</li>
                  </ul>
               </div>
               <div v-if="v.known && v.known.length">
                  <h4>Known Issues</h4>
                  <ul>
                     <li v-for="a in v.known">{{ a }}</li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>

.notes p {
   color: var(--color-font-faded);
   font-size: 0.95rem;
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
   font-size: 1rem;
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

.update-links {
   text-align: left;
}

.update-links li {
   display: block;
   text-decoration: none;
}

.update-links h4 {
   font-size: 1rem;
}

.update-tabs > div {
   padding: 0.4rem 0.7rem;
   font-size: 0.95rem;
   border-radius: 8px;
   border: 1px solid transparent;
   cursor: pointer;
   transition: 0.2s;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.update-tabs > div:hover {
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
}
div.active {
   background: var(--cold-blue-focus);
   color: var(--color-font-focus);
   border: 1px solid var(--cell-border);
}

.update-tabs {
   display: flex;
   width: 800px;
   gap: 20px;
   margin-bottom: 2vh;
   color: var(--color-font);
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
   font-size: 1.2rem;
   text-align: left;
   color: var(--color-font);
   margin-bottom: 0;
}

h3 {
   font-weight: normal;
   font-size: 0.9rem;
   line-height: 1;
   text-align: left;
   color: var(--color-font-faded);
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
   color: var(--color-font-faded);
   font-style: italic;
   margin-top: 0;
}
</style>
