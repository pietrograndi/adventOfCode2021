import * as fs from 'fs'
import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'

fs.readFile('./src/day04/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const splitted = data.split(/r?\n/)
  const balls = getBalls(splitted)
  const boards = getBoards(splitted)
  estrazione(balls, boards)
})

const getBalls = (input: string[]): number[] => {
  return input[1].split(',').map((b) => Number(b))
}

const getBoards = (input: string[]): number[][][] => {
  const b = buildBoards(input).map((board) => {
    return board.map(splitBoard)
  })
  const newBoards = b.reduce((acc: number[][][], board) => {
    return [...acc, fromColToRow({ board, newRows: [] }).newRows]
  }, [])
  return [...newBoards, ...b]
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
  board: number[][]
  newRows: number[][]
}

const fromColToRow = ({
  board,
  newRows,
}: ColToRowInterface): ColToRowInterface => {
  if (newRows.length === 5) return { board, newRows }
  const position = newRows.length
  const col = board.reduce((acc, item: number[]) => {
    return [...acc, item[position]]
  }, [])
  return fromColToRow({
    board,
    newRows: [...newRows, col],
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

const estrazione = (balls: number[], boards: number[][][]) => {
  const b = balls.reduce(
    (acc, ball) => {
      if (acc.winIndex !== -1) return acc
      return {
        ...boardProcess(acc.boards, ball),
        lastNumber: ball,
      }
    },
    { boards, winIndex: -1, lastNumber: -1, winRowIndex: -1 }
  )
  const cleaned = cleanWinner(b.boards[b.winIndex], b.winRowIndex)
  console.log('total part 1', cleaned * b.lastNumber)
}

const boardProcess = (boards: number[][][], ball: number) => {
  return boards.reduce(
    (acc, board, idx) => {
      const newBoard = board.map(markRow(ball))
      const winRowIndex = checkIsWinningBoard(newBoard)
      const winIndex = winRowIndex !== -1 ? idx : -1
      return {
        winIndex: acc.winIndex !== -1 ? acc.winIndex : winIndex,
        boards: [...acc.boards, newBoard],
        winRowIndex: acc.winRowIndex !== -1 ? acc.winRowIndex : winRowIndex,
      }
    },
    { boards: [], winIndex: -1, winRowIndex: -1 }
  )
}

const checkIsWinningBoard = (board: (string | number)[][]): number => {
  const counter = board.map((row) =>
    row.every((item) => typeof item === 'string')
  )
  return counter.indexOf(true)
}

const cleanWinner = (
  board: (string | number)[][],
  rowIndex: number
): number => {
  const b2 = board.filter((item, idx) => idx !== rowIndex)
  return pipe(
    b2,
    A.chain((x) => x),
    A.map(t.number.decode),
    A.rights,
    A.reduce<number, number>(0, (a, b) => a + b)
  )
}
