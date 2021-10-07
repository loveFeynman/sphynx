/* eslint-disable */
import axios from 'axios'
import * as ethers from 'ethers'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex } from '@sphynxswap/uikit'
import { getBnbPrice, getPancakePairAddress } from 'state/info/ws/priceData'
import { AppState } from '../../../state'
import { isAddress } from '../../../utils'
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
const zeroAddr = '0x0000000000000000000000000000000000000000'
const routerAddresses = [pancakeV1.toLowerCase(), pancakeV2.toLowerCase(), metamaskSwap.toLowerCase()]
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

const TransactionCard = React.memo(() => {
  const dispatch = useDispatch()
  const providerURL = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet/archive'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
  const [transactionData, setTransactions] = useState([])
  const stateRef = useRef([])
  const [isLoading, setLoading] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const { t } = useTranslation()
  const [volumeRate, setVolumeRate] = useState(DEFAULT_VOLUME_RATE)

  let input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  if (input === '-') input = sphynxAddr
  const contract: any = new web3.eth.Contract(abi, input)
  const tokenAddress = isAddress(input)

  // pair infos
  let busdPair
  let wBNBPair
  const getPairAddress = async () => {
    busdPair = await getPancakePairAddress(input, busdAddr, simpleRpcProvider)
    wBNBPair = await getPancakePairAddress(input, wBNBAddr, simpleRpcProvider)
  }

  stateRef.current = transactionData

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
      if (busdPair === null) {
        path = [input, wBNBAddr, busdAddr]
      }
      pancakeRouterContract.methods
        .getAmountsOut(web3.utils.toBN(1 * Math.pow(10, tokenDecimal)), path)
        .call()
        .then((data) => resolve(data))
    })
  }

  const parseData: any = async (myTransactions) => {
    setBusy(true)
    let newTransactions = stateRef.current
    return new Promise(async (resolve) => {
      const price = await getPrice()
      for (let i = 0; i <= myTransactions.length; i++) {
        if (i === myTransactions.length) {
          setTransactions(newTransactions)
          setBusy(false)
          resolve(true)
        } else {
          try {
            const event = myTransactions[i]
            if (event.returnValues.from === zeroAddr || event.returnValues.to === zeroAddr) continue
            if (event.returnValues.to === input) continue

            if (
              wBNBPair.toLocaleLowerCase() !== event.returnValues.from.toLowerCase() &&
              wBNBPair.toLocaleLowerCase() !== event.returnValues.to.toLowerCase()
            )
              continue
            let oneData: any = {}
            oneData.amount = parseFloat(ethers.utils.formatUnits(event.returnValues.value + '', tokenDecimal))
            oneData.price = parseFloat(ethers.utils.formatUnits(price[price.length - 1] + '', tokenDecimal))
            oneData.transactionTime = formatTimestamp(new Date().getTime())
            oneData.tx = event.transactionHash
            oneData.isBuy = wBNBPair.toLocaleLowerCase() === event.returnValues.to.toLowerCase()
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
            if (newTransactions.length > 100) {
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
        let myTransactions = []
        contract
          .getPastEvents('Transfer', { fromBlock: blockNumber, toBlock: 'latest' }, (error, events) => {})
          .then(async (events) => {
            myTransactions = events

            if (!isBusy) {
              await parseData(myTransactions)
              blockNumber = cachedBlockNumber
              setTimeout(() => getTransactions(blockNumber), 10000)
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
    getPairAddress()

    let newTransactions = []
    const fetchData = async (tokenAddr: string) => {
      try {
        const provider = simpleRpcProvider // simpleRpcProvider
        const bnbPrice = await getBnbPrice(provider)
        setVolumeRate(bnbPrice)
        // pull historical data
        const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery }, config)
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

    if (tokenAddress) {
      fetchData(tokenAddress)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTimeString = (timeString) => {
    let dateArray = timeString.split(/[- :\/]/)
    let date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5])
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
})

export default TransactionCard
