export enum BinaryEnum {
  ONE = '1',
  ZERO = '0',
}

export interface BitCriteriaInterface {
  inputArray: BinaryEnum[]
  searchPosition: number
  invert?: boolean
}

export interface CounterInterface {
  input: string[]
  searchPosition: number
}

export interface CommonInterface {
  value: number
  invert: boolean
}

export interface FilterInterface {
  input: string[]
  searchPosition: number
  binary: BinaryEnum
}

export interface ProcessInterface {
  input: string[]
  searchPosition: number
  invert?: boolean
}
