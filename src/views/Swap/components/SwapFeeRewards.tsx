import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@sphynxswap/uikit'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import { useTranslation } from 'contexts/Localization'
import Column from 'components/Column'

const RewardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 410px;
`

const RewardsContent = styled(Flex)`
  align-items: center;
  img {
    width: 38px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    img {
      width: 75px;
    }
  }
`

const LogoTitle = styled.div`
  display: block;
  width: 100%;
  div:nth-child(1) {
    font-size: 10px;
  }
  div:nth-child(2) {
    font-size: 14px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 10px;
    div:nth-child(1) {
      font-size: 16px;
    }
    div:nth-child(2) {
      font-size: 24px;
    }
  }
`

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const RewardsPanel: React.FC = () => {
  const [balance, setBalance] = useState(0)
  const { t } = useTranslation()

  return (
    <RewardsWrapper>
      <RewardsContent>
        <img src={MainLogo} alt="Main Logo" width="75" height="72" />
        <LogoTitleWrapper>
          <LogoTitle>
            <Text color="white">
              {t('Sphynx Swap')}
            </Text>
            <Text color="white" bold>
              {t('Fee Rewards')}
            </Text>
          </LogoTitle>
        </LogoTitleWrapper>
      </RewardsContent>
    </RewardsWrapper>
  )
}

export default RewardsPanel
