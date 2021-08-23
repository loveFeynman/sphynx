import { Interface } from '@ethersproject/abi'
import { ChainId } from '@pancakeswap/sdk'
import PANCAKE_FACTORY_ABI from '../../abi/pancakeSwapFactory.json'

const PANCAKE_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // TODO
  [ChainId.TESTNET]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
}

const PANCAKE_FACTORY_INTERFACE = new Interface(PANCAKE_FACTORY_ABI)

export { PANCAKE_FACTORY_ADDRESSES, PANCAKE_FACTORY_INTERFACE, PANCAKE_FACTORY_ABI }
