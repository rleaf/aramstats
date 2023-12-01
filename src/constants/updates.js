/* 
   {
      title: "",
      version: "",
      date: "",
      body: [],
      links: [],
      img: [] // Expected webp format
   },
*/

const updates = [
   {
      title: `Upgrading DB again. Halting crawler.`,
      version: "",
      date: "11/29/23",
      body: [
         `Sorry, this means I will be wiping everything again in about 2 weeks from now.`,
         `With the crawler (firing only on 1 region), the database is getting large enough to the point where the RPi is having trouble hosting it and occasionally crashes. I've halted the crawler so the champion data you see is frozen.`,
         `The move will be around Dec 9.`,
      ],
      links: [],
      img: []
   },
   {
      title: `Transitioning to "gamename#tagline" lookups`,
      version: "3.0.1",
      date: "11/21/23",
      body: [
         `Hello. Following suit of Riot's name changes, Aramstats has transitioned to summoner lookups via searching using a game name & tagline versus the now deprecated(?) summoner name. This means it's "Hide on bush#kr1" as opposed to "Hide on bush". You'll still have to select a region.`,
         `For the lazys: If you've the default tagline you can omit entering a tagline and the selected region will spot you. So "Hide on bush" with KR selected as a region is equivalent to "Hide on bush#kr1" with KR as a region selected.`,
      ],
      links: [
         ['Riot post discussing name changes', `https://www.riotgames.com/en/DevRel/summoner-names-to-riot-id`],
      ],
      img: []
   },
   {
      title: "Champion stats cont...",
      version: "3.0.0",
      date: "11/20/23",
      body: [
         `* I am only crawling through NA due to hardware constraints. If I can, I'll expand into EU -> KR -> etc...`,

         `I got a production key for the crawler a couple days ago and although there's still a lot of work to be done, the champion stats page is at a "good enough" point for me to comfortable with how it looks on the front end. Champion pages are currently broken into 3 tabs: "tldr", "Items", and "Runes".`,

         `The "tldr" tab is intended to show any relevant data for some champion as if a user was in champ select. There is a synopsis on itemization, runes, spells, and level path. All of this information is filtered by what mythic a user wants to build and then by whether that user is interested in data that yields the most popular selection or data that yields the highest winrate. There are some settings currently available to mutate the information shown such as "Duplicate Items" that toggle...duplicate items. I plan to add more so that people can cater the displayed data to their preferences.`,

         `The "Items" tab has two sub tabs: "Builds" and "Individual Items". "Builds" focuses on allowing users to filter through observed builds by distributing items to the slot in which they were purchased. Users can click on any item in any slot and view all combinations of items (and winrate) which correspond to some observed build.
         Individual Items shows data about a particular item. Currently it shows slot popularity: the frequency by slot in which that item is purchased, and encounters: observed friendly and enemy champion encounters where that item was purchased. I will probably remove/change the latter.`,
         `The "Runes" tab displays every rune winrate and is filterable by mythic.`,
         `Bugs aren't expected, but there may be some lingering.`
      ],
      img: []
   },
   {
      title: "Champion stats",
      date: "11/7/23 - 11/20/23",
      version: "2.2.1+",
      body: [
         `I've been working on developing a page to view champion stats and am pushing it to production to try and get an API key for the crawler it uses. The data you do see is not representative of live patch data.`,
         `A lot of work still needs to be done on both the front and backend, however there is some base functionality with the play data to give a sneak peek. I plan to give a better write up of the bells & whistles if this gets greenlit.`,
         `(11/15/23) - Keeping incremental updates localized to here. Each one is described in more detail in the versioning tab.`,
         `Bugs are expected atm.`
      ]
   },
   {
      title: "Intermittent database freezing.",
      date: "10/13/23",
      body: [
         `The RPi the Aramstats database runs on has been randomly freezing starting around October 12. As a temporary fix I'm manually power cycling the device, however this is why you may be stuck on the "Searching for summoner..." page for a long period of time. Looking into it.`
      ],
   },
   {
      title: "Database reset.",
      date: "9/14/23",
      version: "2.0.0",
      body: [
         `I've finished revamping the backend and have reset the database; you will have to reparse your summoner. Although it may not look very different this is a significant change to the website so let me know if you find any issues.`
      ],
   },
   {
      title: "Redesigning backend. Intend to wipe all data.",
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
      version: "1.1.0",
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
      version: "1.0.0",
      body: [
         `I'm rolling out a big UI update. Its incomplete, but good enough to the point I think it's nicer to interact with than the prior UI. All base functionality that the prior UI had should be here. Hmu if you find any weird interactions.`
      ]
   }
]

export default updates