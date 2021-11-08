import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.sphynx,
    earningToken: tokens.sphynx,
    contractAddress: {
      97: '0xD559A9DDBce9855cF051c12bF66D0b362DBB79b4',
      56: '0x96868531D2a20868cF92bF8287F0dE949Baf0966',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools
