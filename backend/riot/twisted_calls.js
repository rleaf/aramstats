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

async function summonerByNameExample(summoner, region) {
   return await api.Summoner.getByName(summoner, REGION_CONSTANTS[region])
}

async function summonerTimeline(summoner, region) {
   const summonerRes = summonerByNameExample(summoner, region)
   return await api.MatchV5.list(summonerRes.response.puuid, RegionGroups.AMERICAS, { queue: 450 })
}
module.exports = {
   summonerByNameExample
}