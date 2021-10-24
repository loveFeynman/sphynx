import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { ethers } from 'ethers'
import axios from 'axios'
import { PANCAKE_FACTORY_ADDRESS, SPHYNX_FACTORY_ADDRESS, RouterType } from '@sphynxswap/sdk'
import abi from '../config/abi/erc20ABI.json'
import factoryAbi from '../config/abi/factoryAbi.json'
import { getVersion } from './getVersion'
import { BITQUERY_API_KEY } from '../config/constants/endpoints'
import { web3Provider } from './providers'
import { getBNBPrice } from './priceProvider'

const web3 = new Web3(web3Provider)

const config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

async function getTokenDetails(
  address: string,
  routerVersion: string,
): Promise<{
  name: string
  symbol: string
  pair: string
  version: string
}> {
  if (!address) {
    return null
  }
  const token = new web3.eth.Contract(abi as AbiItem[], address)
  const name = await token.methods.name().call()
  const symbol = await token.methods.symbol().call()
  const version = await getVersion(address, routerVersion)
  return { name, symbol, pair: `${symbol}/BNB`, version: version.version }
}

async function getChartData(input: any, pair: any, resolution: any) {
  const resolutionMap = {
    1: 1,
    5: 5,
    10: 10,
    15: 15,
    30: 30,
    60: 60,
    '1H': 60,
    '1D': 1440,
    '1W': 1440 * 7,
    '1M': 1440 * 30,
  }
  const minutes = resolutionMap[resolution]
  console.log('pair', pair)
  let query
  if (pair === '0xc522CE70F8aeb1205223659156D6C398743E3e7a') {
    const pairs = ['0xE4023ee4d957A5391007aE698B3A730B2dc2ba67', pair]
    query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 500, desc: "timeInterval.minute"}
          smartContractAddress: {in: ["${pairs[0]}", "${pairs[1]}"]}
          protocol: {is: "Uniswap v2"}
          baseCurrency: {is: "${input}"}
          quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        ) {
          exchange {
            name
          }
          timeInterval {
            minute(count: ${minutes})
          }
          baseCurrency {
            symbol
            address
          }
          baseAmount
          quoteCurrency {
            symbol
            address
          }
          quoteAmount
          trades: count
          maximum_price: quotePrice(calculate: maximum)
          minimum_price: quotePrice(calculate: minimum)
          open_price: minimum(of: time, get: quote_price)
          close_price: maximum(of: time, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `
  } else {
    query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 500, desc: "timeInterval.minute"}
          smartContractAddress: {is: "${pair}"}
          protocol: {is: "Uniswap v2"}
          baseCurrency: {is: "${input}"}
          quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        ) {
          exchange {
            name
          }
          timeInterval {
            minute(count: ${minutes})
          }
          baseCurrency {
            symbol
            address
          }
          baseAmount
          quoteCurrency {
            symbol
            address
          }
          quoteAmount
          trades: count
          maximum_price: quotePrice(calculate: maximum)
          minimum_price: quotePrice(calculate: minimum)
          open_price: minimum(of: time, get: quote_price)
          close_price: maximum(of: time, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `
  }

  const url = `https://graphql.bitquery.io/`
  let {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  dexTrades = dexTrades.reverse()

  const bnbPrice = await getBNBPrice()

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        const dateTest = trade.timeInterval.minute
        const year = dateTest.slice(0, 4)
        const month = dateTest.slice(5, 7)
        const day = dateTest.slice(8, 10)
        const hour = dateTest.slice(11, 13)
        const minute = dateTest.slice(14, 16)
        const date = new Date(`${month}/${day}/${year} ${hour}:${minute}:00 UTC`)
        return {
          open: trade.open_price * bnbPrice,
          close: trade.close_price * bnbPrice,
          low: trade.minimum_price * bnbPrice,
          high: trade.maximum_price * bnbPrice,
          volume: trade.tradeAmount * bnbPrice,
          time: date.getTime(),
        }
      })
      resolve(data)
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
}

async function getChartStats(address: string, routerVersion: string) {
  const wBNBContract = new web3.eth.Contract(abi as AbiItem[], '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
  try {
    if (!address) {
      return {
        error: true,
        message: 'Invalid address!',
      }
    }
    const till = new Date().toISOString()
    const since = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()

    const baseAddress = address
    const quoteAddress =
      baseAddress === '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        ? '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        : '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'

    const factoryAddress = routerVersion === RouterType.sphynx ? SPHYNX_FACTORY_ADDRESS : PANCAKE_FACTORY_ADDRESS
    const factory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress)
    const pairAddress = await factory.methods.getPair(baseAddress, quoteAddress).call()
    let query =
      routerVersion === RouterType.sphynx
        ? `{
      ethereum(network: bsc) {
        dexTrades(
          date: {since: "${since}", till: "${till}"}
          smartContractAddress: {in: ["0xE4023ee4d957A5391007aE698B3A730B2dc2ba67", "${pairAddress}"]}
          baseCurrency: {is: "${baseAddress}"}
          quoteCurrency: {is: "${quoteAddress}"}
        ) {
          baseCurrency {
            symbol
          }
          quoteCurrency {
            symbol
          }
          open_price: minimum(of: block, get: quote_price)
          close_price: maximum(of: block, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `
        : `{
              ethereum(network: bsc) {
                dexTrades(
                  date: {since: "${since}", till: "${till}"}
                  baseCurrency: {is: "${baseAddress}"}
                  quoteCurrency: {is: "${quoteAddress}"}
                  exchangeName: {in: ["Pancake v2"]}
                ) {
                  baseCurrency {
                    symbol
                  }
                  quoteCurrency {
                    symbol
                  }
                  open_price: minimum(of: block, get: quote_price)
                  close_price: maximum(of: block, get: quote_price)
                  tradeAmount(in: USD, calculate: sum)
                }
              }
            }
            `
    const url = `https://graphql.bitquery.io/`
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config)

    if (!dexTrades) {
      return {
        error: true,
        message: 'Invalid dexTrades!',
      }
    }

    const baseContract = new web3.eth.Contract(abi as AbiItem[], baseAddress)
    const quoteContract = new web3.eth.Contract(abi as AbiItem[], quoteAddress)

    let baseBalance = await baseContract.methods.balanceOf(pairAddress).call()
    const baseDecimals = await baseContract.methods.decimals().call()

    let quoteBalance = await quoteContract.methods.balanceOf(pairAddress).call()
    const quoteDecimals = await quoteContract.methods.decimals().call()

    baseBalance /= 10 ** baseDecimals
    quoteBalance /= 10 ** quoteDecimals

    let price
    let liquidityV2
    let liquidityV2BNB
    if (baseAddress !== '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c') {
      query = `{
                ethereum(network: bsc) {
                  dexTrades(
                    date: {since: "${since}", till: "${till}"}
                    baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
                    quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
                    exchangeName: {in: ["Pancake v2"]}
                  ) {
                    baseCurrency {
                      symbol
                    }
                    quoteCurrency {
                      symbol
                    }
                    close_price: maximum(of: block, get: quote_price)
                  }
                }
              }
            `
      const {
        data: {
          data: {
            ethereum: { dexTrades: newDexTrades },
          },
        },
      } = await axios.post(url, { query }, config)
      if (!newDexTrades) {
        return {
          error: true,
          message: 'No data found of this address',
        }
      }
      price = parseFloat(dexTrades[0].close_price) * parseFloat(newDexTrades[0].close_price)
      liquidityV2 = quoteBalance * parseFloat(newDexTrades[0].close_price)
      liquidityV2BNB = quoteBalance
      if (price.toString().includes('e')) {
        price = price.toFixed(12)
      }
    } else {
      price = dexTrades[0].close_price
      liquidityV2 = baseBalance * price
      liquidityV2BNB = baseBalance
    }
    const percDiff =
      100 *
      Math.abs(
        (parseFloat(dexTrades[0].open_price) - parseFloat(dexTrades[0].close_price)) /
        ((parseFloat(dexTrades[0].open_price) + parseFloat(dexTrades[0].close_price)) / 2),
      )
    const sign = dexTrades[0].open_price > dexTrades[0].close_price ? '-' : '+'

    liquidityV2BNB = await wBNBContract.methods.balanceOf(pairAddress).call()
    liquidityV2BNB = ethers.utils.formatUnits(liquidityV2BNB, 18)
    return {
      volume: dexTrades[0].tradeAmount,
      change: sign + percDiff,
      price,
      liquidityV2,
      liquidityV2BNB,
    }
  } catch (error) {
    console.log('error', error)
    const baseAddress = address
    const quoteAddress =
      baseAddress === '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        ? '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        : '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'

    const factoryAddress = routerVersion === RouterType.sphynx ? SPHYNX_FACTORY_ADDRESS : PANCAKE_FACTORY_ADDRESS
    const factory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress)
    const pairAddress = await factory.methods.getPair(baseAddress, quoteAddress).call()
    let liquidityV2BNB = await wBNBContract.methods.balanceOf(pairAddress).call()
    liquidityV2BNB = ethers.utils.formatUnits(liquidityV2BNB, 18)
    return {
      volume: '',
      change: '',
      price: '',
      liquidityV2: '',
      liquidityV2BNB,
    }
  }
}

async function socialToken(address: string) {
  try {
    const url = `https://r.poocoin.app/smartchain/assets/${address}/info.json`
    const { data } = await axios.get(url)
    delete data.links
    return data
  } catch (e) {
    return { msg: 'error' }
  }
}

const getPancakePairAddress = async (quoteToken, baseToken) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const pancakeFactoryContract = new web3.eth.Contract(factoryAbi as AbiItem[], PANCAKE_FACTORY_ADDRESS)
  const pairAddress = await pancakeFactoryContract.methods.getPair(quoteToken, baseToken).call()
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

const getPriceInfo = async (input, decimals) => {
  const pancakeV2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
  const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
  const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  const routerABI = [
    {
      inputs: [
        { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
        { internalType: 'address[]', name: 'path', type: 'address[]' },
      ],
      name: 'getAmountsOut',
      outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const routerInstance = new web3.eth.Contract(routerABI as AbiItem[], pancakeV2)
    let path = [input, busdAddr]
    const pairAddress = await getPancakePairAddress(input, busdAddr)
    if (pairAddress === null) {
      path = [input, wBNBAddr, busdAddr]
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data))
    } else {
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data))
    }
  })
}

const getPrice = async (tokenAddr) => {
  try {
    if (tokenAddr === '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
      const query = `{
        ethereum(network: bsc) {
          dexTrades(
            baseCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
            quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
            options: {desc: ["block.height"], limit: 1}
          ) {
            block {
              height
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }`

      const url = `https://graphql.bitquery.io/`
      const response = await axios.post(url, { query }, config)
      const { dexTrades } = response.data.data.ethereum

      return (1 / dexTrades[0].quotePrice).toFixed(4)
    }
    const query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 1, desc: "block.height"}
          exchangeName: {in: ["Pancake", "Pancake v2"]}
          baseCurrency: {is: "${tokenAddr}"}
          quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        ) {
          block {
            height
            timestamp{
              time
            }
          }
        }
      }
    }`

    const url = `https://graphql.bitquery.io/`
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config)

    if (dexTrades.length === 0) {
      return 0
    }

    const erc20ABI = [
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ]
    const tokenInstance = new web3.eth.Contract(erc20ABI as AbiItem[], tokenAddr)
    const tokenDecimals = await tokenInstance.methods.decimals().call()
    const data = await getPriceInfo(tokenAddr, tokenDecimals)
    // @ts-ignore
    return parseFloat(web3.utils.fromWei(data[data.length - 1]))
  } catch (error) {
    return 0
  }
}

async function topTrades(address: string, type: 'buy' | 'sell', pairAddress) {
  if (!pairAddress) return []
  const till = new Date().toISOString()
  const since = new Date(new Date().getTime() - 3600 * 24 * 1000 * 3).toISOString()
  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        options: {desc: "block.height"}
        date: {since: "${since}", till: "${till}"}
        smartContractAddress: {is: "${pairAddress}"}
        baseCurrency: {is: "${address}"}
        quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
      ) {
        block {
          height
          timestamp {
            time
          }
        }
        transaction {
          txFrom {
            address
          }
        }
        baseCurrency {
          symbol
        }
        buyCurrency {
          symbol
        }
        sellCurrency {
          symbol
        }
        tradeAmount(in: USD)
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  const {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)
  const wallets = []
  const tradeAmounts = []
  const keyWord = type === 'buy' ? 'sellCurrency' : 'buyCurrency'
  for (let i = 0; i < dexTrades.length; i++) {
    if (dexTrades[i].baseCurrency.symbol === dexTrades[i][keyWord].symbol) {
      if (wallets.indexOf(dexTrades[i].transaction.txFrom.address) === -1) {
        wallets.push(dexTrades[i].transaction.txFrom.address)
        tradeAmounts.push(dexTrades[i].tradeAmount)
      } else {
        const index = wallets.indexOf(dexTrades[i].transaction.txFrom.address)
        tradeAmounts[index] += dexTrades[i].tradeAmount
      }
    }
  }
  for (let i = 0; i < wallets.length - 1; i++) {
    for (let j = i + 1; j < wallets.length; j++) {
      if (tradeAmounts[j] > tradeAmounts[i]) {
        const tradeAmount = tradeAmounts[j]
        tradeAmounts[j] = tradeAmounts[i]
        tradeAmounts[i] = tradeAmount
        const wallet = wallets[i]
        wallets[i] = wallets[j]
        wallets[j] = wallet
      }
    }
  }
  const returnData = []
  for (let i = 0; i < wallets.length; i++) {
    returnData.push({
      wallet: wallets[i],
      usdAmount: tradeAmounts[i],
    })
  }
  return returnData
}

async function getMarksData(account: any, input: any) {
  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        options: {desc: "block.height"}
        baseCurrency: {in: ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0x55d398326f99059ff775485246999027b3197955", "0xe9e7cea3dedca5984780bafc599bd69add087d56", "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"]}
        quoteCurrency: {is: "${input}"}
        txSender: {is: "${account}"}
      ) {
        transaction {
          hash
        }
        smartContract {
          address {
            address
          }
          contractType
          currency {
            name
          }
        }
        tradeIndex
        block {
          timestamp {
            unixtime
          }
          height
        }
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          symbol
          address
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          symbol
          address
        }
        sellAmountInUsd: sellAmount(in: USD)
        tradeAmount(in: USD)
        transaction {
          gasValue
          gasPrice
          gas
        }
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  const {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        return {
          buyAmount: trade.buyAmount,
          buyCurrency: trade.buyCurrency.symbol,
          sellAmount: trade.sellAmount,
          sellCurrency: trade.sellCurrency.symbol,
          tradeAmount: trade.tradeAmount,
          time: trade.block.timestamp.unixtime,
        }
      })
      resolve(data)
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
}

async function getChartDurationData(input: any, pair: any, resolution: any, from: any, to: any) {
  const resolutionMap = {
    1: 1,
    5: 5,
    10: 10,
    15: 15,
    30: 30,
    60: 60,
    '1H': 60,
    '1D': 1440,
    '1W': 1440 * 7,
    '1M': 1440 * 30,
  }
  const minutes = resolutionMap[resolution]
  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 50, desc: "timeInterval.minute"}
        smartContractAddress: {is: "${pair}"}
        protocol: {is: "Uniswap v2"}
        baseCurrency: {is: "${input}"}
        quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        time: {before: "${to}"}
      ) {
        exchange {
          name
        }
        timeInterval {
          minute(count: ${minutes})
        }
        baseCurrency {
          symbol
          address
        }
        baseAmount
        quoteCurrency {
          symbol
          address
        }
        quoteAmount
        trades: count
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: time, get: quote_price)
        close_price: maximum(of: time, get: quote_price)
        tradeAmount(in: USD, calculate: sum)
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  let {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  dexTrades = dexTrades.reverse()

  const bnbPrice = await getBNBPrice()

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        const dateTest = trade.timeInterval.minute
        const year = dateTest.slice(0, 4)
        const month = dateTest.slice(5, 7)
        const day = dateTest.slice(8, 10)
        const hour = dateTest.slice(11, 13)
        const minute = dateTest.slice(14, 16)
        const date = new Date(`${month}/${day}/${year} ${hour}:${minute}:00 UTC`)
        return {
          open: trade.open_price * bnbPrice,
          close: trade.close_price * bnbPrice,
          low: trade.minimum_price * bnbPrice,
          high: trade.maximum_price * bnbPrice,
          volume: trade.tradeAmount * bnbPrice,
          time: date.getTime(),
        }
      })
      resolve(data)
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
}

async function getChartDurationPanData(input: any, routerVersion: any, resolution: any, from: any, to: any) {
  const resolutionMap = {
    1: 1,
    5: 5,
    10: 10,
    15: 15,
    30: 30,
    60: 60,
    '1H': 60,
    '1D': 1440,
    '1W': 1440 * 7,
    '1M': 1440 * 30,
  }

  const minutes = resolutionMap[resolution]
  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 50, desc: "timeInterval.minute"}
        baseCurrency: {is: "${input}"}
        quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
        exchangeName: {is: "Pancake ${routerVersion}"}
        time: {before: "${to}"}
      ) {
        exchange {
          name
        }
        timeInterval {
          minute(count: ${minutes})
        }
        baseCurrency {
          symbol
          address
        }
        baseAmount
        quoteCurrency {
          symbol
          address
        }
        quoteAmount
        trades: count
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: time, get: quote_price)
        close_price: maximum(of: time, get: quote_price)
        tradeAmount(in: USD, calculate: sum)
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  let {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  dexTrades = dexTrades.reverse()

  const bnbPrice = await getBNBPrice()

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        const dateTest = trade.timeInterval.minute
        const year = dateTest.slice(0, 4)
        const month = dateTest.slice(5, 7)
        const day = dateTest.slice(8, 10)
        const hour = dateTest.slice(11, 13)
        const minute = dateTest.slice(14, 16)
        const date = new Date(`${month}/${day}/${year} ${hour}:${minute}:00 UTC`)
        return {
          open: trade.open_price * bnbPrice,
          close: trade.close_price * bnbPrice,
          low: trade.minimum_price * bnbPrice,
          high: trade.maximum_price * bnbPrice,
          volume: trade.tradeAmount * bnbPrice,
          time: date.getTime(),
        }
      })
      resolve(data)
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
}

export { getTokenDetails, getChartStats, socialToken, topTrades, getPrice, getChartData, getMarksData, getChartDurationData, getChartDurationPanData }
export default getTokenDetails
