class Config {
   version = 'v2'
   versioned_prefix = `/api/${this.version}`
   prefix = `/api`

   SUMMONER_PREFIX = `${this.prefix}/summoners/:region/:gameName/:tagLine`
   UPDATE_SUMMONER_PREFIX = `${this.prefix}/update/:region/:gameName/:tagLine`

   MATCH_PREFIX = `${this.prefix}/matchInfo/:region/:matchId`
   MATCH_HISTORY_PREFIX = `${this.prefix}/matchHistory/:region/:gameName/:tagLine`

   CHAMPION_PREFIX = `${this.prefix}/champion/:champion`
   CHAMPIONS_LIST_PREFIX = `${this.prefix}/championsList` // change to 'tier'? more catchy?

   STATUS_COMPLETE = 'Complete'
   STATUS_PARSING = 'Parsing summoner...'
   STATUS_CHAMPION_AVERAGES = 'Computing champion averages...'
   STATUS_QUEUE = 'In queue...'
}

module.exports = new Config()