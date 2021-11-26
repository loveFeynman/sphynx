import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Flex, useMatchBreakpoints } from '@sphynxswap/uikit'
import styled from 'styled-components'
import Spinner from 'components/Loader/Spinner'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import SearchPannel from './SearchPannel'
import TokenCard from './TokenCard'

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
  ${({ theme }) => theme.mediaQueries.sm} {
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
    grid-template-columns: repeat(2, 1fr);
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

const TokenLocker: React.FC = () => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const { chainId } = useWeb3React()
  const isMobile = !isXl
  const [tokenList, setTokenList] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const type = false
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getAllTokenLockInfo/${chainId}/${type}`).then(async (response) => {
        if (response.data) {
          setTokenList(response.data)
        }
      })
    }

    if (chainId)
      fetchData()
  }, [chainId])


  return (
    <Wrapper>
      <SearchPannel />
      {!tokenList && <Flex justifyContent="center" mb="4px">
        <Spinner />
      </Flex>}
      <SaleInfo>
        <SaleInfoTitle>
          Total Token Locks:
        </SaleInfoTitle>
        <SaleInfoValue>
          {!tokenList ? 0 : tokenList.length}
        </SaleInfoValue>
      </SaleInfo>
      <TokenListContainder>
        {tokenList && tokenList.map((cell) => (
          <TokenCard
            id={cell.lock_id}
            tokenLogo={cell.logo_link}
            tokenName={cell.token_name}
            tokenSymbol={cell.token_symbol}
            startTime={cell.start_time}
            endTime={cell.end_time}
            amount={cell.lock_supply}
            vestingRate={100 / cell.vest_num}
            tokenAddress={cell.lock_address}
          />
        ))}
      </TokenListContainder>
    </Wrapper>
  )
}

export default TokenLocker
