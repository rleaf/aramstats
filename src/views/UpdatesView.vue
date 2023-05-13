<template>
   <div class="update-main">
      <!-- <div class="update-block">
         <h2>Updates</h2>
      </div> -->
      <div class="update-block">
         <div class="header">
            <h2>Moving database</h2>
            <h3>5/9/23 - 5/10/23</h3>
         </div>
         <hr>
         <p>
            <!-- The ARAM Stats DB is currently using 508.9 of the available 512.0 MB. I'm going to be migrating for more capacity so there may be random <i>long</i> downtimes. -->
            Migrating database for more capacity. This is...experimental so there are some lingering issues. Working on the issue where 
            you're stuck on the the "parsing summoner" page for a unexpectedly long period of time.
            
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
</style>
