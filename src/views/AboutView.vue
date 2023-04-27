<template>
  <div class="about-main">
    <div class="about-block">
      <h2>About</h2>
      <hr>
      <p>
        <RouterLink to="/">aramstats.lol</RouterLink> parses all of a summoner's ARAM games available in the Riot API to display insightful statistics.
        <br><br>
        Get in touch: @owl#4626 in the <a href="https://discord.gg/MydvqhqWmM">aram academy</a> discord.
      </p>
    </div>
    <div class="about-block">
      <h2>Why aren't all my games shown?</h2>
      <hr>
      <p>
        Riot only stores up to 1,000 games or 2 years old worth of data.
      </p>
    </div>
    <div class="about-block">
      <h2>Site longevity (ads)</h2>
      <hr>
      <p>
        I am going to start running ads to help offset backend costs; I only intended to host this site for a couple of months. I'm happy that there are daily
        users, but I can't guarantee this site to be up long-term.
      </p>
    </div>
    <div class="about-block">
      <h2>Some data is showing up weird.</h2>
      <hr>
      <p>
        If you're seeing "-", "NaN", or nothing in a spot where there should be a number it's because that stat is a recent addition
        and older parses won't have pulled the required information from Riot to show it.
      </p>
    </div>
    <!-- <div>
      <h2>About</h2>
      <p>
        <u>aramstats.lol</u> parses all of a summoner's ARAM games available in the Riot API to display insightful statistics.
      </p>
      <p>
        Get in touch: @owl#4626 in the <a href="https://discord.gg/MydvqhqWmM">aram academy</a> discord.
      </p>
    </div> -->
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
  width: 550px;
  margin-bottom: 3vh;
}

a {
  color: var(--color-font);
}

h2 {
  /* font-weight: normal; */
  text-align: left;
  color: var(--color-font);
  margin-bottom: 0;
}

p {
  color: var(--color-font);
  line-height: 1.4;
  text-align: left;
}
</style>
