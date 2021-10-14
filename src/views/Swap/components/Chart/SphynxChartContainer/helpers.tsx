// Make requests to CryptoCompare API
import { SPHYNX_FACTORY_ADDRESS } from '@sphynxswap/sdk'
import factoryAbi from 'config/abi/factoryAbi.json'
import Web3 from 'web3'
import { web3Provider } from 'utils/providers'
import { WBNB } from 'config/constants/tokens'
import { getChartData } from 'utils/apiServices'

const web3 = new Web3(web3Provider)
const abi: any = factoryAbi
const factoryContract = new web3.eth.Contract(abi, SPHYNX_FACTORY_ADDRESS)

export async function makeApiRequest1(path: any, routerVersion: any, resolution: any) {
  try {
    console.log("Hellooooo")
    const pairAddress = await factoryContract.methods.getPair(path, WBNB.address).call()
    const data: any = await getChartData(path, pairAddress, resolution)
    return data
  } catch (error) {
    console.log("error", error)
    return []
  }
}
// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange: any, fromSymbol: any, toSymbol: any) {
  const short = `${fromSymbol}/${toSymbol}`
  return {
    short,
    full: `${exchange}:${short}`,
  }
}
export function parseFullSymbol(fullSymbol: any) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/)
  if (!match) {
    return null
  }
  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  }
}
