import {
  BinaryEnum,
  CommonInterface,
  CounterInterface,
  FilterInterface,
  ProcessInterface,
} from './types'

export const getLifeSupportRating = (input: string[]): number => {
  const oxiGeneratorRating = cleaner(
    bitCriteriaCalculator({ input, searchPosition: 0 })
  )
  const C02ScrubberRating = cleaner(
    bitCriteriaCalculator({ input, searchPosition: 0, invert: true })
  )
  return oxiGeneratorRating * C02ScrubberRating
}

const counter2 = ({ input, searchPosition }: CounterInterface): number => {
  return input.reduce((acc, item) => {
    return item[searchPosition] === BinaryEnum.ONE ? acc + 1 : acc - 1
  }, 0)
}

const getCommon = ({ value, invert = false }: CommonInterface): BinaryEnum => {
  if (value === 0 || value > 0)
    return !invert ? BinaryEnum.ONE : BinaryEnum.ZERO
  return !invert ? BinaryEnum.ZERO : BinaryEnum.ONE
}

const bitCriteriaCalculator = (obj: ProcessInterface): ProcessInterface => {
  if (obj.input.length === 1) return obj
  const invert = !!obj.invert
  const binary = getCommon({ value: counter2(obj), invert })
  const nextArray = getNextArray({ ...obj, binary })
  const searchPosition = obj.searchPosition + 1
  return bitCriteriaCalculator({ input: nextArray, searchPosition, invert })
}

const getNextArray = ({
  input,
  searchPosition,
  binary,
}: FilterInterface): string[] => {
  return input.filter((item) => item[searchPosition] === binary)
}

const cleaner = ({ input }: ProcessInterface): number => {
  return parseInt(input.join(''), 2)
}
