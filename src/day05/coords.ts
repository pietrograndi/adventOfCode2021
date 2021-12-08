import { pipe } from 'fp-ts/lib/function'
import {
  chain,
  map,
  rights,
  flatten,
  uniq,
  reduce,
  chunksOf,
} from 'fp-ts/lib/Array'
import { Either, right, left } from 'fp-ts/lib/Either'
import * as N from 'fp-ts/number'
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
): [number, number][][] => {
  return pipe(input, map(isStrightLine), rights, map(sortingLinePoints))
}

const isStrightLine = (
  x: [number, number][]
): Either<string, [number, number][]> => {
  const isStright = pipe(x, flatten, uniq(N.Eq)).length !== 4
  return isStright ? right(x) : left('')
}

const sortingLinePoints = (points: [number, number][]): [number, number][] => {
  const [zero, one] = pipe(points, map(reduce(0, N.SemigroupSum.concat)))
  if (zero < one) return points
  return points.reverse()
}

// ANCHOR
