/* 
   {
      title: "",
      version: "",
      date: "",
      body: [],
      links: [],
      img: [], // Expected webp format
      imgCaption: ""
   },
*/

const updates = [
   {
      title: "Riot API Issues",
      version: "3.14.3",
      date: "1/23/25",
      body: [
         `There are new issues with the Riot API that directly impacts the Aramstats crawler. I've implemented small changes to handle some of them however overall speeds will be slower. I'll try to keep an eye out for updates.`
      ],
      links: [
         ['✨Fixed✨ GH: Empty response', 'https://github.com/RiotGames/developer-relations/issues/1035'],
         ['GH: 500 response', 'https://github.com/RiotGames/developer-relations/issues/1031'],
         ['Lolalytics (good alternative site)', 'https://lolalytics.com/lol/tierlist/aram/'],
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "✨Updates✨ Slow Queue Update Continued (Taiwan)",
      version: "3.11.1",
      date: "9/24/24",
      body: [
         `This is the continued update in regards to the spike of Taiwan users.`,
         `I've not tested the new code on the backend server, but in this update, parsing summoners performs dramatically faster when compared to the previous iteration (both in local environments). While I hope this is enough for expediting the queue, I'll keep looking for other areas of improvement. Again, sorry for any inconveniences.`,
         `✨UPDATE✨: Hello, it's me from the future. Summoners are indeed parsing dramatically faster however it will take a little bit to run through the backlog. The limiting factor is now the CPU and its bursting capabilities. There also seems to be issues with Axios handling concurrent HTTP requests where ~1/20 users will have to reparse. I am attempting to fix this. Thank you for your sacrifice.`,
         `✨UPDATE 2✨: Some final updates (hopefully): 1. I have temporarily allowed my instance to indefinitely burst. With the CPU chugging along, an account with approximately 1000 ARAM games will complete parsing in 2 minutes and 30 seconds. As of time of writing, there are about 300 accounts remaining. This means the queue should complete in maximally 12.5 hours. I am unsure if I will leave bursting on for those 12.5 hours however. Some good news is that I've not seen the concurrent HTTP issues I mentioned in the first update.`,
      ],
      links: [],
      img: [
         'https://i.imgur.com/jiOcVei.png',
      ], // Expected webp format
      imgCaption: "Line chart of CPU utilization. (1) is when the I implemented this update - 3.11.1. (2) is when I ran out of bursting credits. Even though processing won't be as performant as it was between (1) and (2), it should be good enough."
   },
   {
      title: "Slow Queue Update (Taiwan)",
      version: "",
      date: "9/24/24",
      body: [
         `This update message is directed towards Taiwan users. I'll be pushing an update tomorrow that will speed up summoner parsing. Sorry for any inconvenience & thanks for trying out the site.`,
      ],
      links: [],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "Updated Champions List Page",
      version: "3.11.0",
      date: "9/20/24",
      body: [
         `I've been calling it a lot of things, but I'm talking about the page when you click 'Champions' in the nav bar. In this update I'll be calling it the Champions List Page. A little verbose, but it's not really a "Tierlist" and calling it the "Champions" page sounds too similar to "Champion" page which is the page when you search a champion.`,
         `I've redesigned the Champions List Page to show data that provides more quantitative metrics for champions. Specifically, I've (so far) added the sample mean and standard deviation for damage per minute, damage taken per minute, self mitigated damage per minute, and gold per minute. A potential drawback however is, because I'm multiprocessing, I am using the sum of squares method to compute these moments versus something more ideal like the Welford method; sum of squares is known to be numerically unstable when working with big ass numbers. With my current rate limit & speeds I don't *believe* I will encounter these issues, however I'll be keeping an eye out for them.`,
         `Some things tentative about the page currently:`,
         `1. Patch selection. I may remove this to be conservative with hardware.`,
         `2. Data Vis. I originally planned to add eye candy by showing gaussians for all the stats. Since I'm already computing the parameters for them I figured "why not?". After thinking about it more however, I'm not confident enough in the sampled distributions to assume them gaussian - and so the eye candy is on the back burner until I test for normality.`,
         `3. Datums. The four datums (DPM, DTPM, SMPM, and GPM) are pretty specific, and depending on interpretation, *too* specific. For instance, enchanter heavy players are left behind with no information on ally healing per minute and a lot of tanks have healing built into their kits, but there's no healing per minute. I do plan to add these specific stats (AHPM & HPM), but I want to start small and gradually increase. I am thinking of neato stats outside of the "per minute" domain as well.`,
      ],
      links: [
         
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "🎉 New Summoner UI is out 🎉",
      version: "3.5.0",
      date: "4/30/24",
      body: [
         `As mentioned in the previous update, I will be keeping an eye out for bugs - this is primarily for testing. This update breaks down into two significant updates: a new Summoner page UI and a backend redesign.`,
         `This new Summoner Page UI, while I hope more enjoyable to interact with, is functionally much more capable. Rendered stats are computed from selected champions provided in the table. Instead of being limited to viewing things like damage, shielding, and healing on one particular champion, you can now see aggregated stats for any set of champions. Along with the increased customizability, there're also loads more stats to view. Be sure to hover the tooltips for more info of the corresponding stat.`,
         `The backend redesign seeks to resolve a couple of issues with the largest being "frozen summoners". Occasionally, because of hardware constraints, bad code, or a combination of the both, a summoner will be "frozen" or "stuck" stating they're currently being parsed when that account's actually in limbo. I've added more logic and error handling to hopefully prevent these issues. This update is geared heavily towards the summoner UI redesign so although I've reduced the chances of a summoner being frozen, I've not yet implemented logic to "intelligibly unfreeze" them. Currently, if a summoner is detected to be frozen, you will be will have to re-parse them entirely.`,
      ],
      links: [
         
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "Implementing new Summoner UI in the following week",
      version: "",
      date: "4/30/24",
      body: [
         `This is primarily for testing to weed out any bugs. You will have to reparse your summoner. I'm gonna be keeping an eye out, but if you encounter any weirdness feel free to hmu.`,
      ],
      links: [
         
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "Looking for feedback the new summoner page UI (click me)",
      version: "",
      date: "4/23/24 - 4/29/24",
      body: [
         `I've a working prototype for the new Summoner page UI - check it out in the link below. It's still incomplete, however you'll have a general idea of how things are going to be laid out. My Discord is in the 'About' section. Thanks.`,
      ],
      links: [
         [`Prototype`, `https://662059d07b1026c327002486--mellow-parfait-bc28d6.netlify.app/`]
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "Redesigning Summoner pages",
      version: "",
      date: "2/19/24 - 5/2/24",
      body: [
         `I am currently in the long process of redesigning, both front and backend, the entire Summoner page (what you see when you look up your profile). The goals of this redesign are to: 1) match the UI/aesthetic seen on the champion stat pages and 2) show a lot more information that is idiosyncratic to you, the player. There's a link below to some wip concepts I'm intending to implement. This redesign means I will be wiping the summoner database again (I'll post another update warning when I'm going to do it).`,
         `3/13: Finished designing UI.`,
         `4/14: Finished backend.`,
         `4/30: Finished frontend pretty much.`,
         `5/2: Public testing.`,
      ],
      links: [
         [`FigJam Ideas`, `https://www.figma.com/file/iOKkrg5bBTd5IFp3ghjSS0/Aramstats?type=whiteboard&node-id=2%3A345&t=gvPh7LevVFuodZJx-1`]
      ],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "Champion stats functional",
      version: "3.3.0",
      date: "1/30/24",
      body: [
         `Champion stat pages is about 90% complete and the crawler is active again. The redesign has been taking longer than expected because I was trimming a lot of the fat for how data is stored & parsed in order to improve load times. I'll be tossing in little mini updates here too as that 90% goes to 100%.`,
         `2/3: v3.3.1`,
         `2/4: v3.3.2 (100%)`,
      ],
      links: [],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "*1/30 update* Breaking changes expected on patch 14.1",
      version: "",
      date: "1/9/24 - 1/30/24",
      body: [
         `Working on fixing them. With the new patch, some things will require a significant redesign such as the champion stats pages so it may take a hot minute. I'll be sprinkling in minor updates here.`,
         `1/15: Finished designing mythicless UI & streamlining data hoarding to improve load times.`,
         `1/26: More backend streamlining.`,
         `1/29: Tldr section for a champion stat page about 90% complete.`,
         `1/30: Champion stat page about 80% done.`
      ],
      links: [],
      img: [], // Expected webp format
      imgCaption: ""
   },
   {
      title: "New database :)",
      version: "3.2.0",
      date: "12/2/23 - 12/10/23",
      body: [
         `1: You will have to reparse your summoner.`,
         `2: The crawler is active again displaying UTD info based off match data from NA, EUW, EUNE, and KR. I have seeded every region and, if there are no issues, will slowly add more.`,
         `You'll find specific changes listed in the associated version. I plan to chill for a bit and see how well the database handles the new influx of operations.`,
      ],
      links: [],
      img: [] // Expected webp format
   },
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
      version: "2.2.1 - 3.0.0",
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
      img: [
         "leo"
      ],
      imgCaption: "...guys listen to me...glacial Azir is OP - they're doing it everywhere in Korea."
   },
   {
      title: "Moving database...again.",
      date: "7/22/23",
      body: [
         `Moving database from an old laptop to a Raspberry Pi 4. Planned to do this a while ago as this was the original goal, but they've always been out of stock.`
      ],
      img: [
         "piserver"
      ]
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