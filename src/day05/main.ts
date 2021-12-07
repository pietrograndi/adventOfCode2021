import * as fs from 'fs'
import { splitLines } from '../utils/utils'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import { number } from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import * as N from 'fp-ts/number'

fs.readFile('./src/day05/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const input = pipe(data, splitLines, A.map(splittingArrow), getPoints)
  const maxSize = getMaxSize(input)
  const board = createBoard(maxSize)
  const lines = getLines(input)
  console.log(lines)
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

const createBoard = (size: [number, number]): number[][] => {
  const [x, y] = size
  const cols = new Array(size[y])
  const board = cols.map(() => new Array(x).fill(0))
  return board
}

const getLines = (input: number[][][]) => {
  return pipe(input, A.map(isStrightLine), A.rights, A.map(sortingLinePoints))
}

const isStrightLine = (x: number[][]): E.Either<string, number[][]> => {
  const isStright = pipe(x, A.flatten, A.uniq(N.Eq)).length !== 4
  if (isStright) return E.right(x)
  return E.left('')
}

const sum = (a: number, b: number): number => a + b
const sortingLinePoints = (points: number[][]): number[][] => {
  const [zero, one] = pipe(points, A.map(A.reduce(0, sum)))
  if (zero < one) return points
  return [points[1], points[0]]
}
