/* eslint-disable */
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { autoSwap } from 'state/flags/actions'
import styled, { useTheme } from 'styled-components'
import { useLocation } from 'react-router'
import { CurrencyAmount, JSBI, Token, Trade, RouterType } from '@sphynxswap/sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex } from '@sphynxswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { getAddress } from 'utils/addressHelpers'
import SwapCardNav from 'components/SwapCardNav'
import AutoCardNav from 'components/AutoCardNav'
import { FullHeightColumn } from 'components/Column'
import Column, { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AppHeader } from 'components/App'
import { BalanceNumber } from 'components/BalanceNumber'
import { useMatchBreakpoints } from '@sphynxswap/uikit'

import { useSwapTransCard, useSwapType, useSetRouterType } from 'state/application/hooks'
import { ReactComponent as DownArrow } from 'assets/svg/icon/DownArrow.svg'
import { typeInput, marketCap, typeRouterVersion } from 'state/input/actions'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import SwapRouter, { messages } from 'config/constants/swaps'
import AddressInputPanel from './components/AddressInputPanel'
import Card, { GreyCard } from '../../components/Card'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'
import TokenInfo from './components/TokenInfo'
import Cards from './components/Layout'
import CoinStatsBoard from './components/CoinStatsBoard'
import TransactionCard from './components/TransactionCard'
import ContractPanel from './components/ContractPanel'

import LiquidityWidget from '../Pool/LiquidityWidget'
import ChartContainer from './components/Chart'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'

import BuyersCard from './components/BuyersCard'
import SellersCard from './components/SellersCard'
import SwapWarningModal from './components/SwapWarningModal'
import DividendPanel from './components/DividendPanel'
import LiveAmountPanel from './components/LiveAmountPanel'
import { Field, replaceSwapState } from '../../state/swap/actions'

import Web3 from 'web3'
import ERC20ABI from 'assets/abis/erc20.json'
import { getPancakePairAddress, getPancakePairAddressV1, getSphynxPairAddress } from 'state/info/ws/priceData'
import * as ethers from 'ethers'
import { getBNBPrice } from 'utils/priceProvider'
import { simpleRpcProvider } from 'utils/providers'
import { UNSET_PRICE } from 'config/constants/info'
import storages from 'config/constants/storages'
import Row from 'components/Row'
import RewardsPanel from './components/RewardsPanel'
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from "../../components/Tab/tab";

const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const sphynxAddr = '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c'
let tokenDecimal = 18

const abi: any = ERC20ABI

let config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

const providerURL = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet/archive'
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))

const ArrowContainer = styled(ArrowWrapper)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgb(255, 255, 255);
  border-radius: 12px;
  margin: 0;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
  & svg {
    width: 14px;
    height: 16px;
  }
`

const BalanceText = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 12px;
  color: white;
  margin: 0 8px;
  margin-left: auto;
`

const SlippageText = styled.p`
  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  color: white;
  margin: 0 8px;
  & span {
    text-decoration: underline;
  }
`

const BottomGrouping = styled(Box)`
  & button {
    background-color: #8b2a9b !important;
    &:hover {
      opacity: 0.6;
    }
  }
`

const TokenInfoWrapper = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const SwapPage = styled(Page)`
  padding: 0;
`

export default function Swap({ history }: RouteComponentProps) {
  const dispatch = useDispatch()
  const { setRouterType } = useSetRouterType()
  const { pathname } = useLocation()
  const tokenAddress = pathname.substr(6)
  const [swapRouter, setSwapRouter] = useState(SwapRouter.SPHYNX_SWAP)
  const [pairs, setPairs] = useState([])
  const [transactionData, setTransactions] = useState([])
  const stateRef = useRef([])
  const pairsRef = useRef([])
  const loadingRef = useRef(false)
  const busyRef = useRef(false)
  const [isLoading, setLoading] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(null)
  const [blockFlag, setBlockFlag] = useState(false)
  const [tokenData, setTokenData] = useState<any>(null)
  const swapFlag = useSelector<AppState, AppState['autoSwapReducer']>((state) => state.autoSwapReducer.swapFlag)
  const inputTokenName = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const tokens = useSelector<AppState, AppState['tokens']>((state) => state.tokens)
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>(
    (state) => state.inputReducer.connectedNetworkID,
  )
  const [inputBalance, setInputBalance] = useState(0)
  const [outputBalance, setOutputBalance] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [tokenPrice, setTokenPrice] = useState(0)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [symbol, setSymbol] = useState('')
  const theme = useTheme()

  if (tokenAddress === '' || tokenAddress.toLowerCase() === sphynxAddr.toLowerCase()) {
    if (routerVersion !== 'sphynx') {
      dispatch(typeRouterVersion({ routerVersion: 'sphynx' }))
    }
  } else {
    if (routerVersion !== 'v2') {
      dispatch(typeRouterVersion({ routerVersion: 'v2' }))
    }
  }

  stateRef.current = transactionData
  pairsRef.current = pairs
  loadingRef.current = isLoading
  busyRef.current = isBusy
  let input = tokenAddress
  if (input === '-' || input === '') input = sphynxAddr
  const contract: any = new web3.eth.Contract(abi, input)

  const getDataQuery = useCallback(
    (pairAddress: any) => {
      if (pairAddress === '0xc522ce70f8aeb1205223659156d6c398743e3e7a') {
        return `
    {
    ethereum(network: bsc) {
        dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
        date: {till: null}
        smartContractAddress: {in: ["0xE4023ee4d957A5391007aE698B3A730B2dc2ba67", "${pairAddress}"]}
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
      } else {
        return `
    {
    ethereum(network: bsc) {
        dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: 30, offset: 0}
        date: {till: null}
        smartContractAddress: {is: "${pairAddress}"}
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
      }
    },
    [input],
  )

  const parseData: any = async (events: any, blockNumber: any) => {
    setBusy(true)

    let newTransactions = stateRef.current
    return new Promise(async (resolve) => {
      const price = await getBNBPrice()
      let curPrice = UNSET_PRICE
      let curAmount = 0

      for (let i = 0; i <= events.length; i++) {
        if (loadingRef.current === false) {
          setBusy(false)
          setCurrentBlock(blockNumber)
          setBlockFlag(!blockFlag)
          resolve(true)
          break
        }
        if (i === events.length) {
          if (events.length > 0 && curPrice !== UNSET_PRICE) {
            let sessionData = {
              input: inputTokenName,
              price: curPrice,
              amount: curAmount,
              timestamp: new Date().getTime(),
            }
            sessionStorage.setItem(storages.SESSION_LIVE_PRICE, JSON.stringify(sessionData))
          }

          setTimeout(() => {
            setTransactions(newTransactions)
            setBusy(false)
            setCurrentBlock(blockNumber)
            setBlockFlag(!blockFlag)
            resolve(true)
          }, 200)
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

            let tokenAmt, BNBAmt, isBuy

            if (input < wBNBAddr) {
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', tokenDecimal)) -
                parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', tokenDecimal)),
              )

              isBuy = datas.amount1In === '0'
              BNBAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', 18)) -
                parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', 18)),
              )
            } else {
              BNBAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', 18)) -
                parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', 18)),
              )
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', tokenDecimal)) -
                parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', tokenDecimal)),
              )
              isBuy = datas.amount0In === '0'
            }

            let oneData: any = {}
            oneData.amount = tokenAmt
            oneData.value = BNBAmt
            oneData.price = (BNBAmt / tokenAmt) * price
            const estimatedDateValue = new Date(new Date().getTime() - (blockNumber - event.blockNumber) * 3000)
            oneData.transactionTime = formatTimeString(
              `${estimatedDateValue.getUTCFullYear()}-${estimatedDateValue.getUTCMonth() + 1
              }-${estimatedDateValue.getDate()} ${estimatedDateValue.getUTCHours()}:${estimatedDateValue.getUTCMinutes()}:${estimatedDateValue.getUTCSeconds()}`,
            )

            oneData.tx = event.transactionHash
            oneData.isBuy = isBuy
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
            if (newTransactions.length > 300) {
              newTransactions.pop()
            }
            curPrice = oneData.price
            curAmount += oneData.usdValue
            setTokenPrice(curPrice)
          } catch (err) {
            console.log('error', err)
          }
        }
      }
    })
  }

  const getTransactions = async (blockNumber) => {
    let cachedBlockNumber = blockNumber
    try {
      web3.eth
        .getPastLogs({
          fromBlock: blockNumber,
          toBlock: 'latest',
          topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'],
        })
        .then(async (info) => {
          if (info.length) {
            cachedBlockNumber = info[info.length - 1].blockNumber
          }
          info = info.filter((oneData) => oneData.blockNumber !== cachedBlockNumber)
          info = info.filter((oneData) => pairsRef.current.indexOf(oneData.address.toLowerCase()) !== -1)
          info = [...new Set(info)]

          if (!isBusy) {
            parseData(info, cachedBlockNumber)
          }
        })
    } catch (err) {
      console.log('error', err)
      setTimeout(() => getTransactions(blockNumber), 3000)
    }
  }

  const startRealTimeData = (blockNumber) => {
    if (blockNumber === null) {
      web3.eth.getBlockNumber().then((blockNumber) => {
        setCurrentBlock(blockNumber)
        setBlockFlag(!blockFlag)
      })
    } else {
      setCurrentBlock(blockNumber)
      setBlockFlag(!blockFlag)
    }
  }

  React.useEffect(() => {
    const ab = new AbortController()
    if (currentBlock !== null) getTransactions(currentBlock)
    return () => {
      ab.abort()
    }
  }, [blockFlag])

  const formatTimeString = (timeString) => {
    let dateArray = timeString.split(/[- :\/]/)
    let date = new Date(
      `${dateArray[1]}/${dateArray[2]}/${dateArray[0]} ${dateArray[3]}:${dateArray[4]}:${dateArray[5]} UTC`,
    )
    return date.toString().split('GMT')[0]
  }

  const setDatas = (transactions, blockNumber) => {
    if (busyRef.current === false) {
      setTransactions(transactions)
      setLoading(true)
      startRealTimeData(blockNumber + 1)
    } else {
      setTimeout(() => {
        setDatas(transactions, blockNumber)
      }, 1000)
    }
  }

  useEffect(() => {
    const fetchDecimals = async () => {
      tokenDecimal = await contract.methods.decimals().call()
    }
    fetchDecimals()

    setLoading(false)
    const ac = new AbortController()
    let newTransactions = []
    const fetchData = async () => {
      try {
        let pairs = []
        if (routerVersion !== 'sphynx') {
          let wBNBPair = await getPancakePairAddress(input, wBNBAddr, simpleRpcProvider)
          if (wBNBPair !== null) pairs.push(wBNBPair.toLowerCase())
          let wBNBPairV1 = await getPancakePairAddressV1(input, wBNBAddr, simpleRpcProvider)
          if (wBNBPairV1 !== null) pairs.push(wBNBPairV1.toLowerCase())
        }
        let wBNBPairSphynx = await getSphynxPairAddress(input, wBNBAddr, simpleRpcProvider)
        if (wBNBPairSphynx !== null) pairs.push(wBNBPairSphynx.toLowerCase())
        setPairs(pairs)
        const bnbPrice = await getBNBPrice()
        // pull historical data
        const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery(pairs[0]) }, config)
        if (queryResult.data.data && queryResult.data.data.ethereum.dexTrades) {
          setSymbol(queryResult.data.data.ethereum.dexTrades[0].baseCurrency.symbol)
          newTransactions = queryResult.data.data.ethereum.dexTrades.map((item, index) => {
            return {
              transactionTime: formatTimeString(item.block.timestamp.time),
              amount: item.baseAmount,
              value: item.quoteAmount,
              price: item.quotePrice * bnbPrice,
              usdValue: item.baseAmount * item.quotePrice * bnbPrice,
              isBuy: item.baseCurrency.symbol === item.buyCurrency.symbol,
              tx: item.transaction.hash,
            }
          })

          if (newTransactions.length > 0) {
            const curPrice = newTransactions[0].price
            const sessionData = {
              input,
              price: curPrice,
              amount: 0,
              timestamp: new Date().getTime(),
            }
            sessionStorage.setItem(storages.SESSION_LIVE_PRICE, JSON.stringify(sessionData))
            setTokenPrice(curPrice)
          }

          setDatas(newTransactions, queryResult.data.data.ethereum.dexTrades[0].block.height)
        } else {
          web3.eth.getBlockNumber().then((blockNumber) => {
            setDatas([], blockNumber - 200)
          })  
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err', err.message)
        web3.eth.getBlockNumber().then((blockNumber) => {
          setDatas([], blockNumber - 200)
        })
      }
    }

    if (input) {
      setTokenPrice(0)
      fetchData()
    }

    return () => ac.abort()
  }, [tokenAddress, routerVersion])

  React.useEffect(() => {
    const ab = new AbortController()
    if (tokenAddress && tokenAddress !== '') {
      dispatch(typeInput({ input: tokenAddress }))
    }
    return () => {
      ab.abort()
    }
  }, [dispatch, tokenAddress])

  const getTokenData = async (tokenAddress) => {
    try {
      axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/tokenStats`, { address: tokenAddress }).then((response) => {
        setTokenData(response.data)
        dispatch(marketCap({ marketCapacity: parseFloat(response.data.marketCap) }))
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      setTimeout(() => getTokenData(tokenAddress), 3000)
    }
  }

  React.useEffect(() => {
    sessionStorage.removeItem(storages.SESSION_LIVE_PRICE)
    getTokenData(input)
  }, [pairs])

  const loadedUrlParams = useDefaultsFromURLSearch()

  const { t } = useTranslation()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { swapType } = useSwapType()
  const { swapTransCard } = useSwapTransCard()
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  useEffect(() => {
    if (
      tokenAddress === null ||
      tokenAddress === '' ||
      tokenAddress === undefined ||
      tokenAddress.toLowerCase() === sphynxAddr.toLowerCase()
    ) {
      if (swapRouter !== SwapRouter.SPHYNX_SWAP) {
        setSwapRouter(SwapRouter.SPHYNX_SWAP)
        setRouterType(RouterType.sphynx)
      }
      dispatch(
        replaceSwapState({
          outputCurrencyId: 'BNB',
          inputCurrencyId: '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c',
          typedValue: '',
          field: Field.OUTPUT,
          recipient: null,
        }),
      )
    } else {
      if (swapRouter !== SwapRouter.PANCAKE_SWAP) {
        setSwapRouter(SwapRouter.PANCAKE_SWAP)
        setRouterType(RouterType.pancake)
      }
      dispatch(
        replaceSwapState({
          outputCurrencyId: 'BNB',
          inputCurrencyId: tokenAddress,
          typedValue: '',
          field: Field.OUTPUT,
          recipient: null,
        }),
      )
    }
  }, [dispatch, tokenAddress])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        let message = error.message
        if (error.message.includes(messages.SWAP_TRANSACTION_ERROR)) {
          message = messages.SLIPPAGE_ISSUE
        }
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      const warningTokenAddress = getAddress(warningTokenData.address)
      return swapCurrency.address === warningTokenAddress
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  useEffect(() => {
    if (tokenData === null || tokenData.symbol === null) return

    let flag = false
    tokens.forEach((cell) => {
      if (tokenData.symbol.indexOf('(' + cell.symbol + ')') !== -1) {
        setTokenAmount(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setTokenAmount(0)
    }
  }, [tokenData, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.INPUT?.symbol) {
        setInputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setInputBalance(0)
    }
  }, [currencies?.INPUT?.symbol, tokens])

  useEffect(() => {
    let flag = false
    tokens.forEach((cell) => {
      if (cell.symbol === currencies?.OUTPUT?.symbol) {
        setOutputBalance(cell.value)
        flag = true
        return
      }
    })
    if (!flag) {
      setOutputBalance(0)
    }
  }, [currencies?.OUTPUT?.symbol, tokens])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const [timeNow, setTimeNow] = useState(Date.now())
  const countDownDeadline = new Date(Date.UTC(2021, 6, 1, 0, 0, 0, 0)).getTime()

  useEffect(() => {
    let timeout
    if (timeNow < countDownDeadline) {
      timeout = setTimeout(() => {
        setTimeNow(Date.now())
      }, 1000)
    } else {
      clearTimeout(timeout)
      setTimeNow(countDownDeadline)
    }
  }, [timeNow, countDownDeadline])

  useEffect(() => {
    if (swapFlag) {
      handleSwap()
      dispatch(autoSwap({ swapFlag: false }))
    }
  }, [swapFlag, handleSwap, dispatch])
  const handleArrowContainer = useCallback(() => {
    setApprovalSubmitted(false) // reset 2 step UI for approvals
    onSwitchTokens()
  }, [onSwitchTokens])

  const handleChangeRecipient = useCallback(() => {
    onChangeRecipient('')
  }, [onChangeRecipient])

  const handleRemoveRecipient = useCallback(() => {
    onChangeRecipient(null)
  }, [onChangeRecipient])

  const handleSwapState = useCallback(() => {
    if (isExpertMode) {
      handleSwap()
    } else {
      setSwapState({
        tradeToConfirm: trade,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      onPresentConfirmModal()
    }
  }, [handleSwap, isExpertMode, onPresentConfirmModal, trade])

  return (
    <SwapPage>
      <RewardsPanel />
      <Cards>
        <div>
          {!isMobile ? (
            <LiveAmountPanel
              symbol={tokenData && tokenData.symbol ? tokenData.symbol : ''}
              amount={tokenAmount}
              price={tokenPrice}
            />
          ) : null}
          <SwapTabs
            selectedTabClassName='is-selected'
            selectedTabPanelClassName='is-selected'
          >
            <SwapTabList>
              <SwapTab>
                <Text>
                  {t('Swap')}
                </Text>
              </SwapTab>
              <SwapTab>
                <Text>
                  {t('Liquidity')}
                </Text>
              </SwapTab>
            </SwapTabList>
            <Card bgColor={theme.isDark ? "#0E0E26" : "#2A2E60"} borderRadius="0 0 3px 3px" padding="20px 10px">
              <SwapTabPanel>
                <Wrapper id="swap-page">
                  <Flex alignItems="center" justifyContent="center">
                    <AutoCardNav
                      swapRouter={swapRouter}
                      setSwapRouter={setSwapRouter}
                      connectedNetworkID={connectedNetworkID}
                    />
                  </Flex>
                  <AppHeader title={t('Swap')} showAuto />
                  <AutoColumn gap="md">
                    <CurrencyInputPanel
                      label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />
                    <AutoColumn justify="space-between">
                      <BalanceText>
                        <BalanceNumber prefix="" value={Number(inputBalance).toFixed(2)} />
                      </BalanceText>
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <ArrowContainer
                          clickable
                          onClick={handleArrowContainer}
                          color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                        >
                          <DownArrow />
                        </ArrowContainer>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <Button variant="text" id="add-recipient-button" onClick={handleChangeRecipient}>
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                    />
                    <BalanceText>
                      <BalanceNumber prefix="" value={Number(outputBalance).toFixed(2)} />
                    </BalanceText>
                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDownIcon width="16px" />
                          </ArrowWrapper>
                          <Button variant="text" id="remove-recipient-button" onClick={handleRemoveRecipient}>
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}
                    <Flex justifyContent="space-between" alignItems="center" marginTop="20px">
                      <Flex alignItems="center">
                        <SlippageText>
                          <span>{t('Slippage Tolerance')}</span>
                          <b>: {allowedSlippage / 100}%</b>
                        </SlippageText>
                      </Flex>
                      {currencies[Field.INPUT] && currencies[Field.OUTPUT] && (
                        <Flex alignItems="center">
                          <SlippageText>
                            <b>
                              1 {currencies[Field.INPUT]?.symbol} = {trade?.executionPrice.toSignificant(6)}{' '}
                              {currencies[Field.OUTPUT]?.symbol}
                            </b>
                          </SlippageText>
                        </Flex>
                      )}
                    </Flex>
                  </AutoColumn>
                  <BottomGrouping mt="1rem">
                    {swapIsUnsupported ? (
                      <Button width="100%" disabled mb="4px">
                        {t('Unsupported Asset')}
                      </Button>
                    ) : !account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showWrap ? (
                      <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </Button>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center' }}>
                        <Text color="textSubtle" mb="4px">
                          {t('Insufficient liquidity for this trade.')}
                        </Text>
                        {singleHopOnly && (
                          <Text color="textSubtle" mb="4px">
                            {t('Try enabling multi-hop trades.')}
                          </Text>
                        )}
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </Button>
                        <Button
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={handleSwapState}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                          }
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={handleSwapState}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? `Price Impact Too High`
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap'))}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </BottomGrouping>
                </Wrapper>
              </SwapTabPanel>
              <SwapTabPanel>
                <Wrapper id="pool-page">
                  <LiquidityWidget />
                </Wrapper>
              </SwapTabPanel>
            </Card>
          </SwapTabs>
          {/* <div style={{ height: 48, marginTop: 16, marginBottom: 25 }}>
            <Flex alignItems="center" justifyContent="center" style={{ marginBottom: 8 }}>
              <SwapCardNav />
            </Flex>
            <Flex alignItems="center" justifyContent="center">
              <AutoCardNav
                swapRouter={swapRouter}
                setSwapRouter={setSwapRouter}
                connectedNetworkID={connectedNetworkID}
              />
            </Flex>
          </div> */}
          {/* <Card bgColor={theme.isDark ? "#0E0E26" : "#2A2E60"} borderRadius="8px" padding="0 10px 20px 10px">
            {swapType === 'swap' && (
              <Wrapper id="swap-page">
                <AppHeader title={t('Swap')} showAuto />
                <AutoColumn gap="md">
                  <CurrencyInputPanel
                    label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
                    value={formattedAmounts[Field.INPUT]}
                    showMaxButton={!atMaxAmountInput}
                    currency={currencies[Field.INPUT]}
                    onUserInput={handleTypeInput}
                    onMax={handleMaxInput}
                    onCurrencySelect={handleInputSelect}
                    otherCurrency={currencies[Field.OUTPUT]}
                    id="swap-currency-input"
                  />
                  <AutoColumn justify="space-between">
                    <BalanceText>
                      <BalanceNumber prefix="" value={Number(inputBalance).toFixed(2)} />
                    </BalanceText>
                    <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                      <ArrowContainer
                        clickable
                        onClick={handleArrowContainer}
                        color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                      >
                        <DownArrow />
                      </ArrowContainer>
                      {recipient === null && !showWrap && isExpertMode ? (
                        <Button variant="text" id="add-recipient-button" onClick={handleChangeRecipient}>
                          {t('+ Add a send (optional)')}
                        </Button>
                      ) : null}
                    </AutoRow>
                  </AutoColumn>
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.OUTPUT]}
                    onUserInput={handleTypeOutput}
                    label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                    showMaxButton={false}
                    currency={currencies[Field.OUTPUT]}
                    onCurrencySelect={handleOutputSelect}
                    otherCurrency={currencies[Field.INPUT]}
                    id="swap-currency-output"
                  />
                  <BalanceText>
                    <BalanceNumber prefix="" value={Number(outputBalance).toFixed(2)} />
                  </BalanceText>
                  {isExpertMode && recipient !== null && !showWrap ? (
                    <>
                      <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                        <ArrowWrapper clickable={false}>
                          <ArrowDownIcon width="16px" />
                        </ArrowWrapper>
                        <Button variant="text" id="remove-recipient-button" onClick={handleRemoveRecipient}>
                          {t('- Remove send')}
                        </Button>
                      </AutoRow>
                      <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                    </>
                  ) : null}
                  <Flex justifyContent="space-between" alignItems="center" marginTop="20px">
                    <Flex alignItems="center">
                      <SlippageText>
                        <span>{t('Slippage Tolerance')}</span>
                        <b>: {allowedSlippage / 100}%</b>
                      </SlippageText>
                    </Flex>
                    {currencies[Field.INPUT] && currencies[Field.OUTPUT] && (
                      <Flex alignItems="center">
                        <SlippageText>
                          <b>
                            1 {currencies[Field.INPUT]?.symbol} = {trade?.executionPrice.toSignificant(6)}{' '}
                            {currencies[Field.OUTPUT]?.symbol}
                          </b>
                        </SlippageText>
                      </Flex>
                    )}
                  </Flex>
                </AutoColumn>
                <BottomGrouping mt="1rem">
                  {swapIsUnsupported ? (
                    <Button width="100%" disabled mb="4px">
                      {t('Unsupported Asset')}
                    </Button>
                  ) : !account ? (
                    <ConnectWalletButton width="100%" />
                  ) : showWrap ? (
                    <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                      {wrapInputError ??
                        (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                    </Button>
                  ) : noRoute && userHasSpecifiedInputOutput ? (
                    <GreyCard style={{ textAlign: 'center' }}>
                      <Text color="textSubtle" mb="4px">
                        {t('Insufficient liquidity for this trade.')}
                      </Text>
                      {singleHopOnly && (
                        <Text color="textSubtle" mb="4px">
                          {t('Try enabling multi-hop trades.')}
                        </Text>
                      )}
                    </GreyCard>
                  ) : showApproveFlow ? (
                    <RowBetween>
                      <Button
                        variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                        onClick={approveCallback}
                        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                        width="48%"
                      >
                        {approval === ApprovalState.PENDING ? (
                          <AutoRow gap="6px" justify="center">
                            {t('Enabling')} <CircleLoader stroke="white" />
                          </AutoRow>
                        ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                          t('Enabled')
                        ) : (
                          t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                        )}
                      </Button>
                      <Button
                        variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                        onClick={handleSwapState}
                        width="48%"
                        id="swap-button"
                        disabled={
                          !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                        }
                      >
                        {priceImpactSeverity > 3 && !isExpertMode
                          ? t('Price Impact High')
                          : priceImpactSeverity > 2
                            ? t('Swap Anyway')
                            : t('Swap')}
                      </Button>
                    </RowBetween>
                  ) : (
                    <Button
                      variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                      onClick={handleSwapState}
                      id="swap-button"
                      width="100%"
                      disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                    >
                      {swapInputError ||
                        (priceImpactSeverity > 3 && !isExpertMode
                          ? `Price Impact Too High`
                          : priceImpactSeverity > 2
                            ? t('Swap Anyway')
                            : t('Swap'))}
                    </Button>
                  )}
                  {showApproveFlow && (
                    <Column style={{ marginTop: '1rem' }}>
                      <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                    </Column>
                  )}
                  {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                </BottomGrouping>
              </Wrapper>
            )}
            {(swapType === 'liquidity' || swapType === 'addLiquidity' || swapType === 'removeLiquidity') && (
              <Wrapper id="pool-page">
                <LiquidityWidget />
              </Wrapper>
            )}
          </Card> */}
          <AdvancedSwapDetailsDropdown trade={trade} />
          <TokenInfoWrapper>
            <TokenInfo tokenData={tokenData} tokenAddress={input} />
          </TokenInfoWrapper>
        </div>
        <div>
          <FullHeightColumn>
            <ContractPanel
              value=""
              symbol={tokenData && tokenData.symbol ? tokenData.symbol : ''}
              amount={tokenAmount}
              price={tokenPrice}
            />
            <CoinStatsBoard tokenData={tokenData} />
            <ChartContainer tokenAddress={input} tokenData={tokenData}/>
            <SwapTabs
              selectedTabClassName='is-selected'
              selectedTabPanelClassName='is-selected'
            >
              <SwapTabList>
                <SwapTab>
                  <Text>
                    {t('tokenDX')}
                  </Text>
                </SwapTab>
                <SwapTab>
                  <Text>
                    {t('buyers')}
                  </Text>
                </SwapTab>
                <SwapTab>
                  <Text>
                    {t('sellers')}
                  </Text>
                </SwapTab>
              </SwapTabList>
              <Card bgColor={theme.isDark ? "#0E0E26" : "#2A2E60"} borderRadius="0 0 3px 3px" padding="20px 10px">
                <SwapTabPanel>
                  <TransactionCard transactionData={transactionData} isLoading={isLoading} symbol={symbol} />
                </SwapTabPanel>
                <SwapTabPanel>
                  <BuyersCard pairAddress={pairs[0]} />
                </SwapTabPanel>
                <SwapTabPanel>
                  <SellersCard pairAddress={pairs[0]} />
                </SwapTabPanel>
              </Card>
            </SwapTabs>
            {/* <div
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                width: '100%',
                marginTop: '25px',
              }}
            >
              {swapTransCard === 'tokenDX' && (
                <TransactionCard transactionData={transactionData} isLoading={isLoading} symbol={symbol} />
              )}
              {swapTransCard === 'buyers' && <BuyersCard pairAddress={pairs[0]} />}
              {swapTransCard === 'sellers' && <SellersCard pairAddress={pairs[0]} />}
            </div> */}
          </FullHeightColumn>
        </div>
      </Cards>
    </SwapPage>
  )
}
