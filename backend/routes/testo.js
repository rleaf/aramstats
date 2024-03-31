const arr = [1, 2, 3, 4, 5, 6]
const a = {a: 1, b: 2, c: 3}
const b = {a: 1, b: 2, d: 3}
let c
let d = 5
console.log(arr[9])
if (arr[9]) console.log('toad')
let f1
if (10 - c > 5) console.log('rhino');
if (!f1) console.log('turkey');
console.log(Math.pow(-2, 2))
// ((x) => {
//    console.log(x)
// })('toads')

delete arr[3]
arr
const af = o => (o ** 2)
console.log(af(3))
let arr2 = [
   {
      assistingParticipantIds: [Array],
      bounty: 180,
      killStreakLength: 1,
      killerId: 10,
      position: {
         "x": 123,
         "y": 321
      }
   },
   {
      assistingParticipantIds: [Array],
      bounty: 180,
      killStreakLength: 0,
      killerId: 8,
      position: {
         "x": 234,
         "y": 432
      }
   },
   {
      assistingParticipantIds: [Array],
      bounty: 180,
      killStreakLength: 0,
      killerId: 4,
      position: {
         "x": 345,
         "y": 543
      }
   }
]

arr2 = arr2.map(x => ({ x: x.position.x, y: x.position.y }))
// arr2 = arr2.flatMap((v, i) => arr2.slice(i+1).map(w => [v.position, w.position]))
console.log(arr2)