import React from 'react'
import styled from 'styled-components'
import { Flex } from '@sphynxswap/uikit'
import SwapFeeRewards from './SwapFeeRewards'
import TotalTransactionCollected from './TotalTransactionCollected'
import DistributionIn from './DistributionIn'

const Wrapper = styled.div`
  padding: 18px 0px;
  color: white;
  display: flex;
  justify-content: center;
  & > div {
    flex-wrap: wrap;
    & > div:first-child {
      width: 100%;
    }
    & > div:nth-child(2) {
      width: 45%;
    }
    & > div:nth-child(2) {
      width: 45%;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      flex-wrap: nowrap;
      & > div:first-child {
        width: unset;
      }
      & > div:nth-child(2) {
        width: unset;
      }
      & > div:nth-child(2) {
        width: unset;
      }
    }
  }
`

const RewardsPanel: React.FC = () => {
  return (
    <Wrapper style={{ width: '100%' }}>
      <Flex justifyContent="space-between" alignItems="center">
        <SwapFeeRewards />
        <TotalTransactionCollected />
        <DistributionIn />
      </Flex>
    </Wrapper>
  )
}

export default RewardsPanel
