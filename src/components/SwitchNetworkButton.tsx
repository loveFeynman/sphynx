import React, { useEffect } from 'react'
import { Button, Text, Flex, useModal } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ChainId } from '@sphynxswap/sdk'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'state'
import { setConnectedNetworkID } from 'state/input/actions'
import { getNetworkID } from 'utils/wallet'
import NetworkSwitchModal from './NetworkSwitchModal/NetworkSwitchModal'

const SwitchNetworkButton = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  getNetworkID().then((networkID: string) => {
    dispatch(setConnectedNetworkID({ connectedNetworkID: Number(networkID) }));
  })
  
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.connectedNetworkID)

  const disableNetworkSelect = false
  const [onPresentNetworkModal] = useModal(
    <NetworkSwitchModal />
  )

  const handleSelectNetworkModal = () => {
    if (!disableNetworkSelect) {
      onPresentNetworkModal()
    }
  }

  return (
    <Button onClick={handleSelectNetworkModal} {...props} variant="tertiary">
      <Flex alignItems="center">
        <img
          src={`/images/net/${connectedNetworkID === ChainId.MAINNET ? "bsc" : "ethereum"}.png`}
          style={{ width: '28px', height: '28px', borderRadius: '0.375rem' }}
          alt="network" />
        <Text color="white" bold ml={3} textAlign="center">
          {connectedNetworkID === ChainId.MAINNET ? t('BSC') : t('ETH')}
        </Text>

      </Flex>
    </Button>
  )
}

export default SwitchNetworkButton
