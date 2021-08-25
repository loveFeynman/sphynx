import React, { useState } from 'react'
import styled from 'styled-components'
import { RouterType } from '@pancakeswap/sdk'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot, Button, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useSwapType, useSetRouterType } from 'state/application/hooks'
import { useExpertModeManager } from 'state/user/hooks'
// import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  showAuto?: boolean,
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

const AutoButton = styled(Button)`
  color: white;
  background: transparent !important;
  padding: 4px 6px;
  margin-right: 8px;
  height: 36px;
  outline: none;
  border: none;
  box-shadow: none !important;
  &.focused {
    box-shadow: 0 0 0 2px #8b2a9b !important;
  }
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, showAuto, noConfig = false, showHistory }) => {
  const [expertMode] = useExpertModeManager()
  
  const { swapType, setSwapType } = useSwapType()
  const [ autoFocused, setAutoFocused ] = useState(true)

  const { t } = useTranslation()
  const { setRouterType } = useSetRouterType()

  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'} style={{ flex: 1 }}>
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
      {
        showAuto &&
        <AutoButton className={ autoFocused ? 'focused' : '' } onClick={() => {
          setAutoFocused(true)
          setRouterType(RouterType.sphynx)
        }}>
          {t('Auto')}
        </AutoButton>
      }
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <Flex>
              <IconButton onClick={() => {
                onPresentSettingsModal()
                setAutoFocused(false)
              }} variant="text" scale="sm" mr="8px">
                <CogIcon height={22} width={22} color="white" />
              </IconButton>
            </Flex>
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
