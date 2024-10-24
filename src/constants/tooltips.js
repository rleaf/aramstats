export default {
   /**
   * Tierlist Tooltips
   */
   'tierlist': [
      `<b>µ</b>: The sample mean for a particular stat.`,
      `<b>σ</b>: The standard deviation for a particular stat. SD measures the spread of the observed values around the sample mean.`,
      `<b>DPM</b>: Damage per minute.`,
      `<b>DTPM</b>: Damage taken per minute.`,
      `<b>DMPM</b>: Damage mitigated per minute.`,
      `<b>GPM</b>: Gold per minute.`,
   ],

   /**
   * Champion Tooltips  
   */

   'core': [
      `The 10 most observed core builds are shown here, with their winrate & total games, in descending order and are clickable.`,
      `To consolidate data, these selections represent <b>combinations</b> of core builds - they are core builds irrespective of buy order. This means <b>[boots, kraken, ie]</b> is the same as <b>[kraken, ie, boots]</b> and any other arrangement of those items.`,
      `The boot icon represents all boots.`
   ],
   'items': [
      `Purchase order is laid out going left to right with each purchase showing the two most popular items. Every item is accompanied with the winrate and the total games observed.`,
      `You can, instead, sort by winrate by clicking the ellipses near "Overview" to view the settings.`
   ],
   'runes': [
      `Runes are computed by looking at the, depending on your settings, highest winrate or most popular primary and secondary tree. Afterwards it finds the highest winrate or most popular rune in each row for that tree.`
   ],
   'starting': [
      `Starting items are the items purchased within the first minute of game start.`,
   ],
   'spells': [
      `The order the spells are shown do not correspond to the D and F keys.`,
   ],
   'levels': [
      `Levels are computed with no lower bound for champion level set. This adds a slight frequency bias to observed higher level orders.`
   ],

   'popularity': [
      `General data about item popularity.`,
      `<b>Item Popularity</b>: A percentage of how often the item has been purchased.`,
      `<b>Slot Frequency</b>: The number of times the item has been purchased for the corresponding slot (mouseover a bar).`,
      `<b>Total Frequency</b>: The total number of times the item has been purchased.`,
   ],
   'winrate': [
      `General data about item winrate.`,
      `<b>Item Winrate</b>: ...the winrate of the item.`,
   ],
   'skillPriority': [
      `Observed popularity and winrate of skill permutations.`
   ],

   /** 
   * Summoner Tooltips  
   */

   'account': [
      `Top level information about your account.`,
      `<b>Champions Played</b>: How many champs you've played.`,
      `<b>Winrate</b>: Account winrate.`,
      `<b>Time Played</b>: How many days you've played.`,
      `<b>Games</b>: Observed valid games.`,
      `<b>Side Winrate</b>: Percentage of games you win red/blue side.`,
      `<b>Side Playrate</b>: Percentage of games you play red/blue side.`,
   ],
   'championsTable': [
      `A table showcasing various top level statistics for the champions you've played. Click on a champion row to view more specific aggregated statistics or click on the dropdown arrow to view the matches.`,
      `The smaller number below a stat is the "per minute" variant.`
   ],
   'heatmap': [
      `Your activity on the abyss. Each cell represents a day where the brighter the color indicates more games played. Cells are hoverable for specific information.`,
   ],
   /**
    * CHAMPION STATS GENERAL
    */
   'general': [
      `General stats for the selected champions.`,
      `<b>KDA</b>: The average KDA.`,
      `<b>Matches</b>: Total matches.`,
      `<b>First Blood</b>: How many times you've gotten first blood.`,
      `<b>Kill Participation</b>: The average KP.`,
      `<b>Game Length</b>: The average game length.`,
      `<b>Death Time</b>: The average death time.`,
      `<b>Damage</b>: The average damage.`,
      `<b>Damage Taken</b>: The average damage taken.`,
      `<b>Damage Mitigated</b>: The average damage mitigated.`,
      `<b>Healing</b>: The average healing.`,
      `<b>Ally Healing</b>: The average ally healing.`,
      `<b>Ally Shielding</b>: The average ally shielding.`,
      `<b>Gold</b>: The average gold.`,
   ],
   'itemSlots': [
      `Average legendary item completion time. Does not include boots. Formated MM:SS.`,
   ],
   'multikills': [
      `Summed multikills for the selected champions.`,
      `<b>Triples</b>: Total triple kills.`,
      `<b>Quadras</b>: Total quadra kills.`,
      `<b>Pentas</b>: Total penta kills.`,
   ],
   'structures': [
      `Summed structure changes for the selected champions.`,
      `<b>Towers Destroyed</b>: How many towers your team has destroyed.`,
      `<b>Towers Lost</b>: How many towers your team has lost.`,
   ],
   'teamfights': [
      `Statistics to help quantify teamfight efficacy for the selected champions.`,
      `A teamfight is any sequence of champion kills within 5 seconds of each other where at least two of the kills have 2+ assists and the average distance between all kills is less than or equal to 1300 units (about the same as Ashe Hawkshot).`,
      `<b>Frequency</b>: Total teamfights.`,
      `<b>Expectation</b>: The expected outcome of the teamfight. Domained [-5, 5]. <i>"My expectation is 0.7 which means, on average, I can expect my team to be up 0.7 kills after a teamfight."</i>`,
      `<b>Longevity</b>: When, if you do, die. Domained [1, 6] where 1 = first to die and 6 = you don't die. <i>"My longevity is 2.97 which means, on average, I am usually the ~3rd person to die on my team."</i></span> `,
      `<b>Participation</b>: How frequently you participate in the observed teamfights.`,
      `<b>Death</b>: How often you die in a teamfight.`,
      `<b>Capitalization</b>: In the proceeding 30 seconds after a teamfight, how often does your team destroy a structure.`,
   ],
   'spellcasts': [
      `Total spellcasts for the selected champions.`,
   ],
   'summonerSpells': [
      `Summed occurences you've taken and casted a summoner spell.`,
   ],
   'keystoneRunes': [
      `Total keystone wins & games for the selected champions`,
   ],
   'secondaryTree': [
      `Total secondary tree wins & games for the selected champions`,
   ],
   'pings': [
      `Total pings for the selected champions.`,
   ],


   /**
    * ENCOUNTERS
    */
   'friendlies': [
      `Your, limited to the top 50, most encountered teammates and corresponding winrate with them.`,
   ],
   'enemies': [
      `Your, limited to the top 50, most encountered enemies and corresponding winrate against them.`,
   ],
   
   'implement': [
      `Hello, if you see this please tell me that I forgot about this part.`
   ],

}