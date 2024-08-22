<script>
import _version from '../constants/version'

export default {
   data() {
      return {
         version: _version,
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
      <div class="versioning">
         <div class="block" v-for="v in version">
            <div class="header">
               <h2>{{ v.version }}</h2>
               <h3>{{ v.date }}</h3>
            </div>
            <div class="body">
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
   font-size: 0.93rem;
   line-height: 1.3;
   margin-bottom: 2rem;
}

.body {
   font-size: 0.95rem;
   /* padding-bottom: 6rem; */
}

.body ul {
   color: var(--color-font);
   font-size: 0.9rem;
   margin-top: 0.3rem;
   margin-bottom: 1rem;
   padding-left: 1.8rem;
   list-style-type: disc;
}

h4 {
   color: var(--color-font);
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

.update-tabs div {
   padding: 0.4rem 1rem;
   font-size: 0.95rem;
   border-radius: 4px;
   border: 1px solid transparent;
   background: var(--surface-container);
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
   background: var(--primary);
   color: var(--color-font-focus);
}
div.active {
   /* background: var(--cold-blue-focus); */
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
   padding: 15vh 0;
}

.block {
   width: 800px;
   /* background-color: var(--surface-container); */
   /* border-radius: 5px; */
   padding: 0 2rem;
   /* border: 1px solid var(--outline-variant); */
   margin-bottom: 6rem;
}

.block img {
   max-width: 80%;
   display: block;
   margin: 0 auto;
   padding-top: 2rem;
   max-height: 400px;
}

.header {
   display: flex;
   width: 100%;
   justify-content: space-between;
   align-items: flex-end;
   padding-bottom: 0.3rem;
   margin-bottom: 1.25rem;
   border-bottom: 1px solid var(--outline);
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
   font-size: 1.5rem;
   font-family: var(--header-font);
   text-align: left;
   color: var(--color-font);
   margin-bottom: 0;
   
}

h3 {
   font-weight: normal;
   font-size: 0.9rem;
   color: var(--color-font-faded);
   margin-bottom: 0;
   font-style: italic;
}

p {
   color: var(--color-font);
   line-height: 1.4;
   text-align: left;
   margin-top: 0rem;
}

p.sub {
   text-align: center;
   font-size: 0.8rem;
   color: var(--color-font-faded);
   font-style: italic;
   margin-top: 0;
}
</style>
