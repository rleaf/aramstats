use('aramstats')

// db['test_summoners'].findOne({ gameName: 'ryi' })
// db['test_summoners'].deleteOne({ gameName: 'ryi' })
db['test_summoner_matches'].drop()
db['test_summoners'].drop()
db['test_summoner_puuids'].drop()
db['queue'].drop()