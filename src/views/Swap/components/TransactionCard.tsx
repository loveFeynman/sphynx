/* eslint-disable */
import axios from 'axios'
import * as ethers from 'ethers'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex } from '@sphynxswap/uikit'
import { getPancakePairAddress, getPancakePairAddressV1 } from 'state/info/ws/priceData'
import Web3 from 'web3'
import ERC20ABI from '../../../assets/abis/erc20.json'
import routerABI from '../../../assets/abis/pancakeRouter.json'
import { simpleRpcProvider } from '../../../utils/providers'
import { Spinner } from '../../LotterySphx/components/Spinner'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import { priceInput, amountInput } from 'state/input/actions'
import { useTranslation } from 'contexts/Localization'
import { UNSET_PRICE, DEFAULT_VOLUME_RATE } from 'config/constants/info'

const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const pancakeV1: any = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F'
const metamaskSwap: any = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31'
const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const sphynxAddr = '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c'
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

let config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

interface TransactionProps {
  tokenAddress?: string
}

const providerURL = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet/archive'
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
const pancakeRouterContract = new web3.eth.Contract(routerAbi, pancakeV2)

const TransactionCard: React.SFC<TransactionProps> = (props) => {
  const dispatch = useDispatch()
  const [transactionData, setTransactions] = useState([])
  const stateRef = useRef([])
  const [isLoading, setLoading] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const { t } = useTranslation()
  const [volumeRate, setVolumeRate] = useState(DEFAULT_VOLUME_RATE)

  let input = props.tokenAddress
  if (input === '-' || input === '') input = sphynxAddr
  const contract: any = new web3.eth.Contract(abi, input)

  // pair infos
  let wBNBPair, wBNBPairV1
  useEffect(() => {
    const getPairAddress = async () => {
      wBNBPair = await getPancakePairAddress(input, wBNBAddr, simpleRpcProvider)
      wBNBPairV1 = await getPancakePairAddressV1(input, wBNBAddr, simpleRpcProvider)
    }
    getPairAddress()
  }, [input])

  stateRef.current = transactionData

  const getDataQuery = useCallback(() => {
    return `
    {
    ethereum(network: bsc) {
        dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
        date: {till: null}
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
  }, [input])

  const getBNBPrice: any = async () => {
    return new Promise(async (resolve) => {
      let path = [wBNBAddr, busdAddr]
      pancakeRouterContract.methods
        .getAmountsOut(web3.utils.toBN(1 * Math.pow(10, tokenDecimal)), path)
        .call()
        .then((data) => resolve(parseFloat(ethers.utils.formatUnits(data[data.length - 1] + '', 18))))
    })
  }

  // const parseData: any = async (myTransactions) => {
  //   setBusy(true)
  //   let newTransactions = stateRef.current
  //   return new Promise(async (resolve) => {
  //     const price = await getBNBPrice()
  //     console.log("price", price);
  //     for (let i = 0; i <= myTransactions.length; i++) {
  //       if (i === myTransactions.length) {
  //         setTransactions(newTransactions)
  //         setBusy(false)
  //         resolve(true)
  //       } else {
  //         try {
  //           const event = myTransactions[i]
  //           if (event.returnValues.from === zeroAddr || event.returnValues.to === zeroAddr) continue
  //           if (event.returnValues.to === input) continue

  //           if (
  //             wBNBPair.toLocaleLowerCase() !== event.returnValues.from.toLowerCase() &&
  //             wBNBPair.toLocaleLowerCase() !== event.returnValues.to.toLowerCase()
  //           )
  //             continue
  //           let oneData: any = {}
  //           oneData.amount = parseFloat(ethers.utils.formatUnits(event.returnValues.value + '', tokenDecimal))
  //           oneData.price = parseFloat(ethers.utils.formatUnits(price[price.length - 1] + '', 18))
  //           oneData.transactionTime = formatTimeString(
  //             `${new Date().getUTCFullYear()}-${
  //               new Date().getUTCMonth() + 1
  //             }-${new Date().getDate()} ${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}`,
  //           )
  //           oneData.tx = event.transactionHash
  //           oneData.isBuy = wBNBPair.toLocaleLowerCase() === event.returnValues.to.toLowerCase()
  //           oneData.usdValue = oneData.amount * oneData.price
  //           newTransactions.unshift(oneData)
  //           if (newTransactions.length > 1000) {
  //             newTransactions.pop()
  //           }
  //           dispatch(priceInput({ price: oneData.price }))
  //           dispatch(amountInput({ amount: oneData.usdValue / volumeRate }))
  //         } catch (err) {
  //           console.log('error', err)
  //         }
  //       }
  //     }
  //   })
  // }

  const parseData: any = async (events) => {
    setBusy(true)
    let newTransactions = stateRef.current
    return new Promise(async (resolve) => {
      const price = await getBNBPrice()
      for (let i = 0; i <= events.length; i++) {
        if (i === events.length) {
          setTransactions(newTransactions)
          setBusy(false)
          resolve(true)
        } else {
          try {
            const event = events[i]
            const datas = web3.eth.abi.decodeParameters(
              [
                { type: 'uint256', name: 'amount0In' },
                { type: 'uint256', name: 'amount1In' },
                { type: 'uint256', name: 'amount0Out' },
                { type: 'uint256', name: 'amount1Out' },
              ],
              event.data,
            )

            let tokenAmt, BNBAmt, isBuy;

            if (input < wBNBAddr) {
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', tokenDecimal)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', tokenDecimal)),
              )

              isBuy = datas.amount1In === "0";
              BNBAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', 18)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', 18)),
              )
            } else {
              BNBAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', tokenDecimal)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', tokenDecimal)),
              )
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', 18)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', 18)),
              )
              isBuy = datas.amount0In === "0";
            }

            let oneData: any = {}
            oneData.amount = tokenAmt
            oneData.price = BNBAmt / tokenAmt * price;
            oneData.transactionTime = formatTimeString(
              `${new Date().getUTCFullYear()}-${
                new Date().getUTCMonth() + 1
              }-${new Date().getDate()} ${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}`,
            )
            oneData.tx = event.transactionHash
            oneData.isBuy = isBuy;
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
            if (newTransactions.length > 1000) {
              newTransactions.pop()
            }
            dispatch(priceInput({ price: oneData.price }))
            dispatch(amountInput({ amount: oneData.usdValue / volumeRate }))
          } catch (err) {
            console.log('error', err)
          }
        }
      }
    })
  }

  const startRealTimeData = useCallback(() => {
    web3.eth.getBlockNumber().then((blockNumber) => {
      const getTransactions = async (blockNumber) => {
        let cachedBlockNumber = blockNumber
        web3.eth
          .getPastLogs({
            fromBlock: blockNumber,
            toBlock: 'latest',
            topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'],
          })
          .then(async (info) => {
            const pairs = [wBNBPair?.toLowerCase(), wBNBPairV1?.toLowerCase()];
            if (info.length) {
              cachedBlockNumber = info[info.length - 1].blockNumber
            }
            info = info.filter((oneData) => oneData.blockNumber !== cachedBlockNumber)
            info = info.filter((oneData) => pairs.indexOf(oneData.address.toLowerCase()) !== -1)
            info = [...new Set(info)]

            if (!isBusy) {
              await parseData(info)
              blockNumber = cachedBlockNumber
              setTimeout(() => getTransactions(blockNumber), 3000)
            }
          })
      }

      getTransactions(blockNumber)
    })
  }, [transactionData])

  useEffect(() => {
    dispatch(priceInput({ price: UNSET_PRICE }))
    const fetchDecimals = async () => {
      tokenDecimal = await contract.methods.decimals().call()
    }
    fetchDecimals()

    const ac = new AbortController()
    let newTransactions = []
    const fetchData = async (tokenAddr: string) => {
      try {
        const provider = simpleRpcProvider // simpleRpcProvider
        const bnbPrice = await getBNBPrice(provider)
        setVolumeRate(bnbPrice)
        // pull historical data
        const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery() }, config)
        if (queryResult.data.data && queryResult.data.data.ethereum.dexTrades) {
          newTransactions = queryResult.data.data.ethereum.dexTrades.map((item, index) => {
            return {
              transactionTime: formatTimeString(item.block.timestamp.time),
              amount: item.baseAmount,
              price: item.quotePrice * bnbPrice,
              usdValue: item.baseAmount * item.quotePrice * bnbPrice,
              isBuy: item.baseCurrency.symbol === item.buyCurrency.symbol,
              tx: item.transaction.hash,
            }
          })

          setTransactions(newTransactions)
          setLoading(true)

          setTimeout(() => {
            startRealTimeData()
          }, 2000)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err.message)
      }
    }

    if (input) {
      fetchData(input)
    }

    return () => ac.abort()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTimeString = (timeString) => {
    let dateArray = timeString.split(/[- :\/]/)
    let date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2].slice(0, -1),
      dateArray[3],
      dateArray[4],
      dateArray[5],
    )
    return date.toString().split('GMT')[0]
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toString().split('GMT')[0]
  }

  // eslint-disable-next-line no-console
  return (
    <>
      {isLoading ? (
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <td style={{ width: '30%' }}>{t('Time')}</td>
                <td style={{ width: '24%' }}>{t('Traded Tokens')}</td>
                <td style={{ width: '22%' }}>{t('Token Price')}</td>
                <td style={{ width: '22%' }}>{t('$Value')}</td>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((data, key) => {
                return (
                  <tr key={key}>
                    <td style={{ width: '35%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <Flex alignItems="center">
                          <h2 className={!data.isBuy ? 'success' : 'error'}>{data.transactionTime}</h2>
                        </Flex>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          {Number(data.amount)
                            .toFixed(4)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '1,')}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
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
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
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
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default React.memo(TransactionCard)
