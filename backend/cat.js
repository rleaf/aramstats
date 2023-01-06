/*
   cat.js contains the scribing for parsing individual matches 
   and the math logic for average stats
*/

// const CHAMPION_NAME = {
//    do champ names here 
// }

function scribe(puuid, game) {
   let champion = {}
   let participantIndex = game.metadata.participants.findIndex((x) => x == puuid)
   
   // Error handling for alien matches. 
   // Example: Midbeast (OCE) on match OC1_502838822
   if (participantIndex == -1) {
      return
   } 
   
   let player = game.info.participants[participantIndex]

   // Meta 
   champion['matchId'] = game.metadata.matchId
   champion['gameCreation'] = game.info.gameCreation

   if (game.info.gameEndTimestamp) {
      // Seconds
      champion['gameDuration'] = Math.round(game.info.gameDuration / 60)
   } else {
      // Milliseconds
      champion['gameDuration'] = Math.round(game.info.gameDuration / 60000)
   }
   champion['gameVersion'] = game.info.gameVersion
   champion['summonerName'] = player.summonerName
   champion['win'] = player.win

   // Primary 
   champion['championName'] = player.championName
   champion['kills'] = player.kills
   champion['deaths'] = player.deaths
   champion['assists'] = player.assists
   champion['goldEarned'] = player.goldEarned

   // perks
   champion['primaryRune'] = player.perks.styles[0].selections[0].perk
   champion['secondaryTree'] = player.perks.styles[1].style

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

   // Magic, physical, true, total damage dealt & DPM
   champion['magicDamageDealtToChampions'] = player.magicDamageDealtToChampions
   champion['physicalDamageDealtToChampions'] = player.physicalDamageDealtToChampions
   champion['trueDamageDealtToChampions'] = player.trueDamageDealtToChampions
   champion['totalDamageDealtToChampions'] = player.totalDamageDealtToChampions
   champion['damagePerMinute'] = Math.round(player.totalDamageDealtToChampions / champion['gameDuration'])

   // Magic, physical, true,total damage taken
   champion['magicDamageTaken'] = player.magicDamageTaken
   champion['physicalDamageTaken'] = player.physicalDamageTaken
   champion['trueDamageTaken'] = player.trueDamageTaken
   champion['totalDamageTaken'] = player.totalDamageTaken

   // Heals
   champion['totalHeal'] = player.totalHeal
   champion['totalHealsOnTeammates'] = player.totalHealsOnTeammates

   // 4fun
   champion['tripleKills'] = player.tripleKills
   champion['quadraKills'] = player.quadraKills
   champion['pentaKills'] = player.pentaKills

   // pings
   // let pings = {}
   // pings['allInPings'] = player.allInPings
   // pings['assistMePings'] = player.assistMePings
   // pings['baitPings'] = player.baitPings
   // pings['basicPings'] = player.basicPings
   // pings['commandPings'] = player.commandPings
   // pings['dangerPings'] = player.dangerPings
   // pings['enemyMissingPings'] = player.enemyMissingPings
   // pings['enemyVisionPings'] = player.enemyVisionPings
   // pings['getBackPings'] = player.getBackPings
   // pings['holdPings'] = player.holdPings
   // pings['needVisionPings'] = player.needVisionPings
   // pings['onMyWayPings'] = player.onMyWayPings
   // pings['pushPings'] = player.pushPings
   // pings['visionClearedPings'] = player.visionClearedPings

   // champion['pings'] = pings

   return champion
}

function averages(matches) {
   // let stats = {}
   
   let totalGames = 0
   let wins = 0
   let tripleKills = 0
   let quadraKills = 0
   let pentaKills = 0
   
   let totalDmgDealt = 0
   let totalDamagePerMinute = 0
   let totalHeal = 0
   let healingOnTeam = 0
   let totalTank = 0
   let kills = 0
   let deaths = 0
   let assists = 0
   let gold = 0

   for (let i = 0; i < matches.length; i++) {

      // Total games & wins 
      if (matches[i].win == true) {
         wins++
      }
      totalGames++

      // Multikills
      tripleKills += matches[i].tripleKills
      quadraKills += matches[i].quadraKills
      pentaKills += matches[i].pentaKills

      // Damage % DPM, healing, tanking
      totalDmgDealt += matches[i].totalDamageDealtToChampions
      totalDamagePerMinute += matches[i].damagePerMinute
      totalHeal += matches[i].totalHeal
      healingOnTeam += matches[i].totalHealsOnTeammates
      totalTank += matches[i].totalDamageTaken

      // Kills, deaths, assists
      kills += matches[i].kills
      deaths += matches[i].deaths
      assists += matches[i].assists

      // Gold earned
      gold += matches[i].goldEarned
   }

   let total = [totalDmgDealt, totalDamagePerMinute, totalHeal, healingOnTeam, totalTank, kills, deaths, assists, gold]
   let averages = total.map(x => Math.round(x / totalGames))

   return [totalGames, wins, averages, tripleKills, quadraKills, pentaKills]
}

module.exports = {
   scribe,
   averages,
}  