/* eslint-disable */
import axios from 'axios'
import * as ethers from 'ethers'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { TokenInfo, getBnbPrice, getPancakePairAddress, getMinTokenInfo, getTokenPrice } from 'state/info/ws/priceData'
import { AppState } from '../../../state'
import { isAddress } from '../../../utils'
import Web3 from 'web3'
import ERC20ABI from '../../../assets/abis/erc20.json'
import routerABI from '../../../assets/abis/pancakeRouter.json'
import { simpleWebsocketProvider } from '../../../utils/providers'
import { Spinner } from '../../LotterySphx/components/Spinner'

const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const sphynxAddr = '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c'
const transferEventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
let tokenDecimal = 18

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

let blocks = 0
let transactions = []
let myTransactions = []

const TransactionCard = () => {
  const providerURL = 'wss://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/'
  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerURL))
  const [transactionData, setTransactions] = useState([]);
  let input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  if(input === '-') input = sphynxAddr;
  const tokenAddress = isAddress(input)

  const getDataQuery = `
  {
  ethereum(network: bsc) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
      date: {since: "2021-08-05", till: null}
      baseCurrency: {is: "${input}"}
      quoteCurrency:{is : "${wBNBAddr}"}
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
    return new Promise(async (resolve) => {
      const pancakeRouterContract = new web3.eth.Contract(routerAbi, pancakeV2)
      let path = [input, busdAddr]
      const pairAddress = await getPancakePairAddress(input, busdAddr, simpleWebsocketProvider)
      if (pairAddress === null) {
        path = [input, wBNBAddr, busdAddr]
      }
      pancakeRouterContract.methods
        .getAmountsOut(web3.utils.toBN(1 * Math.pow(10, tokenDecimal)), path)
        .call()
        .then((data) => resolve(data))
    })
  }

  const parseData: any = async () => {
    let newTransactions = transactionData;
    return new Promise((resolve) => {
      for (let i = 0; i <= myTransactions.length; i++) {
        if (i === myTransactions.length) {
          setTransactions(newTransactions)
          resolve(true)
        }

        web3.eth.getTransaction(myTransactions[i]).then(async (data) => {
          try {
            let receipt = await web3.eth.getTransactionReceipt(data.hash)
            let logs: any = receipt.logs.filter(
              (data) => data.topics[0] === transferEventTopic && data.hasOwnProperty('data'),
            )
            logs = logs.map((log: any) => {
              log.from = web3.eth.abi.decodeParameter('address', log.topics[1])
              log.to = web3.eth.abi.decodeParameter('address', log.topics[2])
              log.amount = web3.eth.abi.decodeParameter('uint256', log.data)
              return log
            })
            if (logs.length === 0) return
            logs = logs.filter(
              (log) =>
                log.address.toLowerCase() === input.toLowerCase() &&
                (log.to.toLowerCase() === receipt.from.toLowerCase() ||
                  log.from.toLowerCase() === receipt.from.toLowerCase()),
            )
            const price = await getPrice()
            let oneData: any = {}
            oneData.amount = parseFloat(ethers.utils.formatUnits(logs[0].amount, tokenDecimal))
            oneData.price = parseFloat(ethers.utils.formatUnits(price[price.length - 1], 18))
            oneData.timestamp = new Date().getTime()
            oneData.tx = data.hash
            window.localStorage.setItem('currentToken', input)
            window.localStorage.setItem('currentPrice', oneData.price)
            logs = logs.filter((log) => log.to.toLowerCase() == receipt.from.toLowerCase())
            oneData.isBuy = logs.length != 0
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
          } catch (err) { }
        })
      }
      blocks = 0
      myTransactions = []
    })
  }

  useEffect(() => {
    window.localStorage.removeItem('currentPrice') // initiate
    transactions = []
    const contract: any = new web3.eth.Contract(abi, input)
    const fetchDecimals = async () => {
      tokenDecimal = await contract.methods.decimals().call()
    }
    fetchDecimals()
    let emitter = contract.events
      .Transfer({}, async function (error, event) {
        if (error) {
          console.error
        }
      })
      .on('data', async (event) => {
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
    return () => {
      window.localStorage.removeItem('currentPrice') // initiate
    }
  }, [input])

  useEffect(() => {
    let newTransactions = []

    const fetchData = async (tokenAddr: string) => {
      try {
        const provider = simpleWebsocketProvider // simpleRpcProvider
        const bnbPrice = await getBnbPrice(provider)

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
      {transactionData.length > 0 ?

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
              {transactionData.map((data, key) => {
                const date = new Date(data.timestamp)
                const isRecent = new Date().getTime() - data.timestamp > 10000
                return (
                  <tr key={key}>
                    <td style={{ width: '35%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target='_blank' rel='noreferrer'>
                        <Flex alignItems="center">
                          <h2 className={data.isBuy ? 'success' : 'error'}>{date.toString().split('GMT')[0]}</h2>
                        </Flex>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target='_blank' rel='noreferrer'>
                        <h2 className={data.isBuy ? 'success' : 'error'}>{Number(data.amount).toFixed(4)}</h2>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target='_blank' rel='noreferrer'>
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
                      <a href={'https://bscscan.com/tx/' + data.tx} target='_blank' rel='noreferrer'>
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
        : <Spinner />}

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
