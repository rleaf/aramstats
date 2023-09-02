<template>
   <div class="update-main">
      <div class="update-block">
         <div class="header">
            <h2>Redesigning backend. Intending to wipe all data.</h2>
            <h3>9/2/23</h3>
         </div>
         <hr>
         <p>
            There are two main reasons for doing this:
         </p>
         <p>
            The first is because I have more storage.
            To reduce costs when this site began I opted for the free tier of MongoDB Atlas (~500MB storage). Because of the limited amount of storage, I designed the backend to
            be "picky" when pulling game data from Riot's servers and only store specific information. It was a decent solution for the free tier, but since upgrading to the Pi
            (pic below), I can be more liberal with hoarding data which in turn may allow me to provide more stats. 
         </p>
         <p>
            The second is because there's some cleaning up to do. I never intended for this site to be up this long or to even open it up to multiple regions. This started because
            I wanted to see my performance on certain champs and to try and convince some friends, using empirical data, that maybe Aurelion Sol is just not for them or taking
            Glacial Augment on Azir deserves a ban. As more people use this site, I'd like to revamp the backend to ameliorate UX and try and make it more efficient so it crashes less. 
         </p>
         <p>
            I'm using these two reasons as an excuse to start fresh on the database. I haven't actually started working on it yet, but just wanted to let those interested know. Hmu
            @ <code style="background-color: var(--dark600); border-radius: 5px;">ryli.</code> on Discord for any questions.
         </p>
         <img src="../assets/leo.webp" width="80%" style="clear: both;" alt="">
         <p class="sub">
            "...guys listen to me...glacial Azir is OP - they're doing it everywhere in Korea."
         </p>
      </div>
      <div class="update-block">
         <div class="header">
            <h2>Moving database...again.</h2>
            <h3>7/22/23</h3>
         </div>
         <hr>
         <p>
            Moving database from an old laptop to a Raspberry Pi 4. Planned to do this a while ago as this was the original goal, but they've always been out of stock.
         </p>
         <img src="../assets/piserver.webp" height="400px" style="clear: both;" alt="">
      </div>
      <div class="update-block">
         <div class="header">
            <h2>Match-level data available</h2>
            <h3>5/16/23</h3>
         </div>
         <hr>
         <p>
            Click on any champ then click on the dropdown arrow in a match container. Can see stats like CC, gold spent, dmg, time spent dead, etc... At the moment data is pulled directly
            from Riot servers and is not stored in the Aramstats db. So old matches may not be viewable.  
         </p>
      </div>
      <div class="update-block">
         <div class="header">
            <h2>Moving database</h2>
            <h3>5/9/23 - 5/10/23</h3>
         </div>
         <hr>
         <p>
            Migrating database for more capacity. This is...experimental so there are some lingering issues.
         </p>
         <p>
               <s>Working on the issue where you're stuck on the the "parsing summoner" page for a unexpectedly long period of time.</s> e: I think this is fixed?
         </p>
      </div>
      <div class="update-block">
         <div class="header">
            <h2>New UI</h2>
            <h3>5/2/23</h3>
         </div>
         <hr>
         <p>
            I'm rolling out a big UI update. Its incomplete, but good enough to the point I think it's nicer to interact with than the prior UI. All base functionality
            that the prior UI had should be here. Hmu if you find any weird interactions.
         </p>
      </div>
   </div>
</template>

<style scoped>
.update-main {
   display: flex;
   width: 100%;
   flex-direction: column;
   align-items: center;
   padding: 10vh 0;
   text-align: center;
}

.update-block {
   width: 800px;
   margin-bottom: 3vh;
}

.header {
   display: flex;
   width: 100%;
   justify-content: space-between;
   align-items: flex-end;
}

a {
   color: var(--color-font);
}

h2 {
   font-weight: normal;
   line-height: 1;
   text-align: left;
   color: var(--color-font);
   margin-bottom: 0;
}

h3 {
   font-weight: normal;
   font-size: 1rem;
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

p.sub {
   text-align: center;
   font-size: 0.8rem;
   font-style: italic;
   margin-top: 0;
}
</style>
