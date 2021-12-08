import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'

export const getBoard = (input: [number, number][][]): number[][] => {
  return pipe(input, getMaxSize, createBoard)
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
  return new Array(y).fill(new Array(x).fill(0))
}
