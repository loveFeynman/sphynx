import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Flex, Text, Link } from '@sphynxswap/uikit'
import { ReactComponent as BscscanIcon } from 'assets/svg/icon/Bscscan.svg'
import CopyHelper from 'components/AccountDetails/Copy'
import axios from 'axios'
import { AppState, AppDispatch } from '../../../state'
import { selectCurrency, Field } from '../../../state/swap/actions'
import { isAddress, getBscScanLink } from '../../../utils'
import { useTranslation } from '../../../contexts/Localization'

const TextWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  word-break: break-all;
  & a {
    color: white;
  }
  & > div:first-child {
    color: white;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  }
  & > div:last-child {
    font-size: 14px;
    line-height: 16px;
    color: #adb5bd;
    margin-top: 2px;
  }
  & .textWithCopy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & button {
      padding: 0;
      color: white;
    }
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenInfoContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 12px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
  }
`
// {tokenInfo}: {tokenInfo?: TokenDetailProps | null}
export default function TokenInfo() {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const isInput = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.isInput)

  const { t } = useTranslation()
  const result = isAddress(input)
  // eslint-disable-next-line no-console

  const dispatch = useDispatch<AppDispatch>()

  const [alldata, setalldata] = useState({
    holders: '',
    txs: '',
    marketCap: '',
    symbol: '',
    totalSupply: '',
  })

  const getTableData = useCallback(async () => {
    try {
      if (result) {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/tokenStats`, { address: input }).then((response) => {
          setalldata(response.data)
        })
        dispatch(
          selectCurrency({
            field: isInput ? Field.OUTPUT : Field.INPUT,
            currencyId: input,
          }),
        )
        dispatch(
          selectCurrency({
            field: isInput ? Field.INPUT : Field.OUTPUT,
            currencyId: 'BNB',
          }),
        )
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }, [dispatch, input, isInput, result])

  useEffect(() => {
    const ac = new AbortController();
    getTableData()
    return () => ac.abort();
  }, [getTableData, input, isInput])

  return (
    <TokenInfoContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <IconWrapper size={32}>
            <Text color="white">{t(`${alldata.symbol}`)}</Text>
          </IconWrapper>
        </Flex>
        <Flex style={{ width: 40 }}>
          <Link href={getBscScanLink(result === false ? '' : result, 'token')} external>
            <BscscanIcon />
          </Link>
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <TextWrapper>
          <Text>{t('Total Supply')}</Text>
          <Text>{Number(alldata.totalSupply).toLocaleString()}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Market Cap')}:</Text>
          <Text>$ {Number(alldata.marketCap).toLocaleString()}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Transactions')}</Text>
          <Text>{alldata.txs}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text className="textWithCopy">
            {t('Contract Address')}
            <CopyHelper toCopy={input}>&nbsp;</CopyHelper>
          </Text>
          <Text>
            <a href={`https://bscscan.com/token/${input}`} target="_blank" rel="noreferrer">
              {input}
            </a>
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Text>{t('Holders')}</Text>
          <Text>
            <a href={`https://bscscan.com/token/${input}#balances`} target="_blank" rel="noreferrer">
              {Number(alldata.holders).toLocaleString()}
            </a>
          </Text>
        </TextWrapper>
      </Flex>
    </TokenInfoContainer>
  )
}
