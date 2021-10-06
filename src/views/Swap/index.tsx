/* eslint-disable no-console */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { CurrencyAmount, JSBI, RouterType, Token, Trade } from '@sphynxswap/sdk'
import { ArrowDownIcon, Box, Button, Flex, Text, useModal } from '@sphynxswap/uikit'
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
import SwapRouter from 'config/constants/swaps'
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

export default function Swap({ history }: RouteComponentProps) {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const tokenAddress = pathname.substr(6)
  const [swapRouter, setSwapRouter] = useState(SwapRouter.AUTO_SWAP)

  if (tokenAddress && tokenAddress !== '') {
    dispatch(typeInput({ input: tokenAddress }))
  }

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
    if(tokenAddress === null || tokenAddress === "" || tokenAddress === undefined) {
      dispatch(
        replaceSwapState({
          outputCurrencyId: 'BNB',
          inputCurrencyId: "0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c",
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
  }, [dispatch, tokenAddress]);

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
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
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
          {swapTransCard === 'tokenDX' && <TransactionCard />}
          {swapTransCard === 'buyers' && <BuyersCard />}
          {swapTransCard === 'sellers' && <SellersCard />}
        </div>
      </Cards>
    </SwapPage>
  )
}
