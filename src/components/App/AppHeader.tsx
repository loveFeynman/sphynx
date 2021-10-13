import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { RouterType } from '@sphynxswap/sdk'
import {
  Text,
  Flex,
  Heading,
  IconButton,
  ArrowBackIcon,
  NotificationDot,
  Button,
  CogIcon,
  useModal,
} from '@sphynxswap/uikit'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { useTranslation } from 'contexts/Localization'
import { useSwapType, useSetRouterType } from 'state/application/hooks'
import { useExpertModeManager } from 'state/user/hooks'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  showAuto?: boolean
  noConfig?: boolean
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

  const { setSwapType } = useSwapType()
  const [autoFocused, setAutoFocused] = useState(true)

  const { t } = useTranslation()
  const { setRouterType } = useSetRouterType()

  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  const handleSwapType = useCallback(() => {
    setSwapType(backTo)
  }, [backTo, setSwapType])

  const handleAutoFocused = useCallback(() => {
    setAutoFocused(true)
    setRouterType(RouterType.sphynx)
  }, [setRouterType])
  
  const handleSettingsModal = useCallback(() => {
    onPresentSettingsModal()
    setAutoFocused(false)
  }, [onPresentSettingsModal])

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'} style={{ flex: 1 }}>
        {backTo && (
          <TransparentIconButton
            onClick={handleSwapType}
          >
            <ArrowBackIcon width="32px" />
          </TransparentIconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px" color="white">
            {title}
          </Heading>
          {subtitle && (
            <Flex alignItems="center">
              {helper && <QuestionHelper text={helper} mr="4px" />}
              <Text color="textSubtle" fontSize="14px">
                {subtitle}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      {showAuto && (
        <AutoButton
          className={autoFocused ? 'focused' : ''}
          onClick={handleAutoFocused}
        >
          {t('Auto')}
        </AutoButton>
      )}
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <Flex>
              <IconButton
                onClick={handleSettingsModal}
                variant="text"
                scale="sm"
                mr="8px"
                aria-label="setting modal"
              >
                <CogIcon height={22} width={22} color="white" />
              </IconButton>
            </Flex>
          </NotificationDot>
          {showHistory ? <Transactions /> : <></>}
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
