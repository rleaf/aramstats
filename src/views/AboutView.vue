<script>
import _about from '@/constants/about.js'
export default {
  data() {
    return {
      about: _about
    }
  }
}
</script>
<template>
  <div class="about-main">
    <div v-for="(o, i) in about" :key="i">
      <h2>{{o.title}}</h2>
      <ul>
        <li v-html="l" v-for="(l, i) in o.body" :key="i"/>
      </ul>
    </div>
  </div>
</template>

<style>
/* scoped CSS doesn't work with v-html directive */

.about-main code {
   background: var(--alpha-07);
   padding: 0.1rem 0.15rem;
   border-radius: 5px;
}

.about-main a {
  color: var(--color-font);
}

.about-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10vh 0;
  text-align: center;
}

.about-main > div {
  width: 800px;
  padding-bottom: 3rem;
}

.about-main h2 {
  font-family: var(--header-font);
  font-weight: normal;
  font-size: 1.5rem;
  text-align: left;
  color: var(--color-font);
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--cell-border);
}

.about-main ul {
  list-style-type: none;
  padding: 0;
}

.about-main li {
  color: var(--color-font);
  line-height: 1.4;
  text-align: left;
  font-size: 0.95rem;
  padding-bottom: 1rem;
}
</style>
