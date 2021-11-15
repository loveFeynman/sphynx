import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'SPHYNX',
    lpAddresses: {
      97: '0x1b318e1C45147e8c4834d16BBed4c9994cf76f86',
      56: '0x1b318e1C45147e8c4834d16BBed4c9994cf76f86',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'SPHYNX-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x93561354a5a4687c54a64cf0aba56a0a392ae882',
    },
    token: tokens.sphynx,
    quoteToken: tokens.wbnb,
  },
  // {
  //   pid: 252,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.wbnb,
  // },
]

export default farms
