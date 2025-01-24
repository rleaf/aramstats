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
      version: "3.15.0",
      date: "1/24/25",
      notes: `Cleaning up.`,
      add: [],
      remove: [],
      fix: [
         `Summoner spell assets.`,
         `Rune assets`,
      ],
      adjust: [
         `v3.14.3 update message.`,
         `Homogenize champion assets.`
      ],
      known: [],
   }, 
   {
      version: "3.14.4",
      date: "1/23/25",
      notes: ``,
      add: [],
      remove: [],
      fix: [
         "Mel assets.",
         "Nav search regions to correspond w/ SEA merge."
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.14.3",
      date: "1/23/25",
      notes: ``,
      add: [
         "Mel"
      ],
      remove: [],
      fix: [],
      adjust: [
         `Crawler temporarily omitting 'queue' param for match-v5. Gonna revert when related GH issue is resolved.`
      ],
      known: [],
   }, 
   {
      version: "3.14.2",
      date: "1/9/25",
      notes: ``,
      add: [],
      remove: [],
      fix: [
         `Update Viktor image assets.`
      ],
      adjust: [
         `(SEA merge) Remove PH & TH regions from dropdown selection on hero. SG -> SEA.`
      ],
      known: [],
   }, 
   {
      version: "3.14.1",
      date: "11/27/24",
      notes: ``,
      add: [],
      remove: [],
      fix: [
         `"Starting Items/Spells/Skill..." section on Champion page.`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.14.0",
      date: "11/6/24",
      notes: `Add Ambessa.`,
      add: [
         `Ambessa assets.`
      ],
      remove: [],
      fix: [
         `Champion abilities tooltip ordering. W ability tooltip was swapped with E.`
      ],
      adjust: [
         `Meraki -> CDragon.`
      ],
      known: [],
   }, 
   {
      version: "3.13.0",
      date: "10/24/24",
      notes: `Light adjustments to summoner account stats.`,
      add: [],
      remove: [
         `Fountainsitter stat.`
      ],
      fix: [],
      adjust: [
         `SmallScreen now appears at bottom & is clickable to remove.`,
         `Red & Blue side winrate representation.`,
         `Updated tooltips.`
      ],
      known: [],
   }, 
   {
      version: "3.12.1",
      date: "10/15/24",
      notes: ``,
      add: [],
      remove: [],
      fix: [
         `Starting items in the Overview section on champion pages (particularly health pots) rendering incorrectly when toggling between different core builds.`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.12.0",
      date: "10/13/24",
      notes: `Sorry for delay on re-adding LT. I am also "temporarily" removing ARAM modifiers from champion pages as I was pulling data from the fandom wiki whose data is no longer reliable; looking into a more robust system.`,
      add: [
         `Lethal Tempo`
      ],
      remove: [
         `ARAM modifiers`
      ],
      fix: [],
      adjust: [
         `SmallScreen CSS`
      ],
      known: [],
   }, 
   {
      version: "3.11.2",
      date: "9/24/24",
      notes: `Check 3.11.1 ✨edit✨`,
      add: [],
      remove: [],
      fix: [
         `(Attempted fix) Axios timeout concurrency issues`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.11.1",
      date: "9/24/24",
      notes: `Check corresponding 3.11.1 update.`,
      add: [],
      remove: [],
      fix: [],
      adjust: [
         `Increased Summoner parsing speeds. (Dramatic improvements when tested & compared locally).`,
         `Styles.`
      ],
      known: [],
   }, 
   {
      version: "3.11.0",
      date: "9/20/24",
      notes: `Peep 3.11.0 update. Everything in 'Added' is for the Champions List Page.`,
      add: [
         `Damage per Minute (DPM), Self Mitigated per Minute (SMPM), Damage Taken per Minute (DTPM), and Gold Per Minute (GPM) first and second central moments to Champions List Page.`,
         `Patch selection (tentative).`,
         `Buttons for sorting UX.`,
      ],
      remove: [],
      fix: [],
      adjust: [
         `Champions List UI update.`,
         `Summoner Page table headers are clickable & sticky. Still have to use the button to see per minute variant.`
      ],
      known: [],
   }, 
   {
      version: "3.10.0",
      date: "9/18/24",
      notes: `Although this update is geared towards UX improvements for the Summoner Page, I've done some prep for proceeding updates. In 3.9.0 I talk about how the 'Champions Page' is a litle ugly because I intend to add more stuff to it. Some of the stuff I've done as of now is compute the sample mean & variance for what I'll be referring to as the main stats for every champion: "damage per minute", "self mitigated per minute", "damage taken per minute", and "gold per minute". I won't be doing the third/fourth moments as I'm feelycrafting the distributions to be symmetric. You can probably expect these stats in 3.11.0.`,
      add: [
         `Improved champion sorting UX on summoner profiles. There is increased clarity on how the table is sorted and more options for sorting (you can now sort by a 'per minute' stat).`,
         `Show KDA ratio beneath K/D/A champion & match rows on summoner page: ((K + A) / D).`,
         `** Sample Mean & Sample Variance. Check notes above. **`,
      ],
      remove: [],
      fix: [
         `Nav search event listener interfering with champion table search event listener on summoner pages. Now when the nav search is focused, pressing S will not re-focus towards the champion table search.`
      ],
      adjust: [
         `Only go back to 5 most recent patches for Champion page.`,
         `Styles.`
      ],
      known: [],
   }, 
   {
      version: "3.9.3",
      date: "9/4/24",
      notes: ``,
      add: [
         `Search UX enhancements. 'Ctrl+K' to focus input & 'Esc' to blur.`,
         `Add 'champions played' stat to summoner profile. Shows the sum of champions played.`
      ],
      remove: [],
      fix: [
         'Add Aurora to radar chart'
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.9.2",
      date: "8/30/24",
      notes: ``,
      add: [
         `404 page`,
      ],
      remove: [],
      fix: [
         `seo`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.9.1",
      date: "8/29/24",
      notes: ``,
      add: [
         `A lil seo.`
      ],
      remove: [],
      fix: [
         `Styles for unparsed summoners notification.`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.9.0",
      date: "8/24/24",
      notes: `Homogenizing site UI again. Day mode is a perpetual WIP.`,
      add: [],
      remove: [],
      fix: [],
      adjust: [
         `UI. Focused mainly on improving colors and unifying actionable elements like buttons and the search bar.`,
         `Improved Search UX. Able to use arrow & enter keys to traverse champion lookups. There is also visual indication showing when the search will use the region's default tagline when looking up a summoner.`
      ],
      known: [
         `The Champions page is (hopefully temporary) a little ugly. I'm planning to implement some stuff that extends beyond the scope of this update that will affect that page's UX so I'm leaving it "open ended" for now.`
      ],
   }, 
   {
      version: "3.8.1",
      date: "7/30/24",
      notes: ``,
      add: [],
      remove: [],
      fix: [
         `Crawler error handling on timeline 404s`,
         `Champion skill images on skill prio on Champion pages.`
      ],
      adjust: [
         `UI for patch deltas on champion dropdowns on Summoner pages. This is tentative.`
      ],
      known: [],
   }, 
   {
      version: "3.8.0",
      date: "7/21/24",
      notes: `More information on champion pages. Users can now hover champion skills, items, spells, and runes in the "Overview" section. You'll also find the ARAM specific stat modifiers on the right hand side near the top of the page. I'm looking into ways to implement skill modifications as well.`,
      add: [
         `Hoverable tooltips for items, summoner spells, champion skills, and runes.`,
         `Using cdragon cdn & setup gh cdn using Meraki data.`,
      ],
      remove: [],
      fix: [],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.7.0",
      date: "7/17/24",
      notes: `There's no guarantee for the lifetime of old patch data, but I will generally leave the previous 2-4 patches up for months.`,
      add: [
         `View champion data on older patches. If data DNE, default to current patch.`,
         `See summoner parsing queue in document.title for the alt-tabbers.`
      ],
      remove: [],
      fix: [],
      adjust: [
         `Styles`
      ],
      known: [],
   }, 
   {
      version: "3.6.1",
      date: "7/17/24",
      notes: `Quick patch to add Aurora assets.`,
      add: [
         `Aurora`,
      ],
      remove: [],
      fix: [
         `Table data alignment in summoner lookups`
      ],
      adjust: [],
      known: [],
   }, 
   {
      version: "3.6.0",
      date: "7/12/24",
      notes: `Minor UX things & fixes.`,
      add: [
         `Option to disable landing experience - can cause computers with older GPUs to lag (there's a checkbox on bot left of landing). This setting is saved to local storage.`,
         `Add patch demarcations for summoner matches. Now when you click on a champion dropdown for some summoner profile, it'll be clear which patch the match was from.`,
      ],
      remove: [],
      fix: [
         `Summoner match dropdown sorting. Updated matches were not sorted by newest -> oldest.`,
      ],
      adjust: [],
      known: [],
   }, 
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