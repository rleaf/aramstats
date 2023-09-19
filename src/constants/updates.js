/* 
   {
      title: "",
      version: "",
      date: "",
      body: [],
      img: [] # Expected webp format
   }
*/

const updates = [
   {
      title: "Database reset.",
      date: "9/14/23",
      version: "2.00",
      body: [
         `I've finished revamping the backend and have reset the database; you will have to reparse your summoner. Although it may not look very different this is a significant change to the website so let me know if you find any issues.`
      ],
   },
   {
      title: "Redesigning backend. Inted to wipe all data.",
      date: "9/2/23",
      body: [
         `There are two main reasons for doing this:`,
         `The first is because I have more storage. To reduce costs when this site began I opted for the free tier of MongoDB Atlas (~500MB storage). Because of the limited amount of storage, I designed the backend to be "picky" when pulling game data from Riot's servers and only store specific information. It was a decent solution for the free tier, but since upgrading to the Pi (pic below), I can be more liberal with hoarding data which in turn may allow me to provide more stats.`,
         `The second is because there's some cleaning up to do. I never intended for this site to be up this long or to even open it up to multiple regions. This started because I wanted to see my performance on certain champs and to try and convince some friends, using empirical data, that maybe Aurelion Sol is just not for them or taking Glacial Augment on Azir deserves a ban. As more people use this site, I'd like to revamp the backend to ameliorate UX and try and make it more efficient so it crashes less.`,
         `I'm using these two reasons as an excuse to start fresh on the database. I haven't actually started working on it yet, but just wanted to let those interested know. Hmu @ryli. on Discord for any questions.`,
      ],
      img: "leo",
      imgCaption: "...guys listen to me...glacial Azir is OP - they're doing it everywhere in Korea."
   },
   {
      title: "Moving database...again.",
      date: "7/22/23",
      body: [
         `Moving database from an old laptop to a Raspberry Pi 4. Planned to do this a while ago as this was the original goal, but they've always been out of stock.`
      ],
      img: "piserver"
   },
   {
      title: "Match-level data available",
      date: "5/16/23",
      version: "1.10",
      body: [
         `Click on any champ then click on the dropdown arrow in a match container. Can see stats like CC, gold spent, dmg, time spent dead, etc... At the moment data is pulled directly from Riot servers and is not stored in the Aramstats db. So old matches may not be viewable.`
      ]
   },
   {
      title: "Moving database",
      date: "5/9/23 - 5/10/23",
      body: [
         `Migrating database for more capacity. This is...experimental so there are some lingering issues.`,  
      ]
   },
   {
      title: "New UI",
      date: "5/2/23",
      version: "1.00",
      body: [
         `I'm rolling out a big UI update. Its incomplete, but good enough to the point I think it's nicer to interact with than the prior UI. All base functionality that the prior UI had should be here. Hmu if you find any weird interactions.`
      ]
   }
]

export default updates