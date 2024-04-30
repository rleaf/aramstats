const championNameBook = require('./constants/championNames')

function scribe(puuid, game) {
   let champion = {}
   let participantIndex = game.metadata.participants.findIndex((x) => x == puuid)
   
   // Error handling for alien matches. Ex: Midbeast (OCE) @ OC1_502838822
   if (participantIndex == -1) return
   
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
   champion['items'] = getItems(player)

   // Summoner spells
   champion['summoner1Id'] = player.summoner1Id
   champion['summoner2Id'] = player.summoner2Id

   // Magic, physical, true, total damage dealt & DPM
   champion['magicDamageDealtToChampions'] = player.magicDamageDealtToChampions
   champion['physicalDamageDealtToChampions'] = player.physicalDamageDealtToChampions
   champion['trueDamageDealtToChampions'] = player.trueDamageDealtToChampions
   champion['totalDamageDealtToChampions'] = player.totalDamageDealtToChampions
   champion['damagePerMinute'] = Math.round(player.totalDamageDealtToChampions / champion['gameDuration'])

   // Ally information
   champion['allies'] = allyStats(game.info.participants, player.teamId, participantIndex)

   // Misc (Damage share, KP, KDA)
   champion['damageShare'] = getDamageShare(player, champion['allies'])
   champion['killParticipation'] = getKillParticipation(player, champion['allies'])
   champion['kda'] = getKDA(player)

   // Magic, physical, true,total damage taken
   champion['magicDamageTaken'] = player.magicDamageTaken
   champion['physicalDamageTaken'] = player.physicalDamageTaken
   champion['trueDamageTaken'] = player.trueDamageTaken
   champion['totalDamageTaken'] = player.totalDamageTaken
   champion['damageTakenPerMinute'] = Math.round(player.totalDamageTaken / champion['gameDuration'])
   champion['totalSelfMitigated'] = player.damageSelfMitigated
   champion['selfMitigatedPerMinute'] = Math.round(player.damageSelfMitigated / champion['gameDuration'])


   // Heals
   champion['totalHeal'] = player.totalHeal
   champion['healPerMinute'] = Math.round(player.totalHeal / champion['gameDuration'])
   champion['totalHealsOnTeammates'] = player.totalHealsOnTeammates
   champion['allyHealPerMinute'] = Math.round(player.totalHealsOnTeammates / champion['gameDuration'])

   // 4fun
   champion['tripleKills'] = player.tripleKills
   champion['quadraKills'] = player.quadraKills
   champion['pentaKills'] = player.pentaKills

   return champion
}

function getDamageShare(player, allies) {
   let totalDamage = allies.map(ally => ally.totalDamageDealtToChampions).reduce((a, b) => a + b, 0) + player.totalDamageDealtToChampions
   let ds = Math.round(player.totalDamageDealtToChampions / totalDamage * 100) / 100

   return ds
}

function getKillParticipation(player, allies) {
   let totalKills = allies.map(ally => ally.kills).reduce((a, b) => a + b, 0) + player.kills
   let kp = Math.round((player.kills + player.assists) / totalKills * 100) / 100

   return kp
}

function getKDA(player) {
   // Math.round(player.challenges.kda * 100) / 100
   const kda = Math.round(((player.kills + player.assists) / player.deaths) * 100) / 100
   return kda
}

function allyStats(participants, teamId, rootPlayerIdx) {
   let allies = []

   participants.forEach((participant, i) => {
      if (participant.teamId === teamId && rootPlayerIdx != i) {
         let ally = {}

         // Meta
         ally.summonerName = participant.summonerName
         
         // Primary
         ally.championName = participant.championName
         ally.trueChampionName = championNameBook[participant.championName]
         ally.kills = participant.kills
         ally.deaths = participant.deaths
         ally.assists = participant.assists

         // Items
         ally.items = getItems(participant)

         // Damage
         ally.totalDamageDealtToChampions = participant.totalDamageDealtToChampions

         allies.push(ally)
      }
   })
   
   return allies
}

function getItems(player) {
   let items = []

   for(let i = 0; i < 6; i++) {
      items.push(player[`item${i}`])
   }
   
   return items
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
      'healPerMinute': 0,
      'heal': 0,
      'healingOnTeam': 0,
      'allyHealPerMinute': 0,
      'tank': 0,
      'damageTakenPerMinute': 0,
      'mitigated': 0,
      'selfMitigatedPerMinute': 0,
      'kills': 0,
      'deaths': 0,
      'assists': 0,
      'killParticipation': 0,
      'damageShare': 0,
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
      avg.healPerMinute += matches[i].healPerMinute

      avg.healingOnTeam += matches[i].totalHealsOnTeammates
      avg.allyHealPerMinute += matches[i].allyHealPerMinute

      avg.tank += matches[i].totalDamageTaken
      avg.damageTakenPerMinute += matches[i].damageTakenPerMinute
      
      avg.mitigated += matches[i].totalSelfMitigated
      avg.selfMitigatedPerMinute += matches[i].selfMitigatedPerMinute

      // Kills, deaths, assists
      avg.kills += matches[i].kills
      avg.deaths += matches[i].deaths
      avg.assists += matches[i].assists

      avg.killParticipation += matches[i].killParticipation * 100
      avg.damageShare += matches[i].damageShare * 100

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