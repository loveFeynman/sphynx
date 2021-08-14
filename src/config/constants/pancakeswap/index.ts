import { Interface } from '@ethersproject/abi'
import { ChainId } from '@pancakeswap/sdk'
import PANCAKE_FACTORY_ABI from '../../abi/pancakeSwapFactory.json'

const PANCAKE_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x635e0D07b3C6523f2Dc2aEbE3E109380248902fb', // TODO
  [ChainId.TESTNET]: '0x635e0D07b3C6523f2Dc2aEbE3E109380248902fb'
}

const PANCAKE_FACTORY_INTERFACE = new Interface(PANCAKE_FACTORY_ABI)

export { PANCAKE_FACTORY_ADDRESSES, PANCAKE_FACTORY_INTERFACE, PANCAKE_FACTORY_ABI }
