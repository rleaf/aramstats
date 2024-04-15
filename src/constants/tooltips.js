export default {
   /**
   * Champion Tooltips  
   */

   'core': [
      `To consolidate data, these selections represent <b>combinations</b> of core builds - they are core builds irrespective of buy order. This means <b>[boots, kraken, ie]</b> is the same as <b>[kraken, ie, boots]</b> and any other arrangement of those items.`,
      `The boot icon represents all boots.`
   ],
   'items': [
      `Item slots are laid out going left-to-right.`,
      `Each slot is shown with two items where each item is accompanied with the winrate and total games observed for that core build.`,
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
   ],
   'championsTable': [
      `Hello, if you see this please tell me that I forgot about this part.`
   ],
   'heatmap': [
      `The heatmap shows the summoner's playrate for the selected year. Each cell represents a day where the brighter the color indicates more games played. Cells are hoverable for specific information.`,
   ],
}