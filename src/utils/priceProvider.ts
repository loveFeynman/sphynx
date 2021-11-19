import Web3 from 'web3'
import * as ethers from 'ethers'
import { Contract, utils } from 'ethers'
import { PANCAKE_FACTORY_ADDRESS, SPHYNX_FACTORY_ADDRESS } from '@sphynxswap/sdk'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import bscTokenAbi from 'config/abi/erc20.json'
import { PANCAKE_ROUTER_ADDRESS, ROUTER_ADDRESS, SPHYNX_TOKEN_ADDRESS, ZERO_ADDRESS } from 'config/constants'
import routerABI from 'assets/abis/pancakeRouter.json'
import { web3Provider } from './providers'

const routerAbi: any = routerABI
const web3 = new Web3(web3Provider)
const pancakeRouterContract = new web3.eth.Contract(routerAbi, PANCAKE_ROUTER_ADDRESS)
const sphynxRouterContract = new web3.eth.Contract(routerAbi, ROUTER_ADDRESS)

const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

export const getBNBPrice: any = () => {
  return new Promise((resolve) => {
    const path = [wBNBAddr, busdAddr]
    pancakeRouterContract.methods
      .getAmountsOut(web3.utils.toBN(1 * 10 ** 18), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
  })
}

export const getTokenPrice: any = (tokenAddress) => {
  return new Promise((resolve) => {
    if (tokenAddress === wBNBAddr) {
      const path = [wBNBAddr, busdAddr]
      const routerContract = SPHYNX_TOKEN_ADDRESS === tokenAddress ? sphynxRouterContract : pancakeRouterContract
      routerContract.methods
        .getAmountsOut(web3.utils.toBN(1 * 10 ** 18), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
    } else {
      const path = [tokenAddress, wBNBAddr, busdAddr]
      const routerContract = SPHYNX_TOKEN_ADDRESS === tokenAddress ? sphynxRouterContract : pancakeRouterContract
      routerContract.methods
        .getAmountsOut(web3.utils.toBN(1 * 10 ** 18), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
    }
  })
}

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
  const sphynxFactoryContract = new Contract(SPHYNX_FACTORY_ADDRESS, pancakeFactoryAbi, provider)
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

