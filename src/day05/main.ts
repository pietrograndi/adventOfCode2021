import { readFile } from 'fs'
import { splitLines } from '../utils/utils'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import { number, tuple } from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import * as N from 'fp-ts/number'

readFile('./src/day05/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const input2 = pipe(
    data,
    splitLines,
    A.map(splittingArrow),
    getPoints,
    A.chain(A.map(tuple([number, number]).decode)),
    A.rights,
    A.chunksOf(2)
  )
  const maxSize = getMaxSize(input2)
  const board = createBoard(maxSize)
  const lines = getLines(input2)
  console.log(input2)
  console.log(lines)
})

const getPoints = (s: string[][]) => {
  return pipe(s, A.map(A.map(getPoint)))
}

const splittingComma = (a: string) => a.split(',')
const splittingArrow = (a: string) => a.split(' -> ')
const toInt = (a: string): number => parseInt(a, 10)

const getPoint = (a: string) => {
  return pipe(a, splittingComma, A.map(toInt), A.map(number.decode), A.rights)
}

const getMaxSize = (input: [number, number][][]): [number, number] => {
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

const getLines = (input: [number, number][][]) => {
  return pipe(
    input,
    A.map(isStrightLine),
    A.rights,
    A.map(sortingLinePoints),
    A.chain(getPointInterval)
  )
}

const isStrightLine = (x: [number, number][]): E.Either<string, number[][]> => {
  const isStright = pipe(x, A.flatten, A.uniq(N.Eq)).length !== 4
  if (isStright) return E.right(x)
  return E.left('')
}

const sum = (a: number, b: number): number => a + b
const sortingLinePoints = (points: number[][]): number[][] => {
  const [zero, one] = pipe(points, A.map(A.reduce(0, sum)))
  if (zero < one) return points
  return points.reverse()
}

const getPointInterval = ([start, end]: number[][]) => {
  return Array.from(range(start, end))
}

const newPoint =
  (isIncrementFirst: boolean) =>
  (increment: number, fix: number): [number, number] => {
    return isIncrementFirst ? [increment, fix] : [fix, increment]
  }

function* range(start: number[], end: number[]) {
  const [x1, y1] = start
  const [x2, y2] = end

  const isXIncrement = Math.abs(x1 - x2) !== 0
  let start_c: number = isXIncrement ? x1 : y1
  const fixedCoord = isXIncrement ? y1 : x1
  const end_c = isXIncrement ? x2 : y2
  const makePoint = newPoint(isXIncrement)

  while (start_c <= end_c) {
    yield makePoint(start_c, fixedCoord)
    start_c++
  }
}
