const obj = {
   response: 1,
   b: 2,
   c: 3,
}

const promise = () => new Promise((resolve, reject) => {
   // reject('fail')
   setTimeout(() => {
      resolve(obj)
   }, 500)
})

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000))
function yee() {
   return 2
}
async function call() {

   // let x 
   // return (await promise()).response
   //    .catch(e => console.log(e, 'catch'))
   // return (await promise()
   //    .then(res => x = res)
   //    .catch(e => console.log(e, 'catch2222'))).response
   // return x.response
   return yee()
   // try {
   //    return (await promise()).response
   // } catch (e) {
   //    console.log(e, 'eee')
   // }

}


async function main() {
   let x = await call()
   console.log(x, 'main')
} 

let x = main()
console.log(x, 'x')