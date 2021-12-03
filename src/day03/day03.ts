import * as fs from 'fs'

fs.readFile('./src/day03/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  cleanData(data)
})

const cleanData = (s: string) => {
  const a = s.split(/r?\n/).filter((item) => item !== '')
  const binaryLength = getBinaryLength(a)
  const b = checkMostCommonBit(binaryLength)(a)
  const bs = convertToBinaryString(b)
  const gamma = parseInt(bs, 2)
  const epsilon = parseInt(convertToBinaryString(b, true), 2)
  const power = gamma * epsilon
  console.log('power consumption', power)
}

const getBinaryLength = (sa: string[]): number => {
  const arrLength = sa.reduce((acc: number[], item) => {
    if (acc.length === 0) return [item.length]
    if (acc[acc.length - 1] === item.length) return acc
    return [...acc, item.length]
  }, [])
  if (arrLength.every((item, _, array) => item === array[0]))
    return arrLength[0]
  throw Error('wrong input binary size')
}

const checkMostCommonBit =
  (size: number) =>
  (sa: string[]): number[] => {
    const arr = Array(size).fill(0)
    return sa.reduce((total, binaryString) => {
      return binaryString.split('').reduce((totalA1, binaryItem, idx) => {
        return [
          ...totalA1.slice(0, idx),
          counter(binaryItem, totalA1[idx]),
          ...totalA1.slice(idx + 1, totalA1.length),
        ]
      }, total)
    }, arr)
  }

const counter = (value: string, starting: number): number => {
  return value === '1' ? starting + 1 : starting - 1
}

const convertToBinaryString = (
  commonBit: number[],
  invert = false
): string | never => {
  return commonBit
    .map((item) => {
      switch (Math.sign(item)) {
        case 1:
          return !invert ? '0' : '1'
        case -1:
          return !invert ? '1' : '0'
        default:
          throw new Error('something wrong')
      }
    })
    .join('')
}
