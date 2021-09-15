/* eslint-disable array-callback-return */
/* eslint-disable no-self-compare */
/* eslint-disable no-console */
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
import { simpleRpcProvider, simpleWebsocketProvider } from '../../../utils/providers'
import { getBep20Contract } from '../../../utils/contractHelpers'

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
  timestamp: number,
  amount: number,
  price: number,
  usdValue: number,
  isBuy: boolean,
  tx: string
}

let blockNumber = 0
let txHashs = []
let pending = []
// eslint-disable-next-line prefer-const
let newTransactions: TransactionProps[]

const TransactionCard = () => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const tokenAddress = isAddress(input)
  const [socketData, setSocketData]: any = useState({})
  const [transactions, setTransactions] = useState<TransactionProps[]>([])
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined)
  const tokenContract = useRef(null)
  const transferCallback = useRef(null)

  const getDataQuery = `
  {
  ethereum(network: bsc) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 100, offset: 0}
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

  const fetchData = async () =>{
    try {
      if (tokenAddress) {
        const provider = simpleRpcProvider
        const bnbPrice = await getBnbPrice(provider)
        const tokenInfo1 = await getMinTokenInfo(tokenAddress, provider)
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
              tx: item.transaction.hash
            }
          })
          setTransactions(newTransactions)
        }

        // pull realtime data
        tokenContract.current = await getBep20Contract(tokenAddress, provider)
        const lpAddress = await getPancakePairAddress(tokenAddress, WBNB.address, provider)

        const checkTrans = async (prevBlockNumber) => {
          const block = await provider.getBlock(prevBlockNumber);
          const cakePrice = await getTokenPrice(tokenAddress, provider)
          // const cakePrice = 0;
          return new Promise((resolve) => {
            for (let i = 0; i < pending.length; i++) {
              const tokenAmount = parseFloat(ethers.utils.formatUnits(pending[i].amount, tokenInfo1.decimals))
              // if buy transaction, from must be lp pair
              if (pending[i].from === lpAddress) {
                // console.log('[buy] ts=', new Date(block.timestamp * 1000).toISOString(), ', amount=', tokenAmount, ', cakePrice=', cakePrice, ', tx=', pending[i].transactionHash);
                const obj = {
                  timestamp: block.timestamp * 1000,
                  amount: tokenAmount,
                  price: cakePrice,
                  usdValue: tokenAmount * cakePrice,
                  isBuy: true,
                  tx: pending[i].transactionHash
                }
                if (newTransactions.length < 30) {
                  newTransactions.unshift(obj);
                } else {
                  newTransactions.pop();
                  newTransactions.unshift(obj);
                }
              }
              // if sell transaction, to must be lp pair
              if (pending[i].to === lpAddress) {
                // console.log('[sell] ts=', new Date(block.timestamp * 1000).toISOString(), ', amount=', tokenAmount, ', cakePrice=', cakePrice, ', tx=', pending[i].transactionHash);
                const obj = {
                  timestamp: block.timestamp * 1000,
                  amount: tokenAmount,
                  price: cakePrice,
                  usdValue: tokenAmount * cakePrice,
                  isBuy: false,
                  tx: pending[i].transactionHash
                }
                if (newTransactions.length < 30) {
                  newTransactions.unshift(obj);
                } else {
                  newTransactions.pop();
                  newTransactions.unshift(obj);
                }
              }
            }
            txHashs = []
            pending = []
            setTransactions(newTransactions)
            resolve(true);
          })
        }

        if (!transferCallback.current) {
          transferCallback.current = async (from, to, amount, event) => {
            if (from === ZERO_ADDRESS || to === ZERO_ADDRESS) {
              return
            }
            if (blockNumber < event.blockNumber && blockNumber !== 0) {
              const prevBlock = blockNumber
              blockNumber = event.blockNumber
              await checkTrans(prevBlock)
              return
            }
            blockNumber = event.blockNumber;
            if (txHashs.indexOf(event.transactionHash)) {
              txHashs.push(event.transactionHash)
              pending.push({
                from,
                to,
                amount,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
              })
            }
          }
        }

        tokenContract.current.on("Transfer", transferCallback.current)
      }
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.log("err", err.message);
    }
  }

  useEffect(()=>{
    fetchData();

    return () => {
      if (tokenContract.current) {
        tokenContract.current.off("Transfer", transferCallback.current)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [input])

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
              const isRecent = (new Date()).getTime() - data.timestamp > 10000
              return (
                <tr>
                  <td style={{ width: '35%' }}>
                    <Flex alignItems="center">
                      <h2 className={data.isBuy ? 'success' : 'error'}>{date.toString().split('GMT')[0]}</h2>
                    </Flex>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.isBuy ? 'success' : 'error'}>{ data.amount }</h2>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.isBuy ? 'success' : 'error'}>
                      $
                      {Number(data.price)
                        .toFixed(4)
                        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </h2>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.isBuy ? 'success' : 'error'}>
                      ${(data.price * data.amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </h2>
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