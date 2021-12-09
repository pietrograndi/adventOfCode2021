import { pipe } from 'fp-ts/lib/function'
import { chain, map, rights, chunksOf } from 'fp-ts/lib/Array'
import { Either, right, left } from 'fp-ts/lib/Either'
import { number, tuple } from 'io-ts'
import { splitLines } from '../utils/utils'

// ANCHOR cleaning input

export const cleanInput = (data: string) => {
  return pipe(
    data,
    splitLines,
    map(splittingArrow),
    getPoints,
    chain(map(tuple([number, number]).decode)),
    rights,
    chunksOf(2)
  )
}

const getPoints = (s: string[][]) => {
  return pipe(s, map(map(getPoint)))
}
const splittingArrow = (a: string) => a.split(' -> ')
const splittingComma = (a: string) => a.split(',')
const toInt = (a: string): number => parseInt(a, 10)
const getPoint = (a: string) => {
  return pipe(a, splittingComma, map(toInt), map(number.decode), rights)
}
// ANCHOR cleaningCoords

export const cleaningCoords = (
  input: [number, number][][]
): [number, number][] => {
  return pipe(
    input,
    map(sortingLinePoints),
    map(isStrightLine),
    rights,
    chain(getPointInterval)
  )
}

const isStrightLine = (
  coord: [number, number][]
): Either<string, [number, number][]> => {
  const [start, end] = coord
  const [x1, y1] = start
  const [x2, y2] = end
  if (x1 === x2 || y1 === y2) return right(coord)
  const deltaY = y2 - y1
  const deltaX = x2 - x1
  if (Math.abs(deltaY / deltaX) === 1) return right(coord)
  return left('')
}

const sortingLinePoints = (points: [number, number][]): [number, number][] => {
  const [start, end] = points
  if (start[0] === end[0]) return [start, end].sort((a, b) => a[1] - b[1])
  return [start, end].sort((a, b) => a[0] - b[0])
}

const getPointInterval = (coord: [number, number][]) => {
  const ca = Array.from(newRange(coord))
  return ca
}

const newPoint2 = ([start, end]: [number, number][]): [number, number][] => {
  const [x1, y1] = start
  const [x2, y2] = end
  if (x1 === x2 && y1 !== y2) {
    return [[x1, y1 + 1], end]
  }
  if (y1 === y2 && x1 !== x2) {
    return [[x1 + 1, y1], end]
  }
  const slope = getSlope([start, end])
  return [[x1 + 1, y1 + slope], end]
}

const getSlope = ([start, end]: [number, number][]): number => {
  const [x1, y1] = start
  const [x2, y2] = end
  return (y2 - y1) / (x2 - x1)
}

function* newRange([start, end]: [number, number][]) {
  const [x1, y1] = start
  const [x2, y2] = end
  const xStep = Math.abs(x1 - x2)
  let start_c: number = xStep !== 0 ? x1 : y1
  const end_c = xStep !== 0 ? x2 : y2
  let currentCoord: [number, number][] = [start, end]
  while (start_c <= end_c) {
    yield currentCoord[0]
    currentCoord = newPoint2(currentCoord)
    start_c++
  }
}
