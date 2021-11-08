import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utils } from 'ethers'
import styled from 'styled-components'
import Column from 'components/Column'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { marketCap } from 'state/input/actions'
import { ReactComponent as PriceIcon } from 'assets/svg/icon/PriceIcon.svg'
import { ReactComponent as ChangeIcon } from 'assets/svg/icon/ChangeIcon.svg'
import { ReactComponent as VolumeIcon } from 'assets/svg/icon/VolumeIcon.svg'
import { ReactComponent as LiquidityIcon } from 'assets/svg/icon/LiquidityIcon.svg'
import DefaultImg from 'assets/images/MainLogo.png'
import storages from 'config/constants/storages'
import { getChartStats } from 'utils/apiServices'
import { AppState } from '../../../state'
import TokenStateCard from './TokenStateCard'

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
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;

  div:nth-child(2) {
    width: 47%;
    div {
      width: 100%;
    }
  }
  div:nth-child(3) {
    width: 47%;
    div {
      width: 100%;
    }
  }
  div:nth-child(4) {
    width: 13%;
    div {
      width: 100%;
    }
  }
  div:nth-child(5) {
    width: 13%;
    div {
      width: 100%;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-wrap: nowrap;
    div:nth-child(1) {
      width: unset;
    }
    div:nth-child(2) {
      width: unset;
    }
    div:nth-child(3) {
      width: unset;
    }
    div:nth-child(4) {
      width: unset;
    }
    div:nth-child(5) {
      width: unset;
    }
  }
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

const TokenTitleCard = styled(Column)<{variantFill}>`
  background: ${({ variantFill }) => (variantFill ? 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)' : '')};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  padding: 24px;
`

const TokenPriceCard = styled(Column)`

`

export default function CoinStatsBoard(props) {
  const dispatch = useDispatch()
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const marketCapacity = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.marketCapacity)
  const result = isAddress(input)
  const interval = useRef(null)
  const tokenAddress = useRef(null)
  tokenAddress.current = input
  const { t } = useTranslation()

  const [alldata, setalldata] = useState({
    address: '',
    price: '0',
    change: '0',
    volume: '0',
    liquidityV2: '0',
    liquidityV2BNB: '0',
  })

  const { tokenData } = props
  const [price, setPrice] = useState<any>(null)
  const [scale, setScale] = useState(2)

  const [linkIcon, setLinkIcon] = useState(
    DefaultImg,
  )
  const changedecimal: any = parseFloat(alldata.change).toFixed(3)
  const volumedecimal = parseFloat(alldata.volume).toFixed(3)
  const liquidityV2decimal = parseFloat(alldata.liquidityV2).toFixed(3)
  const liquidityV2BNBdecimal = parseFloat(alldata.liquidityV2BNB).toFixed(3)

  const getTableData = useCallback(async () => {
    try {
      if (result) {
        const chartStats: any = await getChartStats(input, routerVersion)
        setalldata(chartStats)
        setPrice(chartStats.price)
        setLinkIcon(
          `https://r.poocoin.app/smartchain/assets/${
            input ? utils.getAddress(input) : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
          }/logo.png`,
        )
      }
    } catch (err) {
      setTimeout(() => getTableData(), 3000)
    }
  }, [input, result, routerVersion])

  useEffect(() => {
    const ac = new AbortController()
    getTableData()
    interval.current = setInterval(() => {
      const sessionData = JSON.parse(sessionStorage.getItem(storages.SESSION_LIVE_PRICE))
      if (sessionData === null) return
      if (sessionData.input.toLowerCase() !== tokenAddress.current.toLowerCase()) return
      setPrice(sessionData.price)
    }, 2000)
    return () => {
      clearInterval(interval.current)
      ac.abort()
    }
  }, [input, getTableData])

  useEffect(() => {
    if (tokenData) dispatch(marketCap({ marketCapacity: Number(parseInt(tokenData.totalSupply) * parseFloat(price)) }))
    const realPrice = parseFloat(price)
    if(realPrice > 1) {
      setScale(2)
    } else {
      const lg10 = Math.round(Math.abs(Math.log10(realPrice)))
      setScale(lg10 + 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, price])

  return (
    <Container>
      <TokenStateCard tokenImg={linkIcon} cardTitle={tokenData?.symbol?? ''} cardValue={`$ ${marketCapacity.toLocaleString()}`} variantFill flexGrow={2} fillColor='#F75183'/>
      <TokenStateCard CardIcon={PriceIcon} cardTitle='Price' cardValue={price? `$ ${Number(price).toFixed(scale).toLocaleString()}` : ''} variantFill={false} flexGrow={1} fillColor='#9B51E0' />
      <TokenStateCard CardIcon={ChangeIcon} cardTitle='24h Change' cardValue={changedecimal? `${changedecimal}%`:''} valueActive variantFill={false} flexGrow={1} fillColor='#77BF3E' />
      <TokenStateCard CardIcon={VolumeIcon} cardTitle='24h Volume' cardValue={volumedecimal? `$ ${Number(volumedecimal).toLocaleString()}` : ''} variantFill={false} flexGrow={1.5} fillColor='#21C2CC' />
      <TokenStateCard CardIcon={LiquidityIcon} cardTitle='Liquidity' cardValue={`${Number(liquidityV2BNBdecimal).toLocaleString()} BNB`} fillColor='#2F80ED' subPriceValue={liquidityV2decimal? `(${Number(liquidityV2decimal).toLocaleString()})` : ''} variantFill={false} flexGrow={1.5} />
    </Container>
  )
}
