import * as fs from 'fs'
import { splitLines } from '../utils/utils'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import { number } from 'io-ts'

fs.readFile('./src/day05/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const input = pipe(data, splitLines, A.map(splittingArrow), getPoints)
  const maxSize = getMaxSize(input)
  console.log(maxSize)
})

const getPoints = (s: string[][]) => {
  return pipe(s, A.map(A.map(getPoint)))
}

const splittingComma = (a: string) => a.split(',')
const splittingArrow = (a: string) => a.split(' -> ')
const toInt = (a: string) => parseInt(a, 10)

const getPoint = (a: string) => {
  return pipe(a, splittingComma, A.map(toInt), A.map(number.decode), A.rights)
}

const getMaxSize = (input: number[][][]): [number, number] => {
  const coords = pipe(input, A.flatten)
  return [
    Math.max(
      ...pipe(
        coords,
        A.map((x) => x[0])
      )
    ),
    Math.max(
      ...pipe(
        coords,
        A.map((x) => x[1])
      )
    ),
  ]
}

// setup board
