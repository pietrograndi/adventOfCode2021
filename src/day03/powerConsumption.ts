import { BinaryEnum } from './types'

export const getPowerConsumption = (input: string[]) => {
  const binaryLength = getBinaryLength(input)
  const commonBit = checkMostCommonBit(binaryLength)(input)
  const gammaRate = parseInt(convertToBinaryString(commonBit), 2)
  const epsilonRate = parseInt(convertToBinaryString(commonBit, true), 2)
  return gammaRate * epsilonRate
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
  switch (value) {
    case '1':
      return starting + 1
    case '0':
      return starting - 1
    default:
      throw new Error()
  }
}

const convertToBinaryString = (
  commonBit: number[],
  invert = false
): string | never => {
  return commonBit
    .map((item) => {
      switch (Math.sign(item)) {
        case 1:
          return !invert ? BinaryEnum.ZERO : BinaryEnum.ONE
        case -1:
          return !invert ? BinaryEnum.ONE : BinaryEnum.ZERO
        default:
          throw new Error('something wrong')
      }
    })
    .join('')
}
