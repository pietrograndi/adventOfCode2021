import * as t from 'io-ts'
import { CommandTypeEnum } from './types'

export const commandCodec = t.keyof({
  up: CommandTypeEnum.up,
  down: CommandTypeEnum.down,
  forward: CommandTypeEnum.forward,
})

export const commandTupleCodec = t.tuple([commandCodec, t.number])
