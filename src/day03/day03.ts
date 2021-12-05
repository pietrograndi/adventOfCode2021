import * as fs from 'fs'
import { getLifeSupportRating } from './lifeSupportRating'
import { getPowerConsumption } from './powerConsumption'

fs.readFile('./src/day03/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  onSuccess(data)
})

const onSuccess = (s: string) => {
  const inputArray = s.split(/r?\n/).filter((item) => item !== '')
  const pc = getPowerConsumption(inputArray)
  console.log('power consumption rate', pc)
  const lsr = getLifeSupportRating(inputArray)
  console.log('life support rating', lsr)
}
