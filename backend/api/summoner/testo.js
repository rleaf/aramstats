const promise = () => new Promise((resolve, reject) => {
   reject('fail')
})

async function getPromise() {
   console.log('1')
   let g = await promise()
   console.log('2')
   // try {
   // } catch (e) {
   //    // throw e
   //    console.log(e, 'toads')     
   // }
}

async function wrapperPromise() {
   try {
      const x = await getPromise()
   } catch (e) {
      console.log(e, 'wrapperPromise')
   }
}

// wrapperPromise()
getPromise()