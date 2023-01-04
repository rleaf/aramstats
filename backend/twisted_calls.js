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

// Get Summoner info
async function getSummoner(summoner, region) {
   return (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
}

// Get variable match history of ARAM games. Primarily used for utility.
async function getSummonerMatches(summoner, region) {
   const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
   return (await api.MatchV5.list(summonerGet.puuid, REGION_GROUPS[region], { queue: 450, start: 0, count: 5 })).response
}

// Get total match history of ARAM games
async function getAllSummonerMatches(summoner, region) {
   const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
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

// Get Match Info
async function getMatchInfo(matchId, region) {
   return (await api.MatchV5.get(matchId, REGION_GROUPS[region])).response  
}


// async function matchV5TimelineLatestMatchExample(summoner, region) {

//   const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
// //   console.log("Found summoner:", summonerGet.puuid)

//   const matchlist = (await api.MatchV5.list(summonerGet.puuid, RegionGroups.AMERICAS, { queue: 450 })).response
// //   console.log("Matchlist length:", matchlist.length)

//   const matchId = matchlist[0]
//   const match = (await api.MatchV5.get(matchId, RegionGroups.AMERICAS)).response
// //   console.log("Found match with id:", match.metadata.matchId)

//   const timeline = (await api.MatchV5.timeline(matchId, RegionGroups.AMERICAS)).response
// //   console.log("Timeline length:", timeline.info.frames.length)
// }


module.exports = {
   getSummoner,
   getSummonerMatches,
   getAllSummonerMatches,
   getMatchInfo
}