import React from 'react'
import styled from 'styled-components'
import { Button, useWalletModal, Text, Flex, useModal } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import CurrencySearchModal from './NetworkSwitchModal/NetworkSwitchModal'

const ButtonText = styled.div`
  display: flex;
  align-items: center;
`

const SwitchNetworkButton = (props) => {
  const { t } = useTranslation()
  const disableNetworkSelect = false
  const onNetworkSelect = () => {
    console.log('onNetworkSelect')
  }

  const [onPresentNetworkModal] = useModal(
    <CurrencySearchModal
      onNetworkSelect={onNetworkSelect}
    />
  )

  const handleSelectNetworkModal = () => {
    if (!disableNetworkSelect) {
      onPresentNetworkModal()
    }
  }

  return (
    <Button onClick={handleSelectNetworkModal} {...props} variant="tertiary">
      <Flex>
          <img src="/images/net/bsc.png" width="24" height="24" alt="network" />
        <ButtonText>
          <Text color="white" bold ml={3} textAlign="center">
            {t('BSC')}
          </Text>
        </ButtonText>
      </Flex>
    </Button>
  )
}

export default SwitchNetworkButton
