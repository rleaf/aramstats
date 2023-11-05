function tldrLevels(item) {

   const list = Object.entries(item).sort((a, b) => b[0].length - a[0].length).slice(0, 10)
   const cutoff = 4
   console.log('LIST @@@@@@@@@@@@@@@@', list)
   let regulars = []

   for (const y in list) {
      let levelPath = list[y][0].slice(3)
      // const data = [levelPath, list[y][1]] 
      const data = list[y]
      let push = true
      
      if (regulars.length === 0) {
         regulars.push(data)
         continue
      } 
         
      const games = list[y][1].games
      const wins = list[y][1].wins
      for (const j in regulars) {
         if (regulars[j][0].includes(levelPath) && levelPath.length >= cutoff) {
            console.log(regulars)
            regulars[j][1].games += 2
            regulars[j][1].wins += 2  
            push = false
            break
         }  
      }
      if (push) {
         regulars.push(data)
      }
   }
   console.log('REGULAR @@@@@@@@@@@@@@@@@', regulars)
}

const e = {
    "123114131": {
        "games": 1,
        "wins": 0
    },
    "123114131343322": {
        "games": 6,
        "wins": 0
    },
    "321114131343322": {
        "games": 2,
        "wins": 0
    },
    "123114333341122422": {
        "games": 11.420000000000002,
        "wins": 9.42
    },
    "123114131343322422": {
        "games": 60.540000000000006,
        "wins": 44.540000000000006
    },
    "1231141313433": {
        "games": 2,
        "wins": 1
    },
    "1233343131411224": {
        "games": 2,
        "wins": 1
    },
    "12311413134332": {
        "games": 10,
        "wins": 5
    },
    "1231141313433224": {
        "games": 10,
        "wins": 5
    },
    "1231141213433324": {
        "games": 4.140000000000001,
        "wins": 4.140000000000001
    },
    "123334313141122422": {
        "games": 23.700000000000003,
        "wins": 19.700000000000003
    },
    "213114131343322422": {
        "games": 1,
        "wins": 0
    },
    "13233431314112": {
        "games": 1,
        "wins": 0
    },
    "12333431314112": {
        "games": 1,
        "wins": 0
    },
    "132114131343322": {
        "games": 1,
        "wins": 0
    },
    "123334313141122": {
        "games": 1,
        "wins": 0
    },
    "123314111342": {
        "games": 1,
        "wins": 0
    },
    "123334233141211": {
        "games": 1,
        "wins": 1
    },
    "123314111343": {
        "games": 1,
        "wins": 0
    },
    "213334313141212": {
        "games": 1,
        "wins": 0
    },
    "12311412134333": {
        "games": 1,
        "wins": 0
    },
    "123114131342332422": {
        "games": 2,
        "wins": 1
    },
    "12333431314112242": {
        "games": 4,
        "wins": 1
    },
    "123214113142223433": {
        "games": 1,
        "wins": 1
    },
    "12311433334112242": {
        "games": 2,
        "wins": 1
    },
    "12311413134332242": {
        "games": 5,
        "wins": 2
    },
    "123114333341": {
        "games": 1,
        "wins": 1
    },
    "123334321341212412": {
        "games": 1,
        "wins": 0
    },
    "321114131343322422": {
        "games": 3,
        "wins": 1
    },
    "1231143113433224": {
        "games": 1,
        "wins": 0
    },
    "12333431314211242": {
        "games": 1,
        "wins": 1
    },
    "1231141313432324": {
        "games": 1,
        "wins": 0
    },
    "132114131343322422": {
        "games": 1,
        "wins": 0
    },
    "321134333141": {
        "games": 1,
        "wins": 0
    },
    "123334313141212422": {
        "games": 4.140000000000001,
        "wins": 4.140000000000001
    },
    "123114131343232422": {
        "games": 4.140000000000001,
        "wins": 3.14
    },
    "123114333341122": {
        "games": 2,
        "wins": 1
    },
    "123114133143342222": {
        "games": 1,
        "wins": 1
    },
    "1321141313433242": {
        "games": 1,
        "wins": 0
    },
    "123334323141": {
        "games": 1,
        "wins": 0
    },
    "123114333342222": {
        "games": 1,
        "wins": 0
    },
    "3121341333411": {
        "games": 1,
        "wins": 1
    },
    "123134131343142222": {
        "games": 1,
        "wins": 0
    }
}

tldrLevels(e)