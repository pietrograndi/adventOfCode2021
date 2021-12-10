import { readFile } from 'fs'
import { LanternFish } from './lanternFish'
import { chunksOf } from 'fp-ts/lib/Array'

const testList = [3, 4, 3, 1, 2]
readFile('./src/day06/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  console.log(data)
  const parsedData = data.split(',').map((n) => parseInt(n, 10))
  const a = chunksOf(1)(testList) as number[][]
  const totalone = a.reduce((acc, item, index) => {
    const count = fishCounter(item, 256)
    console.log('chunk ', index, 'fish', count)
    return count + acc
  }, 0)
  console.log(totalone)
})

const fishCounter = (ageList: number[], day: number) => {
  const initValues = ageList.map((item) => new LanternFish(item))
  const arr = Array(day).fill('')
  return arr.reduce((acc: LanternFish[]) => {
    return acc.reduce((acc: LanternFish[], fish: LanternFish) => {
      const mayBeFish = fish.checkTimer()
      fish.dayNext()
      return [...acc, fish, ...mayBeFish]
    }, [])
  }, initValues).length
}
