import { readFile } from 'fs'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array'
import { boardUpdater, getBoard } from './board'
import { cleaningCoords, cleanInput } from './coords'

readFile('./src/day05/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const cleanedInput = cleanInput(data)
  const allCoords = cleaningCoords(cleanedInput)

  const board = getBoard(cleanedInput)
  const newEndBoard = lineProcessor(allCoords, board)
  const b = newEndBoard.flat().filter((x) => x > 1).length
  console.log(b)
})

const lineProcessor = (lines: [number, number][], board: number[][]) => {
  return pipe(lines, A.reduce(board, boardUpdater))
}
