import Web3 from 'web3'
import * as ethers from 'ethers'
import routerABI from 'assets/abis/pancakeRouter.json'
import { web3Provider, ethWeb3Provider } from './providers'

const routerAbi: any = routerABI
const bnbWeb3 = new Web3(web3Provider)
const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const pancakeRouterContract = new bnbWeb3.eth.Contract(routerAbi, pancakeV2)

const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

export const getBNBPrice: any = () => {
  return new Promise((resolve) => {
    const path = [wBNBAddr, busdAddr]
    pancakeRouterContract.methods
      .getAmountsOut(bnbWeb3.utils.toBN(1 * 10 ** 18), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
  })
}

const ethWeb3 = new Web3(ethWeb3Provider)
const uniV2: any = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const uniRouterContract = new ethWeb3.eth.Contract(routerAbi, uniV2)
const daiAddr = '0x6b175474e89094c44da98b954eedeac495271d0f'
const wETHAddr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

export const getETHPrice: any = () => {
  return new Promise((resolve) => {
    const path = [wETHAddr, daiAddr]
    uniRouterContract.methods
      .getAmountsOut(ethWeb3.utils.toBN(1 * 10 ** 18), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(`${data[data.length - 1]}`, 18))))
  })
}