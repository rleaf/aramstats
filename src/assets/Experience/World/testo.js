const arr = [2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

let j = arr.findIndex((e, i) => {
   if (arr[i] === 1 && arr[i+1] === 2 & arr[i+2] === 3) return true
})
j

260.556884765625 