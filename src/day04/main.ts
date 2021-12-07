import * as fs from 'fs'
import { getBoards, getBalls, getResult } from './ballNboards'
import { draw } from './drawMachine'

fs.readFile('./src/day04/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const splitted = data.split(/r?\n/)
  const balls = getBalls(splitted)
  const boards = getBoards(splitted)
  const pt1 = draw(balls, boards)
  const totalPt1 = getResult(pt1)
  console.log('First winning Board', totalPt1)
  console.log('----------')

  const pt2 = draw(balls, boards, true)
  const lastWinningBoard = [pt2.winningBoards[pt2.winningBoards.length - 1]]
  const totalPt2 = getResult({
    winningBalls: pt2.winningBalls,
    winningBoards: lastWinningBoard,
  })
  console.log('Last winning board', totalPt2)
})
