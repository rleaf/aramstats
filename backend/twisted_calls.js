const e = require('express')
const twisted = require('twisted')
const { RegionGroups } = require('twisted/dist/constants')
const api = new twisted.LolApi({
   debug: {
      logRatelimits: true
   }
})

const REGION_CONSTANTS = {
   na: twisted.Constants.Regions.AMERICA_NORTH,
   euw: twisted.Constants.Regions.EU_WEST,
   eune: twisted.Constants.Regions.EU_EAST,
   kr: twisted.Constants.Regions.KOREA,
   lan: twisted.Constants.Regions.LAT_NORTH,
   las: twisted.Constants.Regions.LAT_SOUTH,
   oce: twisted.Constants.Regions.OCEANIA,
   tr: twisted.Constants.Regions.TURKEY,
   ru: twisted.Constants.Regions.RUSSIA,
   jp: twisted.Constants.Regions.JAPAN,
   br: twisted.Constants.Regions.BRAZIL,
   pbe: twisted.Constants.Regions.PBE,
}

const REGION_GROUPS = {
   na: RegionGroups.AMERICAS,
   euw: RegionGroups.EUROPE,
   eune: RegionGroups.EUROPE,
   kr: RegionGroups.ASIA,
   lan: RegionGroups.AMERICAS,
   las: RegionGroups.AMERICAS,
   oce: RegionGroups.SEA,
   tr: RegionGroups.EUROPE,
   ru: RegionGroups.EUROPE,
   jp: RegionGroups.ASIA,
   br: RegionGroups.AMERICAS,
}

/* 
* Summoner info.
*/
async function getSummoner(summoner, region) {
   return (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
}

/* 
* Variable match history for ARAM (450). Used for utility.
*/
async function getSummonerMatches(summoner, region) {
   const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
   return (await api.MatchV5.list(summonerGet.puuid, REGION_GROUPS[region], { queue: 450, start: 0, count: 10 })).response
}

/* 
* Total match history for ARAM (450). matchList[0] is most recent match.
*/
async function getAllSummonerMatches(summonerName, region) {
   const summonerGet = (await api.Summoner.getByName(summonerName, REGION_CONSTANTS[region])).response
   let matchList = []
   let stop = true

   for (let i = 0; stop; i=i+100) {
      const pull = await api.MatchV5.list(summonerGet.puuid, REGION_GROUPS[region], { queue: 450, start: i, count: 100 })
      matchList.push(pull.response)

      if (pull.response.length == 0) {
         stop = false
      }
   }
   return matchList.flat()
}

/* 
* Match info.
*/
async function getMatchInfo(matchId, region) {
   return (await api.MatchV5.get(matchId, REGION_GROUPS[region])).response  
}

/* 
* Player Challenges.
*/
async function playerChallenges(puuid, region) {
   return (await api.Challenges.PlayerChallenges(puuid, REGION_CONSTANTS[region])).response
}


module.exports = {
   getSummoner,
   getSummonerMatches,
   getAllSummonerMatches,
   getMatchInfo,
   playerChallenges
}