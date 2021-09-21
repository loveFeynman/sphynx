/* eslint-disable */
import axios from 'axios'
import * as ethers from 'ethers'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { ZERO_ADDRESS } from 'config/constants'
import { WBNB } from 'config/constants/tokens'
import { TokenInfo, getBnbPrice, getPancakePairAddress, getMinTokenInfo, getTokenPrice } from 'state/info/ws/priceData'
import { AppState } from '../../../state'
import { isAddress } from '../../../utils'
import Web3 from 'web3'
import ERC20ABI from '../../../assets/abis/erc20.json'
import routerABI from '../../../assets/abis/pancakeRouter.json'
import { simpleRpcProvider, simpleWebsocketProvider } from '../../../utils/providers'
import { getBep20Contract } from '../../../utils/contractHelpers'

const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'

const transferEventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const abi: any = ERC20ABI
const routerAbi: any = routerABI

const TableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: hidden;
  & table {
    background: transparent;
    width: 100%;
    & tr {
      background: transparent;
    }
    & td {
      padding: 8px;
    }
    & thead {
      & td {
        color: white;
        font-size: 16px;
        border-bottom: 1px solid white;
        padding: 16px 8px;
        & > div > div {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    & tbody {
      & tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        & h2 {
          font-size: 14px;
          line-height: 16px;
          font-weight: bold;
          &.success {
            color: #00ac1c;
          }
          &.error {
            color: #ea3943;
          }
        }
      }
    }
  }
`

interface TransactionProps {
  timestamp: number
  amount: number
  price: number
  usdValue: number
  isBuy: boolean
  tx: string
}

// let blockNumber = 0
// let txHashs = []
// let pending = []
let blocks = 0
let transactions = []
let myTransactions = []
let lpAddr
// eslint-disable-next-line prefer-const
let newTransactions: TransactionProps[]

const TransactionCard = () => {
  const providerURL = 'wss://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/'
  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerURL))
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const tokenAddress = isAddress(input)
  const [socketData, setSocketData]: any = useState({})
  const [currentTransactions, setTransactions] = useState<TransactionProps[]>([])
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined)
  const tokenContract = useRef(null)

  const getDataQuery = `
  {
  ethereum(network: bsc) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
      date: {since: "2021-08-05", till: null}
      baseCurrency: {is: "${input}"}
      quoteCurrency:{is : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
      ) {
      block {
        timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      tradeIndex
      protocol
      exchange {
        fullName
      }
      smartContract {
        address {
        address
        annotation
        }
      }
      baseAmount
      baseCurrency {
        address
        symbol
      }
      quoteAmount
      quoteCurrency {
        address
        symbol
      }
      transaction {
        hash
      }
      buyCurrency {
        symbol
        address
        name
      }
      sellCurrency {
        symbol
        address
        name
        }
      price
      quotePrice
      }
    }
  }`

  const getPrice: any = async () => {
    return new Promise((resolve) => {
      const pancakeRouterContract = new web3.eth.Contract(routerAbi, pancakeV2)
      const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
      const path = [input, busdAddr]
      pancakeRouterContract.methods
        .getAmountsOut(web3.utils.toWei('1', 'ether'), path)
        .call()
        .then((data) => resolve(data))
    })
  }

  const parseData: any = async () => {
    console.log('blockNumber', blocks)
    console.log('myTransactions', myTransactions)
    return new Promise((resolve) => {
      let newTransactions = transactions
      for (let i = 0; i <= myTransactions.length; i++) {
        if (i == myTransactions.length - 1) {
          console.log('transactions', newTransactions)
          setTransactions(newTransactions)
          resolve(true)
        }

        web3.eth.getTransaction(myTransactions[i]).then(async (data) => {
          if (data.to === pancakeV2) {
            let receipt = await web3.eth.getTransactionReceipt(data.hash)
            let logs: any = receipt.logs.filter((data) => data.topics[0] === transferEventTopic)
            logs = logs.map((log) => {
              log.from = web3.eth.abi.decodeParameter('address', log.topics[1])
              log.to = web3.eth.abi.decodeParameter('address', log.topics[2])
              log.amount = web3.eth.abi.decodeParameter('uint256', log.data)
              return log
            })
            if (logs.length === 0) return
            logs = logs.filter(
              (log) =>
                log.address.toLowerCase() === input &&
                (log.to.toLowerCase() === lpAddr.toLowerCase() || log.from.toLowerCase() === lpAddr.toLowerCase()),
            )
            if (logs.length === 0) return
            const price = await getPrice()
            let oneData: any = {}
            oneData.amount = parseFloat(ethers.utils.formatUnits(logs[0].amount, 18))
            oneData.price = parseFloat(ethers.utils.formatUnits(price[1], 18))
            window.localStorage.setItem('currentPrice', oneData.price)
            oneData.timestamp = new Date().getTime()
            oneData.tx = data.hash
            oneData.isBuy = logs[0].to.toLowerCase() !== lpAddr.toLowerCase()
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
          }
        })
      }
      blocks = 0
      myTransactions = []
    })
  }

  useEffect(() => {
    const fetchLPAddr = async () => {
      lpAddr = await getPancakePairAddress(input, WBNB.address, simpleWebsocketProvider)
    }
    fetchLPAddr()
    const contract: any = new web3.eth.Contract(abi, input)
    contract.events.Transfer({}, async function (error, event) {
      if (blocks < event.blockNumber && blocks !== 0) {
        await parseData()
        blocks = event.blockNumber
        return
      }
      blocks = event.blockNumber
      if (myTransactions.indexOf(event.transactionHash) == -1) {
        myTransactions.push(event.transactionHash)
      }
    })
  }, [])

  useEffect(() => {
    newTransactions = []

    const fetchData = async (tokenAddr: string) => {
      try {
        const provider = simpleWebsocketProvider // simpleRpcProvider
        const bnbPrice = await getBnbPrice(provider)
        const tokenInfo1 = await getMinTokenInfo(tokenAddr, provider)
        setTokenInfo(tokenInfo1)

        // pull historical data
        const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery })
        if (queryResult.data.data && queryResult.data.data.ethereum.dexTrades) {
          newTransactions = queryResult.data.data.ethereum.dexTrades.map((item, index) => {
            const localdate = new Date(item.block.timestamp.time)
            const d = new Date(localdate.getTime() + localdate.getTimezoneOffset() * 60 * 1000)
            const offset = localdate.getTimezoneOffset() / 60
            const hours = localdate.getHours()
            const lcl = d.setHours(hours - offset)

            return {
              timestamp: lcl,
              amount: item.baseAmount,
              price: item.quotePrice * bnbPrice,
              usdValue: item.baseAmount * item.quotePrice * bnbPrice,
              isBuy: item.baseCurrency.symbol === item.buyCurrency.symbol,
              tx: item.transaction.hash,
            }
          })
          setTransactions(newTransactions)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err.message)
        if (tokenContract.current) {
          tokenContract.current.removeAllListeners('Transfer')
        }
      }
    }

    if (tokenAddress) {
      fetchData(tokenAddress)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line no-console
  return (
    <>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <td style={{ width: '30%' }}>Time</td>
              <td style={{ width: '24%' }}>Traded Tokens</td>
              <td style={{ width: '22%' }}>Token Price</td>
              <td style={{ width: '22%' }}>$Value</td>
            </tr>
          </thead>
          <tbody>
            {transactions.map((data) => {
              const date = new Date(data.timestamp)
              const isRecent = new Date().getTime() - data.timestamp > 10000
              return (
                <tr>
                  <td style={{ width: '35%' }}>
                    <a href={'https://bscscan.com/tx/' + data.tx}>
                      <Flex alignItems="center">
                        <h2 className={data.isBuy ? 'success' : 'error'}>{date.toString().split('GMT')[0]}</h2>
                      </Flex>
                    </a>
                  </td>
                  <td style={{ width: '25%' }}>
                    <a href={'https://bscscan.com/tx/' + data.tx}>
                      <h2 className={data.isBuy ? 'success' : 'error'}>{Number(data.amount).toFixed(4)}</h2>
                    </a>
                  </td>
                  <td style={{ width: '25%' }}>
                    <a href={'https://bscscan.com/tx/' + data.tx}>
                      <h2 className={data.isBuy ? 'success' : 'error'}>
                        $
                        {data.price < 0.00001
                          ? data.price
                          : Number(data.price)
                              .toFixed(4)
                              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                      </h2>
                    </a>
                  </td>
                  <td style={{ width: '25%' }}>
                    <a href={'https://bscscan.com/tx/' + data.tx}>
                      <h2 className={data.isBuy ? 'success' : 'error'}>
                        ${(data.price * data.amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                      </h2>
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableWrapper>
      {/* {loader ?
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<BoxesLoader
						boxColor="#8b2a9b"
						shadowColor="#aa8929"
						style={{ marginBottom: "20px", position: 'absolute', left: 567, top: 455 }}
						desktopSize="30px"
						mobileSize="15px"
					/>
				</div>
				: ""
			} */}
    </>
  )
}

export default TransactionCard

// const offset = new Date().getTimezoneOffset();
// console.log(offset);
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// let t:any=timezone
// console.log("t=========================",t)
// t=val.block.timestamp.time
// // // eslint-disable-next-line no-console
// const currentTime = moment().tz(t).format();
// // // eslint-disable-next-line no-console
// const today:any = new Date(currentTime);
