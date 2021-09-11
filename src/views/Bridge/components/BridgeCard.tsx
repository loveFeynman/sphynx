import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@pancakeswap/sdk'
import { ReactComponent as ArrowRightIcon } from 'assets/svg/icon/ArrowRight.svg'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Field } from '../../../state/mint/actions'

import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import { useCurrency } from '../../../hooks/Tokens'
import { useDerivedMintInfo, useMintActionHandlers, useMintState, } from '../../../state/mint/hooks'
import { useLiquidityPairA, useLiquidityPairB } from '../../../state/application/hooks'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import { currencyId } from '../../../utils/currencyId'

import Tokencard from './TokenCard'

const Container = styled.div`
	color: white;
	background: rgba(0,0,0,0.4);
	width: 340px;
	height: 624px;
	margin: 0px 60px;
	border-radius: 16px;
`
const CardHeader = styled.div`
  text-align: center;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin: 20px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  margin-bottom: 12px;
`
const AmountContainer = styled.div`
  margin: 24px 16px 24px 24px;
  position: relative;
  height: 120px;
`
const Label = styled.div`
  display: flex;
  position: absolute;
  left: 20px;
  top: 20px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`
const BottomLabel = styled.div`
  position: absolute;
  left: 16px;
  bottom: 20px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`
const CurrencyContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 12px;
  width: 90%;
`

const MinMaxContainger= styled.div <{ isMin: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${(props) => props.isMin ? '8px 16px 16px 24px':'24px 16px 8px 24px'};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`

const ErrorArea = styled.div`
  margin: 16px 14px 11px 26px;
  font-weight: 400;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #EA3943;
  text-align: -webkit-center;
`

const ConnectWalletButton = styled.div`
  text-align: -webkit-center;
`
export default function BridgeCard({ label, isSpynx = false }) {

  const { account, chainId, library } = useActiveWeb3React()

  const { liquidityPairA, setLiquidityPairA } = useLiquidityPairA()
  const { liquidityPairB, setLiquidityPairB } = useLiquidityPairB()

  const [currencyA1, setCurrencyA1] = useState(liquidityPairA || 'ETH')
  const [currencyB1, setCurrencyB1] = useState(liquidityPairB || 'ETH')
  const { t } = useTranslation()

  const currencyA = useCurrency(currencyA1)
  const currencyB = useCurrency(currencyB1)
  // get formatted amounts


  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
      (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )
  const { independentField, typedValue, otherTypedValue } = useMintState()

  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyB1) {
        setCurrencyA1(currencyB1)
        setCurrencyB1(currencyA1 || 'ETH')
      } else {
        setCurrencyA1(newCurrencyIdA)
        setCurrencyB1(currencyB1 || 'ETH')
      }
    },
    [currencyB1, currencyA1],
  )
  const handleMaxClick = () => {
    console.log("max clicked")
  }

  const handleSwitchClick = () => {
    console.log("max clicked")
  }

  return (
    <Container>
      <CardHeader>
        {label}
      </CardHeader>
      <Grid>
        <Tokencard isFrom />
        <ArrowRightIcon style={{ alignSelf: "center" }} />
        <Tokencard isFrom={false} />
      </Grid>
      <AmountContainer>
        <Label >
          Sphynx to Bridge
        </Label>
        <Button
          variant="tertiary"
          style={{
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '14px',
            position: 'absolute',
            top: '8px',
            right: '16px',
            backgroundColor: '#ED79D8',
            width: '40px',
            height: '30px',
            color: 'white',
            borderRadius: '4px'
          }}
          onClick={() => handleMaxClick()
          }>
          Max
        </Button>
        <CurrencyContainer>
          <CurrencyInputPanel
            value={formattedAmounts[Field.CURRENCY_A]}
            onUserInput={onFieldAInput}
            onMax={() => {
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
            }}
            onCurrencySelect={handleCurrencyASelect}
            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
            currency={currencies[Field.CURRENCY_A]}
            id="add-liquidity-input-tokena"
            showCommonBases
            disableCurrencySelect = {isSpynx}
          />
        </CurrencyContainer>
        <BottomLabel>
          Balance on Sphynx
        </BottomLabel>
      </AmountContainer>
      <MinMaxContainger isMin={false}>
        <div>Max Bridge Amount</div>
        <div>11000SPX</div>
      </MinMaxContainger>
      <MinMaxContainger isMin>
        <div>Min Bridge Amount</div>
        <div>65SPX</div>
      </MinMaxContainger>
      <ErrorArea>
        <div style={{textAlign: 'left'}}>
          Please connect your wallet to the chain you wish to bridge from! 
        </div>
        <Button
          variant="tertiary"
          style={{
            marginTop: '11px',
            fontStyle: 'normal',
            fontSize: '12px',
            lineHeight: '14px',
            backgroundColor: '#ED79D8',
            width: '148px',
            height: '32px',
            color: 'white',
            borderRadius: '8px',
            padding: '8px',
          }}
          onClick={() => handleSwitchClick()
          }>
          Click Here to Switch
        </Button>
      </ErrorArea>
     <ConnectWalletButton>
      <Button
        variant="tertiary"
        style={{
          marginTop: '20px',
          fontStyle: 'normal',
          fontSize: '14px',
          lineHeight: '14px',
          backgroundColor: '#8B2A9B',
          width: '300px',
          height: '40px',
          color: 'white',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '8px',
        }}
        onClick={() => handleSwitchClick()
        }>
        Connect Wallet
      </Button>
     </ConnectWalletButton>
    </Container>
  )
}