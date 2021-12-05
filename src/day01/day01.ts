import * as fs from 'fs'

const cleanInputData = (data: string): number[] => {
  return data.split(/\r?\n/).map((item) => parseInt(item, 10))
}

const calcPreviousMeasurement = (items: number[]): number => {
  return items.reduce(
    (acc: number, item: number, idx: number, array: number[]) => {
      if (idx === 0) return acc
      return item > array[idx - 1] ? acc + 1 : acc
    },
    0
  )
}

const sumArrayOfNumber = (arr: number[]): number => {
  return arr.reduce((acc: number, item: number) => {
    return acc + item
  }, 0)
}

const sumSlidingWindows = (
  src: number[],
  processed: number[] = []
): [src: number[], processed: number[]] => {
  if (src.length === 0) return [src, processed]
  const slidingWindows = [...processed, sumArrayOfNumber(src.slice(0, 3))]
  const [, ...remains] = src
  return sumSlidingWindows(remains, slidingWindows)
}

const readCallback =
  (processCallback: (data: string) => void) => (err: Error, data: string) => {
    if (err) return
    processCallback(data)
  }

const handlingOutput = (data: string) => {
  const cleaned = cleanInputData(data)
  console.log('PART 1 - total increment -', calcPreviousMeasurement(cleaned))
  const slindingWindows = sumSlidingWindows(cleaned)[1]
  const incrementSlidingWindows = calcPreviousMeasurement(slindingWindows)
  console.log('PART 2 - slinding window increment - ', incrementSlidingWindows)
}

fs.readFile('./src/day01/input.txt', 'utf8', readCallback(handlingOutput))
