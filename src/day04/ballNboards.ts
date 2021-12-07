import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'

interface ColToRowInterface {
  rows: number[][]
  cols: number[][]
}

export const getBalls = (input: string[]): number[] => {
  return input[1].split(',').map((b) => Number(b))
}

export const getBoards = (input: string[]): number[][][] => {
  return buildBoards(input)
    .map((board) => {
      return board.map(splitBoard)
    })
    .reduce((acc: number[][][], board) => {
      const { rows, cols } = fromRowsToCols({ rows: board, cols: [] })
      return [...acc, [...rows, ...cols]]
    }, [])
}

const splitBoard = (input: string): number[] => {
  return input
    .split(' ')
    .filter((rowItem) => rowItem !== '')
    .map((item) => Number(item))
}

const buildBoards = (input: string[]): string[][] => {
  return input
    .slice(3, input.length)
    .filter((item) => item !== '')
    .reduce((acc: string[][], item: string, idx: number) => {
      const chunkIndex = Math.floor(idx / 5)
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }
      acc[chunkIndex].push(item)
      return acc
    }, [])
}

const fromRowsToCols = ({
  rows,
  cols,
}: ColToRowInterface): ColToRowInterface => {
  if (cols.length === 5) return { rows, cols }
  const position = cols.length
  const col = rows.reduce((acc, item: number[]) => {
    return [...acc, item[position]]
  }, [])
  return fromRowsToCols({
    rows,
    cols: [...cols, col],
  })
}

export const getResult = ({
  winningBalls,
  winningBoards,
}: {
  winningBalls: number[]
  winningBoards: unknown[][][]
}): number => {
  const total = boardCleaner(winningBoards) / 2
  const winningBall = winningBalls[winningBalls.length - 1]
  return total * winningBall
}

const boardCleaner = (winningBoards: unknown[][][]): number => {
  const data = winningBoards
    .flatMap((x) => x)
    .flatMap((x) => x)
    .flatMap((x) => x)
  return pipe(
    data,
    A.map(t.number.decode),
    A.rights,
    A.reduce<number, number>(0, (a, b) => a + b)
  )
}
