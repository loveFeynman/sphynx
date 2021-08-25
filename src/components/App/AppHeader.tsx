import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import { useSwapType } from 'state/application/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  noConfig?: boolean,
  showHistory?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  width: 100%;
`

const TransparentIconButton = styled(IconButton)`
  background-color: transparent;
  margin: 0px 3px;
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false, showHistory }) => {
  const [expertMode] = useExpertModeManager()
  
  const { swapType, setSwapType } = useSwapType()
  const [ autoFocused, setAutoFocused ] = useState(true);

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <TransparentIconButton onClick={() => { setSwapType(backTo) }}>
            <ArrowBackIcon width="32px" />
          </TransparentIconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px" color="white">
            {title}
          </Heading>
          {subtitle && <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" />}
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
          </Flex>}
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          {showHistory ? (
            <Transactions />
          ) : (<></>)
          }
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
