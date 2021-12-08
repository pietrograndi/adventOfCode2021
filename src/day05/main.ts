import { readFile } from 'fs'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as N from 'fp-ts/number'
import { getBoard } from './board'
import { cleaningCoords, cleanInput } from './coords'

readFile('./src/day05/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const cleanedInput = cleanInput(data)
  const coords = cleaningCoords(cleanedInput)
  console.log(cleanedInput.length)
  console.log(coords.length)
  console.log(coords)
  const board = getBoard(cleanedInput)
  const endboard = coordProcessor(coords, board)
  console.log(endboard)
})

const coordProcessor = (
  coordList: [number, number][][],
  board: number[][]
): number[][] => {
  return coordList.reduce((acc, item) => {
    const line = getPointInterval(item)
    return lineProcessor(line, acc)
  }, board)
}

const lineProcessor = (
  lines: [number, number][],
  board: number[][]
): number[][] => {
  return lines.reduce((acc, item) => {
    return boardUpdater(acc, item)
  }, board)
}

const getPointInterval = ([start, end]: [number, number][]) => {
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

const incrementCell = (n: number) => n + 1
const boardUpdater = (
  board: number[][],
  coord: [number, number]
): number[][] => {
  const [x, y] = coord
  const xPosition = x === 0 ? x : x - 1
  const yPosition = y === 0 ? y : y - 1
  const row = [
    ...board[xPosition].slice(0, xPosition),
    incrementCell(board[yPosition][xPosition]),
    ...board[xPosition].slice(x, board[xPosition].length),
  ]
  return [...board.slice(0, yPosition), row, ...board.slice(y, board.length)]
}
