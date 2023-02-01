
function scribe(puuid, game) {
   let champion = {}
   let participantIndex = game.metadata.participants.findIndex((x) => x == puuid)
   
   // Error handling for alien matches. Ex: Midbeast (OCE) @ OC1_502838822
   if (participantIndex == -1) {
      return
   } 
   
   let player = game.info.participants[participantIndex]

   // Error handling for dead matches. Ex: Anojen (EUW) @ EUW1_6133461911
   if (!player) return

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
   champion['goldPerMinute'] = Math.round(player.goldEarned / champion['gameDuration'])

   // perks
   champion['primaryRune'] = player.perks.styles[0].selections[0].perk
   champion['secondaryTree'] = player.perks.styles[1].style

   // Items
   let items = []
   for(let i = 0; i < 7; i++) {
      items.push(player[`item${i}`])
   }
   champion['items'] = items

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
   champion['totalSelfMitigated'] = player.damageSelfMitigated

   // Heals
   champion['totalHeal'] = player.totalHeal
   champion['totalHealsOnTeammates'] = player.totalHealsOnTeammates

   // 4fun
   champion['tripleKills'] = player.tripleKills
   champion['quadraKills'] = player.quadraKills
   champion['pentaKills'] = player.pentaKills

   return champion
}

function averages(matches) {

   let stats = {
      'totalGames': 0,
      'wins': 0,
      'tripleKills': 0,
      'quadraKills': 0,
      'pentaKills': 0
   }
   
   let avg = {
      'dmgDealt': 0,
      'damagePerMinute': 0,
      'heal': 0,
      'healingOnTeam': 0,
      'tank': 0,
      'mitigated': 0,
      'kills': 0,
      'deaths': 0,
      'assists': 0,
      'gold': 0,
      'goldPerMinute': 0
   }
   
   stats.totalGames = matches.length

   for (let i = 0; i < matches.length; i++) {

      // Wins 
      if (matches[i].win == true) stats.wins++

      // Multikills
      stats.tripleKills += matches[i].tripleKills
      stats.quadraKills += matches[i].quadraKills
      stats.pentaKills += matches[i].pentaKills

      // Damage, DPM, healing, tanking
      avg.dmgDealt += matches[i].totalDamageDealtToChampions
      avg.damagePerMinute += matches[i].damagePerMinute
      avg.heal += matches[i].totalHeal
      avg.healingOnTeam += matches[i].totalHealsOnTeammates
      avg.tank += matches[i].totalDamageTaken
      avg.mitigated += matches[i].totalSelfMitigated

      // Kills, deaths, assists
      avg.kills += matches[i].kills
      avg.deaths += matches[i].deaths
      avg.assists += matches[i].assists

      // Gold earned
      avg.gold += matches[i].goldEarned
      avg.goldPerMinute += matches[i].goldPerMinute
   }

   for (const [k, v] of Object.entries(avg)) {
      avg[k] = Math.round(v / matches.length)
   }

   stats['avg'] = avg
   return stats
}

module.exports = {
   scribe,
   averages,
}  