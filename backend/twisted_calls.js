const twisted = require('twisted')
const { RegionGroups } = require('twisted/dist/constants')
const promiseRetry = require('promise-retry')
const lolApi = new twisted.LolApi()
const riotApi = new twisted.RiotApi()


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
* Summoner info w/ account-v1
* Tethered to AMERICAS region rn because closest to backend server. Can move if need to balance rate limits
*/
   
async function retryWrapper(fn, args) {
   return await promiseRetry(async retry => {
      try {
         return (await fn(...args)).response
      } catch (e) {
         if (e instanceof Error && e.status !== 404) { // Do not retry on 404
            if (e.status === 403) throw e
            retry()
         } else {
            throw e
         }
      }
   }, { retries: 1, factor: 1, minTimeout: 1000 })
      .catch(e => {
         if (e instanceof Error) throw e
         // console.log('hello add error handling to my summoner document here')
      })
}

async function getAccount(gameName, tagLine) {
   // console.log('getAccount')
   return await retryWrapper(riotApi.Account.getByRiotId.bind(riotApi.Account), [gameName, tagLine, RegionGroups.AMERICAS])
}

/* 
* Summoner info.
*/
async function getSummoner(puuid, region) {
   // console.log('getSummoner')
   return await retryWrapper(lolApi.Summoner.getByPUUID.bind(lolApi.Summoner), [puuid, REGION_CONSTANTS[region]])
}

/* 
* Variable match history for ARAM (450). Used for utility.
*/
async function getSummonerMatches(puuid, region, start, count) {
   // console.log('getSummonerMatches')
   return await retryWrapper(lolApi.MatchV5.list.bind(lolApi.MatchV5), [puuid, REGION_GROUPS[region], { queue: 450, start: start, count: count }])
}

/* 
* Total match history for ARAM (450). matchList[0] is most recent match. 
*/
async function getAllSummonerMatches(puuid, region, lastMatchId) {
   let matchList = []
   let stop = true

   for (let i = 0; stop; i+=100) {
      let pull = await retryWrapper(lolApi.MatchV5.list.bind(lolApi.MatchV5), [puuid, REGION_GROUPS[region], { queue: 450, start: i, count: 100 }])
      if (lastMatchId && pull.includes(lastMatchId)) {
         pull = pull.slice(0, pull.indexOf(lastMatchId))
         stop = false
      }

      matchList.push(pull)
      
      try {
         await getMatchInfo(pull[pull.length - 1], region)
      } catch (e) {
         if (e.status === 404) return matchList.flat()
      }
      
      if (pull.length === 0) stop = false
   }
   console.log(matchList.flat().length, 'initial match length')
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
      const pull = await retryWrapper(lolApi.MatchV5.list.bind(lolApi.MatchV5), [puuid, REGION_GROUPS[region], { queue: 450, start: i, count: 100 }])
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
   // console.log('getMatchInfo', matchId, region)
   return await retryWrapper(lolApi.MatchV5.get.bind(lolApi.MatchV5), [matchId, REGION_GROUPS[region]])
}

/* 
* Match timeline info.
*/
async function getMatchTimeline(matchId, region) {
   // console.log('getMatchTimeline')
   return await retryWrapper(lolApi.MatchV5.timeline.bind(lolApi.MatchV5), [matchId, REGION_GROUPS[region]])
}

/* 
* Player Challenges.
*/
async function playerChallenges(puuid, region) {
   // console.log('Challenges')
   return await retryWrapper(lolApi.Challenges.PlayerChallenges.bind(lolApi.Challenges), [puuid, REGION_CONSTANTS[region]])
}


module.exports = {
   getAccount,
   getSummoner,
   getSummonerMatches,
   getAllSummonerMatches,
   getSummonerMatchesOnPatch,
   getMatchInfo,
   getMatchTimeline,
   playerChallenges
}