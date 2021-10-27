import React, { useEffect, useRef } from 'react'
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
  const ref = useRef(null);
  
  getNetworkID().then((networkID: string) => {
    dispatch(setConnectedNetworkID({ connectedNetworkID: Number(networkID) }));
  })
  
  const connectedNetworkID = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.connectedNetworkID)
  const disableNetworkSelect = false

  useEffect(() => {
    if( connectedNetworkID === ChainId.MAINNET ) {
      ref.current.src = '/images/net/bsc.png'
    }
    else {
      ref.current.src = '/images/net/ethereum.png'
    }
  }, [connectedNetworkID])

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
          ref={ref}
          src="/images/net/bsc.png"
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
