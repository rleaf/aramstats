/* 
   {
      version: "",
      date: "",
      notes: "",
      add: [],
      remove: [],
      fix: [],
      adjust: []
   }, 
*/

const version = [
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