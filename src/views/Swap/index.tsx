import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@pancakeswap/sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex } from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { RouteComponentProps } from 'react-router-dom'
import { Rnd } from 'react-rnd';
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

import { useSwapType } from 'state/application/hooks'
import { ReactComponent as DownArrow } from 'assets/svg/icon/DownArrow.svg'
import { ReactComponent as HelpIcon } from 'assets/svg/icon/HelpIcon.svg'
import { ReactComponent as HelpIcon1 } from 'assets/svg/icon/HelpIcon1.svg'
import BinanceLogo from 'assets/images/binance-logo.png'
// import SwapBanner from 'assets/images/DogeBanner1.png'
import FarmBanner from 'assets/images/farmbanner.png'
import StakingBanner from 'assets/images/stakebanner.png'

import moment from 'moment';
// import axios from 'axios';

import AddressInputPanel from './components/AddressInputPanel'
import Card, { GreyCard } from '../../components/Card'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
// import TradePrice from './components/TradePrice'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'
import TokenInfo from './components/TokenInfo'
import Cards from './components/Layout'
import CoinStatsBoard from './components/CoinStatsBoard'
import TransactionCard from './components/TransactionCard'
import ContractPanel from './components/ContractPanel'

import LiquidityWidget from '../Pool/LiquidityWidget'
import {TVChartContainer} from './TVChartContainer'

// import { INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
// import useRouterType, { RouterType } from '../../hooks/useRouterType'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'

import { HotTokenType, TokenDetailProps } from './components/types'


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

// const ArrowContent = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: -4px 0;
//   z-index: 3;
//   position: relative;
// `

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

// const InfoCard = styled.div`
//   padding: 32px;
//   border-radius: 24px;
//   color: white;
//   background: rgba(0, 0, 0, 0.4);
//   margin-bottom: 24px;
//   & h1 {
//     font-size: 32px;
//     line-height: 38px;
//     font-weight: bold;
//   }
//   & h2 {
//     font-size: 28px;
//     line-height: 32px;
//     font-weight: bold;
//   }
//   & p {
//     font-size: 16px;
//     line-height: 19px;
//     font-weight: 300;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     & h1 {
//       font-size: 36px;
//       line-height: 42px;
//     }
//     & h2 {
//       font-size: 32px;
//       line-height: 37px;
//     }
//     & p {
//       font-size: 18px;
//       line-height: 21px;
//     }  
//   }
// `

// const InfoCardWrapper = styled.div`
//   ${({ theme }) => theme.mediaQueries.md} {
//     display: flex;
//     margin-top: 20px;
//     & > div {
//       flex: 1;
//       &:first-child {
//         margin-right: 10px;
//       }
//       &:last-child {
//         margin-left: 10px;
//       }
//     }
//   }
// `

// const CountDownContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   max-width: 600px;
//   width: 100%;
//   margin: 16px auto;
// `

// const CountDownItem = styled.div`
//   color: white;
//   text-align: center;
//   margin: 12px;
//   & > div {
//     width: 94px;
//     height: 94px;
//     background:#8b2a9b ;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 36px;
//     font-weight: bold;
//     border-radius: 24px;
//   }
//   & > p {
//     font-size: 16px;
//     font-weight: bold;
//     margin-top: 4px;
//   }
// `

const PoolWrapper = styled.div`
  position: relative;
  padding: 1rem;

  & > div {
    background: transparent;
    & div {
      background: transparent;
    }
    & div {
      color: white;
    }
  }
`

const SwapRightBanner = styled.div`
  position: absolute;
  max-width: 350px;
  right: 0;
  top: 10px;
  opacity: 0.6;
  z-index: -1;
  & img {
    width: 100%;
  }
`

const BottomCard = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #000;
  height: 420px;
  filter: drop-shadow(0 2px 12px rgba(37, 51, 66, 0.15));
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-bottom: -60px !important;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px !important;
  }
  & div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: transparent; // rgba(0, 0, 0, 0.4);
    z-index: 1;
    border: 1px solid rgba(0,0,0,0.4);
    border-radius: 12px;
  }
  & h1, & button {
    position: absolute;
    z-index: 2;
  }
  & h1 {
    top: 0;
    width: 100%;
    color: white;
    font-size: 24px;
    font-weight: 600;
    line-height: 68px;
    text-align: center;
    border-bottom: 1px solid #C4C4C4;
  }
  & button {
    bottom: 40px;
    left: 5%;
    width: 90%;
    background: #8B2A9B;
    outline: none;
    box-shadow: none;
    border: none;
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

const ChartContainer = styled.div<{height: string}> `
  position: relative;
  height: ${(props) => props.height};
  .react-draggable {
    transform: translate(0, 0) !important;
  }
`

export default function Swap({ history }: RouteComponentProps) {
  const [address, setaddress] = useState('');
  function handleChange(value) {
    setaddress(value);
  }

  // const getapi=()=>{
  //   axios.get('http://192.168.18.65:8080/v1.0/dogeson/historical?dexId=0x3b9dd0ac3fa49988a177b7c020f680295fb21996&span=month').then((response)=>{
  //     console.log("getapi",response);
      
  //   })
  //   .catch((error) => { console.log("Error", error); })
  // }

  // useEffect(()=>{
  //   getapi();
  // },[])

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
  const { swapType } = useSwapType();
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
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm])

  // errors
  // const [showInverted, setShowInverted] = useState<boolean>(false)

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

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

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

  const [currentToken, setCurrentToken] = useState<TokenDetailProps | null>(null)
  const [hotTokens, setHotTokens] = useState<HotTokenType[] | null>(null)
  const [timeNow, setTimeNow] = useState(Date.now())
  const countDownDeadline = new Date(Date.UTC(2021, 6, 1, 0, 0, 0, 0)).getTime();

  const [ chartHeight, setChartHeight ] = useState('550px');

  useEffect(() => {
    let timeout;
    if (timeNow < countDownDeadline) {
      timeout = setTimeout(() => {
        setTimeNow(Date.now());
      }, 1000)
    } else {
      clearTimeout(timeout);
      setTimeNow(countDownDeadline);
    }
  }, [timeNow, countDownDeadline])
  // const [historicalData, setHistoricalData = useState<HistoricalDataProps[] | null>(null)

  const countSeconds = useMemo(() => moment(countDownDeadline).diff(moment(timeNow), 'seconds')
  , [timeNow, countDownDeadline])

  // useEffect(() => {
  //   const init = async () => {
  //     // const tokens = await getHotTokens()
  //     // setHotTokens(tokens.data.tokens)
  //     const hotTokendata = [
  //       {
  //         name: 'Cumino',
  //         symbol: 'Cumino',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       },
  //       {
  //         name: 'UFO',
  //         symbol: 'UFO',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //         direction: 'up'
  //       },
  //       {
  //         name: 'Astra',
  //         symbol: 'Astra',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //         direction: 'up'
  //       },
  //       {
  //         name: 'Starl',
  //         symbol: 'Starl',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       },
  //       {
  //         name: 'Floki',
  //         symbol: 'Floki',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //         direction: 'down'
  //       },
  //       {
  //         name: 'Dext',
  //         symbol: 'Dext',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       },
  //       {
  //         name: 'Dext',
  //         symbol: 'Dext',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //         direction: 'up'
  //       },
  //       {
  //         name: 'F9',
  //         symbol: 'F9',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //         direction: 'down'
  //       },
  //       {
  //         name: 'BTC',
  //         symbol: 'BTC',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       },
  //       {
  //         name: 'THUN',
  //         symbol: 'THUN',
  //         dexId: '117bccac249c0c5fcde923a80ac0af53',
  //         contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       }
  //     ]
  //     setHotTokens(hotTokendata)
      
  //     const currentTokenInfo = {
  //       iconSmall: BinanceLogo,
  //       iconLarge: BinanceLogo,
  //       iconThumb: BinanceLogo,
  //       name: 'BNB',
  //       symbol: 'BNB',
  //       contractAddress: '0xfec01d8cefc67ed90d8fcad445ef04603ad546d2',
  //       website: '',
  //       price: 0.984754,
  //       priceChange24H: 2.5,
  //       volumne24H: 177938,
  //       liquidity: 5359493,
  //       marketCap: 13377791,
  //       totalSupply: 0,
  //       bnbLPHoldings: 0,
  //       bnbLPHoldingsUSD: 0,
  //       transactions: 0,
  //       holders: 0
  //     }
  //     setCurrentToken(currentTokenInfo);
  //     // TODO, Get first token info
  //     // const tokenInfo = await getTokenInfo(tokens.data.tokens[3].dexId)
  //     // setCurrentToken(tokenInfo.data.token ?? null)

  //     // const historical = await getHistoricalData(tokenInfo.geckoId, 200)
  //     // setHistoricalData(historical.data.bars ?? null)
  //   }
  //   init()
  // }, [])

  return (
    <Page>
      {/* <SwapRightBanner>
        <img src={SwapBanner} alt='Swap Banner' />
      </SwapRightBanner> */}
      <Cards>
        <div>
          <div style={{ height: 48, marginTop: 60, marginBottom: 25 }}>
            <Flex alignItems='center' justifyContent='center' style={{ marginBottom: 8 }}>
              <SwapCardNav />
            </Flex>
            <Flex alignItems='center' justifyContent='center'>
              <AutoCardNav />
            </Flex>
          </div>
          <Card bgColor='rgba(0, 0, 0, 0.2)' borderRadius='8px' padding='0 10px 20px 10px'>
            { swapType === 'swap' &&
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
                      <ArrowContainer clickable
                        onClick={() => {
                          setApprovalSubmitted(false) // reset 2 step UI for approvals
                          onSwitchTokens()
                        }}
                        color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                      >
                        <DownArrow />
                      </ArrowContainer>
                      {recipient === null && !showWrap && isExpertMode ? (
                        <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
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
                        <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                          {t('- Remove send')}
                        </Button>
                      </AutoRow>
                      <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                    </>
                  ) : null}
      
                  {/* {showWrap ? null : (
                    <AutoColumn gap="8px" style={{ padding: '0 16px' }}>
                      {Boolean(trade) && (
                        <RowBetween align="center">
                          <Label>{t('Price')}</Label>
                          <TradePrice
                            price={trade?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                          />
                        </RowBetween>
                      )}
                      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                        <RowBetween align="center">
                          <Label>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary">
                            {allowedSlippage / 100}%
                          </Text>
                        </RowBetween>
                      )}
                    </AutoColumn>
                  )} */}

                  <Flex justifyContent='space-between' alignItems='center' marginTop='20px'>
                    <Flex alignItems='center'>
                      <SlippageText><span>Slippage Tolerance</span><b>: {allowedSlippage / 100}%</b></SlippageText>
                    </Flex>
                    {currencies[Field.INPUT] && currencies[Field.OUTPUT] &&
                      <Flex alignItems='center'>
                        <SlippageText><b>1 {currencies[Field.INPUT]?.symbol} = { trade?.executionPrice.toSignificant(6) } {currencies[Field.OUTPUT]?.symbol}</b></SlippageText>
                      </Flex>                
                    }
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
                        onClick={() => {
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
                        }}
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
                      onClick={() => {
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
                      }}
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
            }
            {
              (swapType === 'liquidity' || swapType === 'addLiquidity' || swapType === 'removeLiquidity') &&
              <Wrapper id="pool-page">
                <LiquidityWidget />
              </Wrapper>
            }
          </Card>
          <AdvancedSwapDetailsDropdown trade={trade} />
        </div>
        <div>
          <FullHeightColumn>
            <ContractPanel value={handleChange} />
             {/* tokenInfo={currentToken} */}
            <CoinStatsBoard />
            <ChartContainer height={chartHeight}>
              <Rnd
                size={{ width: '100%', height: chartHeight }}
                onResize={(e, direction, ref, delta, position) => {
                  setChartHeight(ref.style.height)
                }}
                minHeight='550px'
              >
                <TVChartContainer/>
              </Rnd>
            </ChartContainer>
          </FullHeightColumn>
        </div>
        <div>
          <TokenInfo />
        </div>
        <div>
          <TransactionCard />
        </div>
        <BottomCard style={{ backgroundImage: `url(${FarmBanner})` }}>
          <h1>Farms</h1>
          <div />
          <a href='https://farm.sphynxswap.finance/farms' target='_blank' rel='noreferrer'><Button>Start Farming</Button></a>
        </BottomCard>
        <BottomCard style={{ backgroundImage: `url(${StakingBanner})` }}>
          <h1>Staking</h1>
          <div />
          <a href='https://farm.sphynxswap.finance/pools' target='_blank' rel='noreferrer'><Button>Start Staking</Button></a>
        </BottomCard>
      </Cards>

      {!swapIsUnsupported ? (
        <AdvancedSwapDetailsDropdown trade={trade} />
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </Page>
  )
}
