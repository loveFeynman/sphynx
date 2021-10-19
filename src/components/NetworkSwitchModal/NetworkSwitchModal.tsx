import React, { useCallback, useEffect, useState } from 'react'
import { Currency, Token } from '@sphynxswap/sdk'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  Text,
  Box,
} from '@sphynxswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { AutoRow } from 'components/Row'

const Footer = styled.div`
width: 100%;
background-color: ${({ theme }) => theme.colors.backgroundAlt};
text-align: center;
`

const StyledModalContainer = styled(ModalContainer)`
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 420px
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 660px
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

const NetworkList = styled.div`
  display: grid;
  grid-gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const NetworkItem = styled(Box)<{ selected?: boolean }>`
  display: flex;
  background: ${({ selected }) => !selected? '#202231' : 'linear-gradient(to right, #0f92ec, #f039c3)'};
  color: white;
  border-radius: 0.625rem;
  padding: 2px;
  border: '1px solid #202231';
  text-decoration: 'none';

  div {
    background: ${({ selected }) => !selected? '#202231' : '#0d0415'};
    display: flex;
    padding: 0.4rem 0.8rem;
    border-radius: 0.625rem;
    img {
      border-radius: 0.375rem;
    }
  }
  
  &: ${({ selected }) => !selected && 
  `hover {
    background: #2e3348;
    div { 
      background: #2e3348;
    }
  }`};
`
  
  interface NetworkData {
    id: number,
    btIcon: string,
    networkName: string,
    selected: boolean,
  }
  
  interface NetworkSearchModalProps extends InjectedModalProps {
    selectedNetwork?: NetworkData | null
    onNetworkSelect: (network: NetworkData) => void
    otherSelectedNetwork?: NetworkData | null
    showCommonBases?: boolean
  }

  const NETWORK_LIST = [
    {
      btIcon: "/images/net/mainnet.png",
      networkName: "Ethereum (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/polygon.png",
      networkName: "Polygon (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/fantom.png",
      networkName: "Fantom (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/arbitrum.png",
      networkName: "Arbitrum (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/okex.png",
      networkName: "OKEx (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/heco.png",
      networkName: "HECO (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/bsc.png",
      networkName: "BSC",
      selected: false,
    },
    {
      btIcon: "/images/net/xdai.png",
      networkName: "xDai (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/harmonyone.png",
      networkName: "Harmony (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/avalanche.png",
      networkName: "Avalanche (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/celo.png",
      networkName: "Celo (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/palm.png",
      networkName: "Palm (coming soon)",
      selected: false,
    },
    {
      btIcon: "/images/net/moonriver.png",
      networkName: "Moonriver (coming soon)",
      selected: false,
    },
  ]
  
export default function NetworkSwitchModal({
    onDismiss = () => null,
    onNetworkSelect,
    selectedNetwork,
    otherSelectedNetwork,
    showCommonBases = false,
  }: NetworkSearchModalProps) {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
    
  const { t } = useTranslation()

  const [selectedItem, setSelectedItem] = useState('')

  const handleNetworkItemClick = (networkItem) => {
    console.log('networkItem: ', networkItem)
    setSelectedItem(networkItem.networkName)
  }

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Select a Network</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <NetworkList>
          {NETWORK_LIST.map((item) => (
            <>
              <NetworkItem onClick={() => handleNetworkItemClick(item)} selected={item.networkName === selectedItem}>
                <AutoRow>
                  <img src={item.btIcon} width="32" height="32" alt="icon" />
                  <Text bold>{item.networkName}</Text>
                </AutoRow>
              </NetworkItem>
            </>
          ))}
        </NetworkList>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
