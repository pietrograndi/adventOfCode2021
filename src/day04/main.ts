import * as fs from 'fs'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'

fs.readFile('./src/day04/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const splitted = data.split(/r?\n/)
  const balls = getBalls(splitted)
  const boards = getBoards(splitted)
  const part1 = estrazione(balls, boards)
  const total =
    finalePart1(part1.winningBoards) *
    part1.winningBalls[part1.winningBalls.length - 1]
  console.log('TOTAL PART 1', total)
  console.log('----------')
  const part2 = estrazione(balls, boards, true)
  const lastWinningBoard = [part2.winningBoards[part2.winningBoards.length - 1]]
  const totalPart2 = finalePart1(lastWinningBoard)
  console.log(
    'TOTAL PART 2',
    totalPart2 * part2.winningBalls[part2.winningBalls.length - 1]
  )
})

const getBalls = (input: string[]): number[] => {
  return input[1].split(',').map((b) => Number(b))
}

const getBoards = (input: string[]): number[][][] => {
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

interface ColToRowInterface {
  rows: number[][]
  cols: number[][]
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

const markRow = (ball: number) => (row: number[]) => {
  const position = row.indexOf(ball)
  return position === -1
    ? row
    : [
        ...row.slice(0, position),
        row[position].toString(),
        ...row.slice(position + 1, row.length),
      ]
}
const estrazione = (
  balls: number[],
  boards: number[][][],
  part2 = false
): {
  winningBalls: number[]
  winningBoards: unknown[][][]
  boards: number[][][]
} => {
  return balls.reduce(
    (acc, ball) => {
      if (acc.winningBoards.length > 0 && !part2) return acc
      const bp = boardProcess(acc.boards, ball, part2)

      const isWinning = bp.winningIndex.length > 0
      const winningBoards: unknown[] = bp.winningIndex.map((i) => bp.boards[i])
      const boards = bp.boards.filter(
        (item, index) => !bp.winningIndex.includes(index)
      )
      return {
        winningBoards: isWinning
          ? [...acc.winningBoards, winningBoards]
          : acc.winningBoards,
        boards,
        winningBalls: isWinning
          ? [...acc.winningBalls, ball]
          : acc.winningBalls,
      }
    },
    { boards, winningBalls: [], winningBoards: [] }
  )
}

const boardProcess = (boards: number[][][], ball: number, part2 = false) => {
  return boards.reduce(
    (acc, board, index) => {
      const updatedBoard = board.map(markRow(ball))
      const isWinning = checkIsWinningBoard(updatedBoard) !== -1
      const alreadyWin = acc.winningIndex.length === 1

      if (alreadyWin && !part2) return acc

      return {
        boards: [...acc.boards, updatedBoard],
        winningIndex: isWinning
          ? [...acc.winningIndex, index]
          : acc.winningIndex,
      }
    },
    {
      boards: [],
      winningIndex: [],
    }
  )
}

const checkIsWinningBoard = (board: (string | number)[][]): number => {
  const counter = board.map((row) =>
    row.every((item) => typeof item === 'string')
  )
  return counter.indexOf(true)
}

const cleanWinnerBoard = (board: unknown[]): number => {
  return pipe(
    board,
    A.map(t.number.decode),
    A.rights,
    A.reduce<number, number>(0, (a, b) => a + b)
  )
}

const finalePart1 = (winningBoards: unknown[][][]) => {
  const data = winningBoards
    .flatMap((x) => x)
    .flatMap((x) => x)
    .flatMap((x) => x)
  return cleanWinnerBoard(data) / 2
}
