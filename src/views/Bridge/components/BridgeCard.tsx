import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'
import { useSelector, useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { Button, useWalletModal } from '@sphynxswap/uikit'
import { Currency, TokenAmount, ChainId } from '@sphynxswap/sdk'
import { ReactComponent as ArrowRightIcon } from 'assets/svg/icon/ArrowRight.svg'
import Web3 from 'web3'
import getRpcUrl from 'utils/getRpcUrl'
import useAuth from 'hooks/useAuth'
import { AutoRow } from 'components/Layout/Row'
import { setConnectedNetworkID } from 'state/input/actions'
import { switchNetwork } from 'utils/wallet'
import { AppState } from 'state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useCurrency } from '../../../hooks/Tokens'
import { useBridgeActionHandlers, useBridgeState, useDerivedBridgeInfo } from '../../../state/bridge/hooks'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import { currencyId } from '../../../utils/currencyId'
import { Field } from '../../../state/bridge/actions'
import Tokencard from './TokenCard'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'

import {
  onUseRegister, 
  onUseBSCApprove, 
  onUseEthApprove, 
  onUseSwapBSC2ETH, 
  onUseSwapETH2BSC,
  onUseSwapFee,
  onUseBscSwapFee,
} from '../../../hooks/useBridge' 


const Container = styled.div`
  color: white;
  background: rgba(0, 0, 0, 0.4);
  width: 340px;
  height: fit-content;
  margin: 0px 60px 20px;
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

const MinMaxContainger = styled.div<{ isMin: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: ${(props) => (props.isMin ? '8px 16px 16px 24px' : '24px 16px 8px 24px')};
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
  color: #ea3943;
  text-align: -webkit-center;
`

const ConnectWalletButton = styled.div`
  text-align: -webkit-center;
`
const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;
  border: 3px solid rgb(255, 255, 255);
  border-radius: 12px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export default function BridgeCard({ label, isSphynx = false }) {

  const { account, library} = useActiveWeb3React()
  const signer = library.getSigner();
  const dispatch = useDispatch()

  const { login, logout } = useAuth();
  const [currencyA1, setCurrencyA1] = useState('USDT')
  const { independentField, typedValue } = useBridgeState();
  const { onPresentConnectModal } = useWalletModal(login, logout)

  const [networkFromName, setNetworkFromName] = React.useState('bsc');
  const [networkToName, setNetworkToName] = React.useState('eth');
  const [chainId, setChainId] = React.useState(56);
  const [minAmount, setMinAmount] = React.useState(10000);
  const [maxAmount, setMaxAmount] = React.useState(1000000);
  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

  React.useEffect(() => {
    web3.eth.getChainId().then((response) => setChainId(response));
  }, [web3.eth])

  const isNetworkError = React.useMemo(() =>
    !((networkFromName === 'bsc' && chainId === ChainId.MAINNET) ||
      (networkFromName === 'eth' && chainId === 1))
    , [networkFromName, chainId])

  const handleFromChange = useCallback((value) => {
    setNetworkFromName(value.value);
  }, []);

  const handleToChange = useCallback((value) => {
    setNetworkToName(value.value);
  }, []);

  const exchangeNetwork = () => {
    setNetworkFromName(networkToName);
    setNetworkToName(networkFromName);
  }

  const handleSwitch = () => {
    if (chainId !== ChainId.MAINNET) {
      switchNetwork('0x'.concat(ChainId.MAINNET.toString(16)));
      dispatch(setConnectedNetworkID({ connectedNetworkID: ChainId.MAINNET }));
    } else {
      switchNetwork('0x'.concat(Number(1).toString(16)));
      dispatch(setConnectedNetworkID({ connectedNetworkID: 1 }));
    }
  }

  const handleNext = async () =>{
    // onUseRegister(testSigner);
    // await onUseSwapFee(testSigner);
    // await onUseEthApprove(signer, '1000')
    // await onUseSwapETH2BSC(signer, '1000');

    // await onUseBscSwapFee(signer);
    await onUseBSCApprove(signer, '1000')
    await onUseSwapBSC2ETH(signer, '1000');
    // onUseSwapETH2BSC(testSigner);
    console.log();
  }

  const currency = useCurrency(currencyA1);
  const sphynxCurrency = useCurrency('0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c');

  const handleCurrencyASelect = (currencyA_: Currency) => {
    const newCurrencyIdA = currencyId(currencyA_)
    setCurrencyA1(newCurrencyIdA)
  }

  const { onFieldSpxInput, onFieldOthInput } = useBridgeActionHandlers()

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
  } = useDerivedBridgeInfo(sphynxCurrency ?? undefined, currency ?? undefined)

  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.BRIDGE_TOKENSPX].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const maxOthAmounts: { [field in Field]?: TokenAmount } = [Field.BRIDGE_TOKENOTH].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )
  const handleMax = () => {
    if (isSphynx)
      onFieldSpxInput(maxAmounts[Field.BRIDGE_TOKENSPX]?.toFixed(4) ?? '')
    else
      onFieldOthInput(maxOthAmounts[Field.BRIDGE_TOKENOTH]?.toFixed(4) ?? '')
  }

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const isNextClickable = React.useMemo(() => {
    const formattedAmount = {
      [independentField]: typedValue,
      [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }
    const amount = isSphynx ? formattedAmount[Field.BRIDGE_TOKENSPX] : formattedAmount[Field.BRIDGE_TOKENOTH];
    console.log(amount);
  }, [ dependentField, independentField, isSphynx, parsedAmounts, typedValue])


  return (
    <Container>
      <CardHeader>{label}</CardHeader>
      <Grid>
        <Tokencard isFrom networkName={networkFromName} chainId={chainId} handleChange={handleFromChange} />
        <AutoRow justify="space-between">
          <ArrowWrapper clickable onClick={exchangeNetwork}>
            <ArrowRightIcon style={{ alignSelf: 'center' }} />
          </ArrowWrapper>
        </AutoRow>
        <Tokencard isFrom={false} networkName={networkToName} chainId={chainId} handleChange={handleToChange} />
      </Grid>
      <AmountContainer>
        <Label> {isSphynx ? 'Sphynx' : 'Token'} to Bridge</Label>
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
            borderRadius: '4px',
          }}
          onClick={handleMax}
        >
          Max
        </Button>
        <CurrencyContainer>
          <CurrencyInputPanel
            value={isSphynx ? formattedAmounts[Field.BRIDGE_TOKENSPX] : formattedAmounts[Field.BRIDGE_TOKENOTH]}
            onUserInput={isSphynx ? onFieldSpxInput : onFieldOthInput}
            onMax={null}
            onCurrencySelect={handleCurrencyASelect}
            showMaxButton={false}
            currency={isSphynx ? sphynxCurrency : currency}
            id="bridge-asset-token"
            showCommonBases
            disableCurrencySelect={isSphynx}
            isBridge
          />
        </CurrencyContainer>
        <BottomLabel>Balance on {isSphynx ? 'Sphynx' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}</BottomLabel>
      </AmountContainer>
      <MinMaxContainger isMin={false}>
        <div>Max Bridge Amount</div>
        <div>{maxAmount} {isSphynx ? 'SPX' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}</div>
      </MinMaxContainger>
      <MinMaxContainger isMin>
        <div>Min Bridge Amount</div>
        <div>{minAmount} {isSphynx ? 'SPX' : currency !== undefined && currency !== null ? currency.symbol : 'Token'}</div>
      </MinMaxContainger>
      {isNetworkError && (
        <ErrorArea>
          <div style={{ textAlign: 'left' }}>Please connect your wallet to the chain you wish to bridge from!</div>
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
            onClick={handleSwitch}
          >
            Click Here to Switch
          </Button>
        </ErrorArea>
      )}

      <ConnectWalletButton>
        <Button
          variant="tertiary"
          style={{
            marginTop: '20px',
            marginBottom: '32px',
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
          // onClick={!account? onPresentConnectModal: handleNext}
          onClick={handleNext}
        >
          {!account ? 'Connect Wallet' : 'Next'}
        </Button>
      </ConnectWalletButton>
    </Container>
  )
}
