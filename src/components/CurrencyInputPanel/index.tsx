import React from 'react'
import { Currency, Pair } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

// import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 8px 6px;

  & input {
    text-align: right;
    color: white;
    font-size: 22px;
    letter-spacing: -0.04em;
    font-weight: normal;
    &::placeholder {
      color: white;
    }
  }
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs', selected: false })`
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  background-color: #8b2a9b;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 2px 4px;
  margin-right: 4px;

  :focus,
  :hover {
    // background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
    opacity: 0.6;
  }

  & > div {
    & > div {
      font-size: 12px;
      letter-spacing: -0.02em;
      color: white;
      font-weight: 700;
    }
    & > svg > path {
      fill: white;
    }
  }
`

// const LabelRow = styled.div`
//   display: flex;
//   flex-flow: row nowrap;
//   align-items: center;
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.75rem;
//   line-height: 1rem;
//   padding: 0.75rem 1rem 0 1rem;
// `

const MaxButtonWrapper = styled.div`
  & button {
    background-color: #8B2A9B;
    color: white;
    margin-left: 4px;
    padding: 8px 6px;
    font-size: 14px;
    &:hover {
      background-color: #8B2A9B !important;
      opacity: 0.6;
    }
  }
`


const InputPanel = styled.div<{ hideInput?: boolean;  isBridge?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ isBridge }) =>(isBridge ? "none" : "rgb(0,0,0,0.4)")}
  // z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  // background-color: rgba(0, 0, 0, 0.4);
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  isBridge?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  isBridge = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  // const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const translatedLabel = label || t('Input')

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )
  return (
    <InputPanel id={id} isBridge={isBridge}>
      <Container hideInput={hideInput}>
        {/* {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
              {account && (
                <Text onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )} */}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          <CurrencySelectButton
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={14} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="14px" style={{ marginRight: '4px' }} />
              ) : null}
              {pair ? (
                <Text id="pair">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || (isBridge && disableCurrencySelect?t('SPX'):t('Select a currency'))}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && translatedLabel !== 'To' && (
                <MaxButtonWrapper>
                  <Button onClick={onMax} scale="sm" variant="text">
                    MAX
                  </Button>
                </MaxButtonWrapper>
              )}
            </>
          )}
        </InputRow>
      </Container>
    </InputPanel>
  )
}
