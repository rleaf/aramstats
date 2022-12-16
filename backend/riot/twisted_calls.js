const twisted = require('twisted')
const { RegionGroups } = require('twisted/dist/constants')
const api = new twisted.LolApi()

const REGION_CONSTANTS = {
   na: twisted.Constants.Regions.AMERICA_NORTH,
   euw: twisted.Constants.Regions.EU_WEST,
   eune: twisted.Constants.Regions.EU_EAST,
   kr: twisted.Constants.Regions.KOREA,
   las: twisted.Constants.Regions.LAT_SOUTH,
   lan: twisted.Constants.Regions.LAT_NORTH,
   oce: twisted.Constants.Regions.OCEANIA,
   tr: twisted.Constants.Regions.TURKEY,
   ru: twisted.Constants.Regions.RUSSIA,
   jp: twisted.Constants.Regions.JAPAN,
   br: twisted.Constants.Regions.BRAZIL,
   pbe: twisted.Constants.Regions.PBE,
}

const REGION_GROUPS = {
   na: RegionGroups.AMERICAS,
   eu: RegionGroups.EUROPE,
   kr: RegionGroups.KOREA,
   oce: RegionGroups.SEA
}

async function summonerByNameExample(summoner, region) {
   return await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])
}

async function summonerTimeline(summoner, region) {
   const summonerRes = summonerByNameExample(summoner, region)
   return await api.MatchV5.list(summonerRes.response.puuid, REGION_GROUPS[region], { queue: 450 })
}

async function getMatchHistory(summoner, region) {
   const summonerGet = (await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])).response
   console.log(summonerGet.puuid)
   return (await api.MatchV5.list(summonerGet.puuid, REGION_GROUPS[region], { queue: 450, count: 5 })).response
}

async function getMatchId() {
   const match = (await api.MatchV5.get('NA1_4269202593', RegionGroups.AMERICAS)).response
   console.log('match', match)
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
   summonerByNameExample,
   // matchV5TimelineLatestMatchExample,
   getMatchHistory,
   getMatchId
}