import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, useMatchBreakpoints } from '@sphynxswap/uikit'
import styled from 'styled-components'
import Spinner from 'components/Loader/Spinner'
import SearchPannel from './SearchPannel'
import LPCard from './LPCard'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 24px;
  }
`

const SaleInfo = styled.div`
    display: flex;
    justify-content: space-between;
`

const SaleInfoTitle = styled.div`
    color: #A7A7CC;
    font-weight: 600;
    font-size: 14px;
    margin-right: 5px;
`

const SaleInfoValue = styled.div`
    color: #F2C94C;
    font-weight: 600;
    font-size: 14px;
`

const TokenListContainder = styled.div`
  margin-top: 24px;
  display: grid;
  grid-gap: 20px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (min-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (min-width: 1920px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const LPLocker: React.FC = () => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const LPList = [
    {
      id: 0,
      tokenSymbol1: "SPHYNX",
      tokenSymbol2: "WBNB",
      startTime: "1637691698",
      endTime: "1637791698",
      tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
    },
    {
      id: 1,
      tokenSymbol1: "SPHYNX",
      tokenSymbol2: "WBNB",
      startTime: "1637691698",
      endTime: "1637791698",
      tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
    },
    {
      id: 2,
      tokenSymbol1: "SPHYNX",
      tokenSymbol2: "WBNB",
      startTime: "1637691698",
      endTime: "1637791698",
      tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
    },
    {
      id: 3,
      tokenSymbol1: "SPHYNX",
      tokenSymbol2: "WBNB",
      startTime: "1637691698",
      endTime: "1637791698",
      tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
    },
    {
      id: 4,
      tokenSymbol1: "SPHYNX",
      tokenSymbol2: "WBNB",
      startTime: "1637691698",
      endTime: "1637791698",
      tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
    }
  ]

  return (
    <Wrapper>
      <SearchPannel />
      {!LPList.length && <Flex justifyContent="center" mb="4px">
        <Spinner />
      </Flex>}
      <SaleInfo>
        <SaleInfoTitle>
          Total Liquidity Locks:
        </SaleInfoTitle>
        <SaleInfoValue>
          {LPList.length}
        </SaleInfoValue>
      </SaleInfo>
      <TokenListContainder>
        {LPList && LPList.map((cell) => (
          <LPCard
            id={cell.id}
            tokenSymbol1={cell.tokenSymbol1}
            tokenSymbol2={cell.tokenSymbol2}
            startTime={cell.startTime}
            endTime={cell.endTime}
            tokenAddress={cell.tokenAddress}
          />
        ))}
      </TokenListContainder>
    </Wrapper>
  )
}

export default LPLocker
