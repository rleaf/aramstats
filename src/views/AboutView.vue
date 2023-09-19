<template>
  <div class="about-main">
    <div class="about-block">
      <h2>About</h2>
      <hr>
      <p>
        aramstats.lol parses all of a summoner's available ARAM games available in the Riot API to display insightful statistics.
      </p>
      <p>
        Get in touch with me @ryli. (display name: Owl) on Discord.
      </p>
    </div>
    <div class="about-block">
      <h2>Why aren't all my games shown?</h2>
      <hr>
      <p>
        Riot only stores up to 1,000 games or 2 years old worth of data. This is why, if you've played >1,000 games in that timeframe, your first pull will only
        have ~9XX games.
      </p>
    </div>
    <div class="about-block">
      <h2>Some data is showing up weird.</h2>
      <hr>
      <p>
        If you're seeing "-", "NaN", a certainly incorrect value, or nothing in a spot where there should be a number it's because that stat is a recent addition to Aramstats
        and older parses won't have pulled the required information from Riot to show it.
      </p>
    </div>
  </div>
</template>

<style scoped>
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

a {
  color: var(--color-font);
  transition: background 0.25s;
}

a:hover {
  background: var(--hoverButton);
}

h2 {
  font-weight: normal;
  line-height: 1;
  text-align: left;
  color: var(--color-font);
  margin-bottom: 0;
}

p {
  color: var(--color-font);
  line-height: 1.4;
  text-align: left;
  margin-top: 0.5rem;
}
</style>
