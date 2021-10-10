/* eslint-disable */
import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { autoSwap } from 'state/flags/actions'
import styled from 'styled-components'
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

import { useSetRouterType, useSwapTransCard, useSwapType } from 'state/application/hooks'
import { ReactComponent as DownArrow } from 'assets/svg/icon/DownArrow.svg'
import { typeInput } from 'state/input/actions'
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
import { Field, replaceSwapState } from '../../state/swap/actions'

import Web3 from 'web3'
import ERC20ABI from 'assets/abis/erc20.json'
import routerABI from 'assets/abis/pancakeRouter.json'
import { getPancakePairAddress, getPancakePairAddressV1 } from 'state/info/ws/priceData'
import * as ethers from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { priceInput, amountInput } from 'state/input/actions'
import { UNSET_PRICE, DEFAULT_VOLUME_RATE } from 'config/constants/info'
import storages from 'config/constants/storages'
const pancakeV2: any = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const pancakeV1: any = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F'
const metamaskSwap: any = '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31'
const busdAddr = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const wBNBAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const sphynxAddr = '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c'
let tokenDecimal = 18

const abi: any = ERC20ABI
const routerAbi: any = routerABI

let config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

const providerURL = 'https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet/archive'
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
const pancakeRouterContract = new web3.eth.Contract(routerAbi, pancakeV2)

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

const getBNBPrice: any = async () => {
  return new Promise(async (resolve) => {
    let path = [wBNBAddr, busdAddr]
    pancakeRouterContract.methods
      .getAmountsOut(web3.utils.toBN(1 * Math.pow(10, tokenDecimal)), path)
      .call()
      .then((data) => resolve(parseFloat(ethers.utils.formatUnits(data[data.length - 1] + '', 18))))
  })
}

export default function Swap({ history }: RouteComponentProps) {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const tokenAddress = pathname.substr(6)
  const [swapRouter, setSwapRouter] = useState(SwapRouter.AUTO_SWAP)
  const [pairs, setPairs] = useState([])
  const [transactionData, setTransactions] = useState([])
  const stateRef = useRef([])
  const pairsRef = useRef([])
  const [isLoading, setLoading] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const swapFlag = useSelector<AppState, AppState['autoSwapReducer']>((state) => state.autoSwapReducer.swapFlag)
  const inputTokenName = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

  stateRef.current = transactionData
  pairsRef.current = pairs
  let input = tokenAddress
  if (input === '-' || input === '') input = sphynxAddr
  const contract: any = new web3.eth.Contract(abi, input)

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

  React.useEffect(() => {
    const ab = new AbortController()
    const getPairs = async () => {
      let pairs = []
      let wBNBPair = await getPancakePairAddress(input, wBNBAddr, simpleRpcProvider)
      if (wBNBPair !== null) pairs.push(wBNBPair.toLowerCase())
      let wBNBPairV1 = await getPancakePairAddressV1(input, wBNBAddr, simpleRpcProvider)
      if (wBNBPairV1 !== null) pairs.push(wBNBPairV1.toLowerCase())
      setPairs(pairs)
    }
    getPairs()
    return () => {
      ab.abort()
    }
  }, [tokenAddress])

  const parseData: any = async (events, blockNumber) => {
    setBusy(true)
    let newTransactions = stateRef.current
    return new Promise(async (resolve) => {
      const price = await getBNBPrice()
      let curPrice = UNSET_PRICE;
      let curAmount = 0;

      for (let i = 0; i <= events.length; i++) {
        if (i === events.length) {
          if(events.length > 0 && curPrice !== UNSET_PRICE){
            let sessionData = {
              "input": inputTokenName,
              "price": curPrice,
              "amount": curAmount,
              "timestamp": new Date().getTime(),
            }
            sessionStorage.setItem(storages.SESSION_LIVE_PRICE, JSON.stringify(sessionData))
          }
          
          setTransactions(newTransactions)
          setBusy(false)
          setTimeout(() => getTransactions(blockNumber), 3000);
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
                parseFloat(ethers.utils.formatUnits(datas.amount0In + '', tokenDecimal)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount0Out + '', tokenDecimal)),
              )
              tokenAmt = Math.abs(
                parseFloat(ethers.utils.formatUnits(datas.amount1In + '', 18)) -
                  parseFloat(ethers.utils.formatUnits(datas.amount1Out + '', 18)),
              )
              isBuy = datas.amount0In === '0'
            }

            let oneData: any = {}
            oneData.amount = tokenAmt
            oneData.price = (BNBAmt / tokenAmt) * price
            oneData.transactionTime = formatTimeString(
              `${new Date().getUTCFullYear()}-${
                new Date().getUTCMonth() + 1
              }-${new Date().getDate()} ${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}`,
            )
            oneData.tx = event.transactionHash
            oneData.isBuy = isBuy
            oneData.usdValue = oneData.amount * oneData.price
            newTransactions.unshift(oneData)
            if (newTransactions.length > 1000) {
              newTransactions.pop()
            }
            curPrice = oneData.price
            curAmount += oneData.amount
          } catch (err) {
            console.log('error', err)
          }
        }
      }
    })
  }

  const getTransactions = async (blockNumber) => {
    let cachedBlockNumber = blockNumber
    try{
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
          await parseData(info, cachedBlockNumber)
        }
      })
    } catch (err) {
      console.log("error", err);
      setTimeout(() => getTransactions(blockNumber), 3000)
    }
  }

  const startRealTimeData = () => {
    web3.eth.getBlockNumber().then((blockNumber) => {
      getTransactions(blockNumber)
    });
  }

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

  useEffect(() => {
    const fetchDecimals = async () => {
      tokenDecimal = await contract.methods.decimals().call()
    }
    fetchDecimals()

    const ac = new AbortController()
    let newTransactions = []
    const fetchData = async () => {
      try {
        const provider = simpleRpcProvider // simpleRpcProvider
        const bnbPrice = await getBNBPrice(provider)
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
        setTransactions([])
          setLoading(true)

          setTimeout(() => {
            startRealTimeData()
          }, 2000)
      }
    }

    if (input) {
      fetchData()
    }

    return () => ac.abort()
  }, [tokenAddress])

  React.useEffect(() => {
    const ab = new AbortController()
    if (tokenAddress && tokenAddress !== '') {
      dispatch(typeInput({ input: tokenAddress }))
    }
    return () => {
      ab.abort()
    }
  }, [dispatch, tokenAddress])

  React.useEffect(() => {
    sessionStorage.removeItem(storages.SESSION_LIVE_PRICE)
  }, [inputTokenName])

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

  // check auto router
  const { setRouterType } = useSetRouterType()

  useEffect(() => {
    if (tokenAddress === null || tokenAddress === '' || tokenAddress === undefined) {
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

  useEffect(() => {
    if (swapRouter === SwapRouter.AUTO_SWAP && trade === undefined) {
      setRouterType(RouterType.pancake)
    }
  }, [swapRouter, trade, setRouterType])

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
        if(error.message.includes(messages.SWAP_TRANSACTION_ERROR)) {
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
      <Cards>
        <div>
          <DividendPanel />
          <div style={{ height: 48, marginTop: 16, marginBottom: 25 }}>
            <Flex alignItems="center" justifyContent="center" style={{ marginBottom: 8 }}>
              <SwapCardNav />
            </Flex>
            <Flex alignItems="center" justifyContent="center">
              <AutoCardNav swapRouter={swapRouter} setSwapRouter={setSwapRouter} />
            </Flex>
          </div>
          <Card bgColor="rgba(0, 0, 0, 0.2)" borderRadius="8px" padding="0 10px 20px 10px">
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
          </Card>
          <AdvancedSwapDetailsDropdown trade={trade} />
        </div>
        <div>
          <FullHeightColumn>
            <ContractPanel value="" />
            <CoinStatsBoard />
            <ChartContainer />
          </FullHeightColumn>
        </div>
        <TokenInfoWrapper>
          <TokenInfo />
        </TokenInfoWrapper>
        <div
          style={{
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          {swapTransCard === 'tokenDX' && <TransactionCard transactionData={transactionData} isLoading={isLoading} />}
          {swapTransCard === 'buyers' && <BuyersCard />}
          {swapTransCard === 'sellers' && <SellersCard />}
        </div>
      </Cards>
    </SwapPage>
  )
}
