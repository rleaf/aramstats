<template>
  <div class="about-main">
    <div class="about-block">
      <h2>About</h2>
      <hr>
      <p>
        Aramstats provides insightful Howling Abyss statistics for both summoners and champions. Summoner information is calculated using all available games through the Riot API.
        Champion information is calculated from NA games on the most recent patch. 
      </p>
      <p>
        Get in touch with me <code>@ryli.</code> (display name: Owl) on Discord.
      </p>
    </div>
    <div class="about-block">
      <h2>Why aren't all my games shown?</h2>
      <hr>
      <p>
        Riot only stores up to 1,000 games within a 2 year time frame. This is why, if you've played >1,000 games in the last 2 years, your first pull will only
        have ~9XX games.
      </p>
    </div>
    <div class="about-block">
      <h2>Some data is showing up weird.</h2>
      <hr>
      <p>
        It is probably a bug. Ping me in Discord and I'll fix it.
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
  margin-top: 0.5rem;
}
</style>
