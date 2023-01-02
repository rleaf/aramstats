<template>
  <div class="about-main">
    <div>
      <h2>About</h2>
      <p>
        <u>aramstats.lol</u> parses all of a summoner's ARAM games available in the Riot API.
      </p>
      <p>
        This site is new so there may be some lingering issues.
        If you encounter any of these issues or have any neat ideas, feel free to reach out at <u>owl#4626</u>.
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
  /* align-items: center; */
}

h2 {
  font-weight: normal;
  color: var(--color-font);
  text-align: center;
}

p {
  color: var(--color-font);
  text-align: center;
  width: 500px;
  line-height: 1.5;
}
</style>
