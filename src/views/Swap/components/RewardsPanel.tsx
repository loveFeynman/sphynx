import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import SwapFeeRewards from './SwapFeeRewards'
import TotalTransactionCollected from './TotalTransactionCollected'
import DistributionIn from './DistributionIn'

const Wrapper = styled.div`
  padding: 18px 0px;
  color: white;
  display: flex;
  justify-content: center;
  width: max-content;
`

const RewardsPanel: React.FC = () => {

  return (
    <Wrapper style={{width: '100%'}}>
      <Flex justifyContent="space-between" alignItems="center" style={{maxWidth: '1400px', width: '100%'}}>
        <SwapFeeRewards />
        <TotalTransactionCollected />
        <DistributionIn />
      </Flex>
    </Wrapper>
  )
}

export default RewardsPanel
