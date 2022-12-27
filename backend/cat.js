/*
   - champion winrate
   - killing sprees (trip, quad, pen)
   - average stats (dmg, healing, tank)
*/

/*
champions = [
   {
      championName: String,
      kills: Int,
      deaths: Int,
      assists: Int,

   }
]
*/
let champions = []
let we = 0

function iterateMatchFeed(puuid, matchContainer) {
   // Iterate through every match document
   matchContainer.forEach(doc => {
      // Iterate through each game
      
      doc.matches.forEach((game) => {
         
         let participantIndex = game.metadata.participants.findIndex((x) => x == puuid)
         let player = game.info.participants[participantIndex]
         let champion = {}

         // Meta 
         champion['matchId'] = game.metadata.matchId
         champion['gameDuration'] = game.info.gameDuration
         champion['win'] = player.win

         // Primary 
         champion['championName'] = player.championName
         champion['kills'] = player.kills
         champion['deaths'] = player.deaths
         champion['assists'] = player.assists
         champion['goldEarned'] = player.goldEarned

         // Items
         champion['item0'] = player.item0
         champion['item1'] = player.item1
         champion['item2'] = player.item2
         champion['item3'] = player.item3
         champion['item4'] = player.item4
         champion['item5'] = player.item5
         champion['item6'] = player.item6

         // Summoner spells
         champion['summoner1Id'] = player.summoner1Id
         champion['summoner2Id'] = player.summoner2Id

         // Magic, physical, true, total damage dealt
         champion['magicDamageDealtToChampions'] = player.magicDamageDealtToChampions
         champion['physicalDamageDealtToChampions'] = player.physicalDamageDealtToChampions
         champion['trueDamageDealtToChampions'] = player.trueDamageDealtToChampions
         champion['totalDamageDealtToChampions'] = player.totalDamageDealtToChampions

         // Magic, physical, true,total damage taken
         champion['magicDamageTaken'] = player.magicDamageTaken
         champion['physicalDamageTaken'] = player.physicalDamageTaken
         champion['trueDamageTaken'] = player.trueDamageTaken
         champion['totalDamageTaken'] = player.totalDamageTaken

         // Heals
         champion['totalHealsOnTeammates'] = player.totalHealsOnTeammates

         // 4fun
         champion['tripleKills'] = player.tripleKills
         champion['quadraKills'] = player.quadraKills
         champion['pentaKills'] = player.pentaKills
         
         // pings
         let pings = {}
         pings['allInPings'] = player.allInPings
         pings['assistMePings'] = player.assistMePings
         pings['baitPings'] = player.baitPings
         pings['basicPings'] = player.basicPings
         pings['commandPings'] = player.commandPings
         pings['dangerPings'] = player.dangerPings
         pings['enemyMissingPings'] = player.enemyMissingPings
         pings['enemyVisionPings'] = player.enemyVisionPings
         pings['getBackPings'] = player.getBackPings
         pings['holdPings'] = player.holdPings
         pings['needVisionPings'] = player.needVisionPings
         pings['onMyWayPings'] = player.onMyWayPings
         pings['pushPings'] = player.pushPings
         pings['visionClearedPings'] = player.visionClearedPings

         champion['pings'] = pings
         champions.push(champion)
      })
   });
   for (let i = 0; i < matchContainer.length; i++) {
      for (let j = 0; j < matchContainer[i].matches.length; j++) {
         we++
      }
   }
   
   console.log(we)
   return champions
}

module.exports = {
   iterateMatchFeed,
}