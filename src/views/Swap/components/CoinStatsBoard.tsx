import React, {useEffect,useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text, Flex } from '@pancakeswap/uikit'
import Column from 'components/Column'

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

const StyledWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px 12px 0px 0px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  & > div {
    margin: 0 0 12px;
    & > div, & > div > div > div {
      &:first-child {
        color: white;
        font-size: 16px;
        line-height: 19px;
        font-weight: 500;
        margin-bottom: 2px;
      }
      &:last-child {
        color: #ADB5BD;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0;
  }
`

export default function CoinStatsBoard() {
  const theme = useContext(ThemeContext)

  return (
    <StyledWrapper>
  
      <Column>
        <Flex>
        {/* { */}
          {/* tokenInfo ? */}
            <IconWrapper size={32}>
              <img src="" alt="Coin icon" />
            </IconWrapper>
        <div>
          <Text>Coin</Text>
          <Text>0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c</Text>
        </div>
        </Flex>
      </Column>
      <Column>
        <Text>Price</Text>
        <Text>2000</Text>
      </Column>
      <Column>
        <Text>24h Change</Text>
        {/* {tokenInfo ? `${tokenInfo.priceChange24H.toFixed(2)}%` : ''} */}
        <Text>24%</Text>
      </Column>
      <Column>
        <Text>24h Volume</Text>
        {/* {tokenInfo ? numeral(tokenInfo.volumne24H).format('0,0.00') : ''} */}
        <Text>100</Text>
      </Column>
      <Column>
        <Text>Liquidity</Text>
        {/* {tokenInfo ? numeral(tokenInfo.liquidity).format('$0,0.00') : ''} */}
        <Text>0.02</Text>
      </Column>
      <Column>
        <Text>MarketCap</Text>
        {/* {tokenInfo ? numeral(tokenInfo.marketCap).format('$0,0.00') : ''} */}
        <Text>200</Text>
      </Column>

          
    
    </StyledWrapper>
  )
}
