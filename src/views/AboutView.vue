<template>
  <div class="about-main">
    <div>
      <h2>About</h2>
      <p>
        <u>aramstats.lol</u> parses all of a summoner's ARAM games available in the Riot API.
      </p>
      <p>
        Feel free to @owl#4626 in the <a href="https://discord.gg/MydvqhqWmM">aram academy</a> discord
        if you have any neat ideas.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-main {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20vh;
  text-align: center;
}

a {
  color: var(--color-font);
}

h2 {
  font-weight: normal;
  color: var(--color-font);
}

p {
  color: var(--color-font);
  width: 500px;
  line-height: 1.5;
}
</style>
