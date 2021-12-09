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
  return new Array(y + 1).fill(new Array(x + 1).fill(0))
}

// ANCHOR boardUpdater

export const boardUpdater = (
  board: number[][],
  coord: [number, number]
): number[][] => {
  const [x, y] = coord
  const col = board.map((item, index) => {
    if (index === y)
      return item.map((item, index) => {
        if (index === x) return incrementCell(item)
        return item
      })
    return item
  })
  return col
}
const incrementCell = (n: number) => n + 1

// ANCHOR flattenBoard
export const flatenBoard = (board: [][]): number[] => {
  return pipe(board, A.flatten)
}
