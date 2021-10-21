import { Contract, utils } from 'ethers'
import { PANCAKE_FACTORY_ADDRESS } from '@sphynxswap/sdk'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import bscTokenAbi from 'config/abi/erc20.json'
import { ZERO_ADDRESS } from 'config/constants'

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: number
}

export const getMinTokenInfo = async (address, provider): Promise<TokenInfo> => {
  const tokenContract = new Contract(address, bscTokenAbi, provider)
  try {
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    const totalSupply = await tokenContract.totalSupply()
    const tokenInfo = {
      name,
      symbol,
      decimals,
      totalSupply: parseInt(utils.formatUnits(totalSupply, decimals)),
    }
    return tokenInfo
  } catch (e) {
    return null
  }
}

export const getSphynxPairAddress = async (quoteToken, baseToken, provider) => {
  const sphynxFactoryContract = new Contract("0x0C1Bf16f69B88955C177a223759d2B58681d84A3", pancakeFactoryAbi, provider)
  const pairAddress = await sphynxFactoryContract.getPair(quoteToken, baseToken)
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

export const getPancakePairAddress = async (quoteToken, baseToken, provider) => {
  const pancakeFactoryContract = new Contract(PANCAKE_FACTORY_ADDRESS, pancakeFactoryAbi, provider)
  const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken)
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

export const getPancakePairAddressV1 = async (quoteToken, baseToken, provider) => {
  const pancakeFactoryContract = new Contract("0xbcfccbde45ce874adcb698cc183debcf17952812", pancakeFactoryAbi, provider)
  const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken)
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}
