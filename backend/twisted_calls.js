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
   vn: twisted.Constants.Regions.VIETNAM,
   tw: twisted.Constants.Regions.TAIWAN,
   th: twisted.Constants.Regions.THAILAND,
   sg: twisted.Constants.Regions.SINGAPORE,
   ph: twisted.Constants.Regions.PHILIPPINES,
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
   vn: RegionGroups.SEA,
   tw: RegionGroups.SEA,
   th: RegionGroups.SEA,
   sg: RegionGroups.SEA,
   ph: RegionGroups.SEA,
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
async function getSummonerMatches(puuid, region, start, count) {
   // const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
   return (await api.MatchV5.list(puuid, REGION_GROUPS[region], { queue: 450, start: start, count: count })).response
}

/* 
* Total match history for ARAM (450). matchList[0] is most recent match.
*/
async function getAllSummonerMatches(puuid, region) {
   let matchList = []
   let stop = true

   for (let i = 0; stop; i=i+100) {
      const pull = await api.MatchV5.list(puuid, REGION_GROUPS[region], { queue: 450, start: i, count: 100 })
      matchList.push(pull.response)

      if (pull.response.length === 0) {
         stop = false
      }
   }
   return matchList.flat()
}

/* 
* Get ARAM matches on the most recent patch by the hundreds. Used for crawl init atm.
* Summoner `iLoveUrMomXD` (na) has a contiguous sequence of dead matches that return 404. Starting @ NA1_3961520099.
* 
* Break loop if matchlist[-1] 404s  
*/
async function getSummonerMatchesOnPatch(puuid, region, patch) {
   let matchlist = []
   let stop = true

   for (let i = 0; stop; i+=100) {
      const pull = (await api.MatchV5.list(puuid, REGION_GROUPS[region], { queue: 450, start: i, count: 100 })).response
      matchlist.push(pull)

      const lastMatch = await getMatchInfo(pull[pull.length - 1], region)
      if (lastMatch.status_code && lastMatch.status_code === 404) break

      const matchPatch = lastMatch.info.gameVersion.split('.').slice(0, 2).join('.')
      if (patch != matchPatch) stop = false
   }

   return matchlist.flat()
}

/* 
* Match info.
*/
async function getMatchInfo(matchId, region) {
   try {
      return (await api.MatchV5.get(matchId, REGION_GROUPS[region])).response
   } catch (e) {
      return e.body.status
   }
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
   getSummonerMatchesOnPatch,
   getMatchInfo,
   playerChallenges
}