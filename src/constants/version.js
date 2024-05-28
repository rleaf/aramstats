/* 
   {
      version: "",
      date: "",
      notes: "",
      add: [],
      remove: [],
      fix: [],
      adjust: [],
      known: [],
   }, 
   */
  
  const version = [
   {
      version: "3.5.4",
      date: "5/28/24",
      notes: `Add more regions to champion stat crawler.`,
      add: [
         `LAN`,
         `LAS`,
         `TW`,
      ],
      remove: [],
      fix: [],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.5.3",
      date: "5/15/24",
      notes: `Updating runes. New runes that replace the old rune id will grandfather in the old rune stats. (Legend Tenacity -> Legend Haste) for now.`,
      add: [
         `New runes`
      ],
      remove: [
         `Old Runes`
      ],
      fix: [],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.5.2",
      date: "5/6/24",
      notes: `Homogenizing site UI.`,
      add: [],
      remove: [],
      fix: [
         `Navigation search bar sets region in localstorage`,
      ],
      adjust: [
         `Brighter burger menu colors on left hand side of Summoner page`,
         `UI: About page, Updates page, Navigation, some of Champions page`
      ],
      known: [],
   }, 
   {
      version: "3.5.1",
      date: "5/4/24",
      notes: `Some follow up fixes. I'm seeing some users have to reparse because Riot sends back an empty object. While being prompted "an error occurred, you'll have to reparse" is working as intended, I've adjusted the retry logic to mitigate invalid responses.`,
      add: [
         `Champion name to champion page document title`
      ],
      remove: [],
      fix: [
         `Backend incorrectly tracking summoner spell observations & casts`,
         `Re-add inactive region to prevent deletion on concurrent polls`,
      ],
      adjust: [
         `Increase number of retries, factor, and retry delay for Riot API promises.`,
         `Summoner page styles.`
      ],
      known: [],
   }, 
   {
      version: "3.5.0",
      date: "4/30/24",
      notes: "Big summoner UI redesign & backend changes. SP = Summoner Page, BE = Backend.",
      add: [
         `SP: Champion class bar chart -> radar chart`,
         `SP: Activity Chart (hoverable)`,
         `SP: Information tooltips (hoverable)`,
         `SP: Team side winrates & playrates (Account stats)`,
         `SP: More general statistics`,
         `SP: Item completion statistics`,
         `SP: Structure statistics`,
         `SP: Teamfight statistics`,
         `SP: Summoner spell statistics`,
         `SP: Keystone statistics`,
         `SP: Secondary tree statistics`,
         `SP: Spellcast statistics`,
         `SP: Ping statistics`,
         `BE: Queue per region for parsing summoners`,
         `Corresponding frontend logic to notify user things like Queue position`,
         `Confirmation that a user wants to parse a profile when initially searching`,
         `** BE: More robust logic to handle frozen summoners on random crashes (check corresponding 3.5 update)`,
         `BE: Retry attempts when fetching from Riot on non-404s`,
      ],
      remove: [
         `SP: Match level detail resolution`,
         `SP: Match level multikills`,
         `SP: Champion stat graphs`,
      ],
      fix: [],
      adjust: [
         `Overhaul Summoner page UI`,
         `Summoner backend endpoint`,
         `UX on initial parse`,
      ],
      known: [
         `SP: Add more general-level stats such as shielding to the side bar`,
         `SP: I forgot to do runes...`,
         `** BE: Frozen summoners (check corresponding 3.5 update)`,
      ]
   },  
   {
      version: "3.4.1",
      date: "2/12/24",
      notes: "",
      add: [
         `Redesign notification to summoner page`

      ],
      remove: [],
      fix: [
         `Anchor scrolling on champion stats`,
         `Patch rollback speed from 3.3.3`
      ],
      adjust: []
   },  
   {
      version: "3.4.0",
      date: "2/9/24",
      notes: "",
      add: [
         `Search bar to nav`
      ],
      remove: [],
      fix: [],
      adjust: [
         `More reliable pagination for aggregating champion stats`,
         `Clean up assets`,
         `Clean up frontend`,
         `Move computed properties to global stores (so much fuuuuun...)`,
      ]
   },  
   {
      version: "3.3.3",
      date: "2/6/24",
      notes: "Backend stuff.",
      add: [],
      remove: [],
      fix: [
         `Patch rollback if latest ddragon patch != live patch (ddragon patch data is occasionally ahead of live)`,
      ],
      adjust: [
         `Faster match pagination`,
         `Region indexing -> matchId indexing`,
         `Restore { _id: Object ids }`,
         `Multiprocess preprocessing & champion forward stages`,
      ]
   }, 
   {
      version: "3.3.2",
      date: "2/4/24",
      notes: "Champion stats finished.",
      add: [
         `Starting/Spells/Skills section`,
      ],
      remove: [],
      fix: [],
      adjust: [
         `Color coded winrates in Tldr section`,
         `Headers in Tldr section are anchors to corresponding section`,
         `General cleaning up`
      ]
   }, 
   {
      version: "3.3.1",
      date: "2/3/24",
      notes: "",
      add: [
         `Limit champion res data to help load times`
      ],
      remove: [],
      fix: [],
      adjust: [
         `Items section UX/UI`,
         `Runes section UX/UI`,
      ]
   }, 
   {
      version: "3.3.0",
      date: "1/30/24",
      notes: "Overhauled (redesigned & developed) champion stat pages for new season.",
      add: [
      ],
      remove: [],
      fix: [],
      adjust: [
         `Baseline version for champion stats sans mythics available. (Limited functionality)`,
         `Champion stats UX/UI`,
         `Instead of the now deprecate mythics, the Tldr section consolidates data by a core build combination`,
         `Items section doesn't take 10 years to load & shows item-specific data`,
         `Heatmap to runes section to quickly & easily view combinations`,
         `DB schemas`,
      ]
   }, 
   {
      version: "3.2.2",
      date: "12/25/23 🎄",
      notes: "",
      add: [
         `More Q&A in About page`
      ],
      remove: [],
      fix: [],
      adjust: []
   }, 
   {
      version: "3.2.1",
      date: "12/11/23",
      notes: "Follow up fixes for 3.2.0",
      add: [],
      remove: [],
      fix: [
         `Crawler error handling`,
         `Sorting by champion name on "Champions" page`,
         `Summoner doc title`,
         `Summoner profile update button indexing`,
         `Champion mythic & rune winrates`,
         `Champion matches in Summoner profiles sorted by newest -> oldest`,
      ],
      adjust: []
   }, 
   {
      version: "3.2.0",
      date: "12/2/23 - 12/10/23",
      notes: "I usually only list frontend changes. This update, however, was a little bit of a doozy so tossing in backend stuff so I can keep track.",
      add: [
         `All (25?) ARAM challenges`,
         `'Friendly' & 'Enemy' tabs in Encounters panel`,
         `Seeded every region for crawler (backend)`,
         `Actively crawling through NA, EUW, EUNE, KR (backend)`,
         `Add more "hey that's pretty neat; how neat is that!" info from match responses (backend)`,
      ],
      remove: [
         `Rank & Grade columns from Champions list. Useless information (for now).`
      ],
      fix: [],
      adjust: [
         `Encounters panel is not naive anymore (gets most observed UTD name)`,
         `Porting panels to gamename#tagline on summoner page`,
         `Challenge image assets -> webp`,
         `Encode tagline`,
         `CSS`,
         `New database. Mongo 4 -> 7 & Ubuntu Server Focal -> Jammy (backend)`,
         `Clean up indexing (backend)`,
         `Faster champion parser (backend)`,
         `Schema changes to support challenges & encounters (backend)`,
         `Minify summoner match keys (backend) & associated frontend references`,
         `Champion names -> Champion Ids (backend)`,
      ]
   },
   {
      version: "3.1.1",
      date: "11/30/23",
      notes: "",
      add: [
         "Hwei"
      ],
      remove: [],
      fix: [
         `Fiddlesticks`
      ],
      adjust: [
         `Update champion assets`,
         `CSS`
      ]
   },
   {
      version: "3.1.0",
      date: "11/28/23",
      notes: "Created Champions page (accessible through nav bar) & general improvements to UX/UI.",
      add: [
         `Champions page. See holistic champion information in a list view`,
         `Settings. Users can customize the information they want to see in the 'tldr' tab in champion stats`,
         `Smaller screen size warning header`
      ],
      remove: [],
      fix: [],
      adjust: [
         `Homogenized CSS`,
         `Improved visual clarity (including day mode)`,
      ]
   }, 
   {
      version: "3.0.1",
      date: "11/21/23",
      notes: "Summoner names -> gameName#tagLine",
      add: [
         `Twisted account-v1 endpoints`
      ],
      remove: [],
      fix: [],
      adjust: [
         `Summoner search`,
         `Backend to handle RiotId`
      ]
   }, 
   {
      version: "3.0.0",
      date: "11/20/23",
      notes: "Finished champion stats.",
      add: [
         'Individual items sub tab'
      ],
      remove: [],
      fix: [
         'Backend masterwork item handling',
         'Rune tree in Riot response returning 0'
      ],
      adjust: [
         'Champion stats UI'
      ]
   },
   {
      version: "2.2.3",
      date: "11/15/23",
      notes: "Pushing new features to champion stats for UX/UI guinea pigs.",
      add: [
         'Runes tab',
         'Items tab'
      ],
      remove: [],
      fix: [
         'Showing wrong itemization in Tldr tab'
      ],
      adjust: [
         'Mythic tab -> Tldr tab'
      ]
   }, 
   {
      version: "2.2.2",
      date: "11/8/23",
      notes: "",
      add: [],
      remove: [],
      fix: [],
      adjust: [
         'Added more to champion stats sneak peek'
      ]
   }, 
   {
      version: "2.2.1",
      date: "11/7/23",
      notes: "Pushing champion stats for api key showcase",
      add: [
         'Champion stats'
      ],
      remove: [],
      fix: [],
      adjust: []
   }, 
   {
      version: "2.2.0",
      date: "10/11/23",
      notes: "Taking break from backend to do something front.",
      add: [
         'Landing experience'
      ],
      remove: [],
      fix: [],
      adjust: [
         'Search UX'
      ]
   }, 
   {
      version: "2.1.2",
      remove: [],
      date: "10/3/23",
      notes: "ARAM crawler built at this point, but seeing if I need a new key. Rate limit conflict between API requests sent by users from Aramstats and API requests sent by crawler for matchdata.",
      add: [
         "500 error handling when database is down",
         "Transition to Pinia for global properties",
         "Use localStorage for region on home page search",
         "Minor UI improvements (eg: button hover css)"
      ],
      fix: [
         "Twisted 429 bug",
         "Image assets not lazy loading on sort in List Panel"
      ],
   },
   {
      version: "2.1.1",
      date: "9/23/23",
      fix: [
         "Update packages on prod for new OCE regions (forgot, woops)"
      ],
      adjust: [
         "HTTP -> HTTPS",
         "Lazy loading image assets & pull more from ddragon CDN"
      ],
   },
   {
      version: "2.1.0",
      date: "9/19/23",
      notes: "Retroactively versioning to 5/2/23 to keep tidy.",
      add: [
         'Versioning',
         'Briar assets',
         'Regions (VN, TW, TH, SG, PH) and update Twisted fork',
         'Automatically get most recent patch',
         'Polling. See pogress of parsing summoners'
      ],
      remove: [
         'Twisted error logging'
      ],
      fix: [
         'NaN issue with kill participation & damages share',
         'Dead match issue where responses from Riot contained no match data',
         'Ddragon item-0 403 response',
      ],
   },
   {
      version: "2.0.0",
      date: "9/14/23",
      add: [
         'Summoner encounter panel & pancakes placeholder'
      ],
      adjust: [
         'Restructured database & redesigned backend',
         'Update frontend to accomodate for new schema'
      ]
   },
   {
      version: "1.1.0",
      date: "5/16/23",
      add: [
         "Match-level data."
      ],
   },
   {
      version: "1.0.0",
      date: "5/2/23",
      notes: "Not technically 1.0.0 but good enough.",
      adjust: [
         'Updated user interface.',
      ]
   },
]

export default version