import * as t from 'io-ts'
import { commandTupleCodec } from './codecs'

export enum CommandTypeEnum {
  'up' = 'up',
  'down' = 'down',
  'forward' = 'forward'
}

export interface Coords {
  depth: number,
  distance: number,
  aim: number
}

export type CommandInfo = t.TypeOf<typeof commandTupleCodec>