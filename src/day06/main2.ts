import { readFile } from 'fs'

readFile('./src/day06/input.txt', 'utf-8', (err: Error, data: string) => {
  if (err) return
  const parsedData = data.split(',').map((n) => parseInt(n, 10))
  const days = 256
  const initArray = new Array(9).fill(0)

  parsedData.forEach((e) => {
    initArray[e]++
  })

  for (let i = 0; i < days; i++) {
    const [
      dayZero,
      dayOne,
      dayTwo,
      dayThree,
      dayFour,
      dayFive,
      daySix,
      daySeven,
      dayEight,
    ] = initArray
    initArray[0] = dayOne
    initArray[1] = dayTwo
    initArray[2] = dayThree
    initArray[3] = dayFour
    initArray[4] = dayFive
    initArray[5] = daySix
    initArray[6] = daySeven + dayZero
    initArray[7] = dayEight
    initArray[8] = dayZero
  }

  console.log(initArray.reduce((a, b) => a + b))
})
