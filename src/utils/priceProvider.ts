import Web3 from 'web3'
import * as ethers from 'ethers'
import routerABI from 'assets/abis/pancakeRouter.json'
import { web3Provider } from './providers'

const routerAbi: any = routerABI
const web3 = new Web3(web3Provider)
const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const pancakeRouterContract = new web3.eth.Contract(routerAbi, pancakeV2)

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
