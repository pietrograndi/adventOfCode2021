export const draw = (
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

const checkIsWinningBoard = (board: (string | number)[][]): number => {
  const counter = board.map((row) =>
    row.every((item) => typeof item === 'string')
  )
  return counter.indexOf(true)
}
