<template>
  <div class="about-main">
    <div class="about-block">
      <h2>About</h2>
      <hr>
      <p>
        Aramstats provides insightful Howling Abyss summoner and champion statistics. Summoner information is calculated using all available games through the Riot API.
        Champion information is calculated from games on the most recent patch. 
      </p>
      <p>
        Currently the crawler, what's collecting and storing <router-link :to="{ name: 'allChampions' }">champion stats</router-link>, is only firing on <code>NA</code>, <code>EUW</code>, <code>EUNE</code>, and <code>KR</code>.
      </p>
      <p>
        Get in touch: @ <code>ryli.</code> on Discord.
      </p>
    </div>
    <div class="about-block">
      <h2>Why doesn't my profile show all my games?</h2>
      <hr>
      <p>
        Riot only stores up to 1,000 games within a 2 year time frame. This is why, if you've played >1,000 games in the last 2 years, your first pull will only
        have ~9XX games.
      </p>
    </div>
    <div class="about-block">
      <h2>Why is the load time for champion statistics kinda slow?</h2>
      <hr>
      <p>
        Two main reasons: hardware and a "4fun" mentality. Hardware is obvious ($) so I'll skip its explanation.
      </p>
      <p>
        For the "4fun" part, I'm storing a lot of information where I don't know how inefficient aggregation operations will become as the data grows. Because patch data is temporarily interesting (as in I will only be showing current patch information and deleting old), I think this makes a good excuse to store a lot of data for a single match unconcerned about performance and then slowly refine/optimize on subsequent patches based off what I learn.
      </p>
      <p>
        Currently the schema design (probably a good reason why it's slow) is unbounded. This means it's possible to uniquely contain all (fuzzy math) ~1.029e13 six-item build permutations + all 7.099e10 five-item permuations + {insert big number here} four-item permutations...all the way down to one. This design, although maybe detrimental to peformance, is intentional because it's very unrealistic to expect a champion document to contain anywhere near even a fraction of that amount of unique builds. The upside is two-fold. First, the data-to-performance rate should plateau as the crawler builds a healthy distribution for observed builds; so even though it's slow, it shouldn't (I hope) become slooooooooooooooow. Second, we get to see all observed builds and any associated data that I think could be neat for the match that build is observed.
      </p>
    </div>
    <div class="about-block">
      <h2>Some data is showing up weird.</h2>
      <hr>
      <p>
        Hmu - may be a bug.
      </p>
    </div>
  </div>
</template>

<style scoped>

code {
   background: var(--alpha-07);
   padding: 0.1rem 0.15rem;
   border-radius: 5px;
}

a {
  color: var(--color-font);
  /* font-style: italic; */
}

.about-main {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 10vh 0;
  text-align: center;
}

.about-block {
  width: 800px;
  margin-bottom: 3vh;
}

hr {
  border: 1px solid var(--cell-border);
}
h2 {
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1;
  text-align: left;
  color: var(--color-font-focus);
  margin-bottom: 0;
}

p {
  color: var(--color-font);
  line-height: 1.4;
  text-align: left;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
</style>
