import * as fs from 'fs'
import { pipe } from 'fp-ts/lib/function'
import { Either } from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import { commandTupleCodec } from './codecs'
import { CommandInfo, CommandTypeEnum } from './types'
import { Coords } from './types'
import { Errors } from 'io-ts'

const initCoords = {
  depth: 0,
  distance: 0,
  aim: 0,
}

fs.readFile('./src/day02/input.txt', 'utf8', (err: Error, data: string) => {
  if (err) return
  const reducer = A.reduce<CommandInfo, Coords>(initCoords, coordReducer)
  const res = pipe(data, cleaningData, reducer, multiplyCoords)
  console.log(res)
})

const splitLines = (input: string): string[] => {
  return input.split(/r?\n/)
}

const splitWhiteSpce = (input: string): Either<Errors, CommandInfo> => {
  const splitWs = input.split(' ')
  const [maybeCommand, value] = splitWs
  const unit = parseInt(value, 10)
  return commandTupleCodec.decode([maybeCommand, unit])
}

const cleaningData = (data: string): CommandInfo[] => {
  const parsingArray = A.map(splitWhiteSpce)
  return pipe(splitLines(data), parsingArray, A.rights)
}

const coordReducer = (coord: Coords, command: CommandInfo): Coords => {
  const [commandType, value] = command
  switch (commandType) {
    case CommandTypeEnum.down:
      return increaseDepth(coord, value)
    case CommandTypeEnum.up:
      return decreaseDepth(coord, value)
    case CommandTypeEnum.forward:
      return increaseDistance(coord, value)
    default:
      return coord
  }
}

const increaseDepth = (coords: Coords, aim: number): Coords => {
  return {
    ...coords,
    aim: coords.aim + aim,
  }
}
const decreaseDepth = (coords: Coords, aim: number): Coords => {
  return {
    ...coords,
    aim: coords.aim - aim,
  }
}
const increaseDistance = (coords: Coords, distance: number): Coords => {
  return {
    ...coords,
    distance: coords.distance + distance,
    depth: coords.depth + distance * coords.aim,
  }
}
const multiplyCoords = (coords: Coords): number => {
  return coords.depth * coords.distance
}
