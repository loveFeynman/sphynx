import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import SwapFeeRewards from './SwapFeeRewards'
import TotalTransactionCollected from './TotalTransactionCollected'
import DistributionIn from './DistributionIn'

const Wrapper = styled.div`
  width: 100%;
  padding: 18px 0px;
  color: white;
`

const RewardsPanel: React.FC = () => {

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <SwapFeeRewards />
        <TotalTransactionCollected />
        <DistributionIn />
      </Flex>
    </Wrapper>
  )
}

export default RewardsPanel
