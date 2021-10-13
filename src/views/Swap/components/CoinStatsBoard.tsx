import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'ethers'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxswap/uikit'
import Column from 'components/Column'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import axios from 'axios'
import DefaultImg from 'assets/images/MainLogo.png'
import storages from 'config/constants/storages'
import { AppState } from '../../../state'
import { getChartStats } from '../../../utils/apiServices'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const Container = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px 12px 0px 0px;
  overflow-x: auto;
  ::-webkit-scrollbar {
    height: 10px;
  }
`

const StyledWrapper = styled.div`
  padding: 8px 16px 0;
  display: flex;
  flex-wrap: wrap;
  & > div {
    margin: 0 12px 8px 0;
    width: calc(50% - 12px);
    &:first-child {
      width: 100%;
    }
    & > div,
    & > div > div > div {
      &:first-child {
        color: white;
        font-size: 14px;
        line-height: 16px;
        font-weight: 500;
        margin-bottom: 2px;
      }
      &:last-child {
        color: #adb5bd;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
      }
    }
    & .success {
      color: #00ac1c;
    }
    & .error {
      color: #ea3943;
    }
    & h2 {
      font-size: 14px;
      line-height: 16px;
      font-weight: bold;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    min-width: 500px;
    & > div {
      &:first-child {
        min-width: 192px;
      }
    }
  }
`

export default function CoinStatsBoard() {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const result = isAddress(input)
  const interval = useRef(null)
  const { t } = useTranslation()

  const [alldata, setalldata] = useState({
    address: '',
    price: '0',
    change: '0',
    volume: '0',
    liquidityV2: '0',
    liquidityV2BNB: '0',
  })

  const [tokenData, setTokenData] = useState<any>(null)
  const [price, setPrice] = useState<any>(null)

  const [linkIcon, setLinkIcon] = useState(
    'https://r.poocoin.app/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png',
  )
  const changedecimal: any = parseFloat(alldata.change).toFixed(3)
  const volumedecimal = parseFloat(alldata.volume).toFixed(3)
  const liquidityV2decimal = parseFloat(alldata.liquidityV2).toFixed(3)
  const liquidityV2BNBdecimal = parseFloat(alldata.liquidityV2BNB).toFixed(3)

  const getTableData = useCallback(async () => {
    try {
      if (result) {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/tokenStats`, { address: input }).then((response) => {
          setTokenData(response.data)
        })
        const chartStats: any = await getChartStats(input, routerVersion);
        setalldata(chartStats)
        setPrice(chartStats.price)
        setLinkIcon(
          `https://r.poocoin.app/smartchain/assets/${
            input ? utils.getAddress(input) : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
          }/logo.png`,
        )
      }
    } catch (err) {
      setTimeout(() => getTableData(), 5000)
    }
  }, [input, result, routerVersion])

  useEffect(() => {
    const ac = new AbortController();
    getTableData()
    interval.current = setInterval(() => {
      const sessionData = JSON.parse(sessionStorage.getItem(storages.SESSION_LIVE_PRICE))
      if (sessionData === null) return
      if (sessionData.input !== input) return
      setPrice(sessionData.price)
    }, 2000)
    return () => {
      clearInterval(interval.current)
      ac.abort();
    }
    
  }, [input, getTableData])

  const onImgLoadError = (event: any) => {
    const elem = event.target
    elem.src = DefaultImg;
  }

  return (
    <Container>
      <StyledWrapper>
        <Column>
          <Flex>
            <IconWrapper size={32}>
              <img src={linkIcon} width="32" height="32" onError={onImgLoadError} alt="No icon yet" />
            </IconWrapper>
            {tokenData && (
              <Flex flexDirection="column" justifyContent="center">
                <Text>{t(`${tokenData.symbol}`)}</Text>
                <Text>$ {Number(parseInt(tokenData.totalSupply) * parseFloat(price)).toLocaleString()}</Text>
              </Flex>
            )}
          </Flex>
        </Column>
        <Column>
          <Text>{t('Price')}</Text>
          <Text>${Number(price).toFixed(6).toLocaleString()}</Text>
        </Column>
        <Column>
          <Text>{t('24h Change')}</Text>
          <Text>
            <h2 className={Math.sign(changedecimal) === -1 ? 'error' : 'success'}> {changedecimal}%</h2>
          </Text>
        </Column>
        <Column>
          <Text>{t('24h Volume')}</Text>
          <Text>$ {Number(volumedecimal).toLocaleString()}</Text>
        </Column>
        <Column style={{ margin: '0 0 8px 0' }}>
          <Text>{t('Liquidity')}</Text>
          <Text>
            {Number(liquidityV2BNBdecimal).toLocaleString()} BNB
            <span className="success"> (${Number(liquidityV2decimal).toLocaleString()})</span>
          </Text>
        </Column>
      </StyledWrapper>
    </Container>
  )
}
