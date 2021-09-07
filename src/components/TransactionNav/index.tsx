import React, { useState } from 'react'
import styled from 'styled-components'
import { RouterType } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useSwapTransCard } from 'state/application/hooks'
import {  Button } from '@pancakeswap/uikit'
import TokenInfo from 'views/Swap/components/TokenInfo'

const StyledNav = styled.div`
  text-align: center;
  display: flex;
  height: 24px;
  background: white;
  border-radius: 16px;
  & button {
    color: black;
    height: 24px;
    padding: 0 16px;
    background: transparent;
    border: none;
    box-shadow: none !important;
    outline: none;
    &:hover, &.active {
      background: #8B2A9B !important;
      color: white;  
    }
  }
  & #transinfo-nav-link {
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }
`

const BodyOverlay = styled.div<{ toggled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  opacity: 0.2;
  z-index: 9;
  display: ${(props) => !props.toggled ? 'none' : 'block'};
`

const TokenInfoWrapper = styled.div<{ toggled: boolean }>`
  position: fixed;
  left: ${({ toggled }) => !toggled ? -500 : 0}px;
  top: 50%;
  transform: translateY(-50%);
  background: #000;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  text-align: left;
  z-index: 10;
  transition: left 0.5s;
`

const TransactionNav = () => {
  const { swapTransCard, setSwapTransCard } = useSwapTransCard()
  const [ infoToggled, toggleInfoBar ] = useState(false)

  const { t } = useTranslation()

  return (
  <>
    <StyledNav>
      <Button className={swapTransCard === 'tokenDX' ? 'active' : ''} id="tokendv-nav-link" onClick={() => { setSwapTransCard('tokenDX') }}>
        {t('Token DX')}
      </Button>
      <Button className={swapTransCard === 'buyers' ? 'active' : ''} id="transbuyer-nav-link" onClick={() => { setSwapTransCard('buyers') }}>
        {t('Buyers')}
      </Button>
      <Button className={swapTransCard === 'sellers' ? 'active' : ''} id="transseller-nav-link" onClick={() => { setSwapTransCard('sellers') }}>
        {t('Sellers')}
      </Button>
      <Button className={swapTransCard === 'info' ? 'active' : ''} id="transinfo-nav-link" onClick={() => { setSwapTransCard('info'); toggleInfoBar(true) }}>
        {t('Info')}
      </Button>
    </StyledNav>
    <TokenInfoWrapper toggled={infoToggled}>
      <TokenInfo />
    </TokenInfoWrapper>
    <BodyOverlay toggled={infoToggled} onClick={() => toggleInfoBar(false)} />
  </>
)}

export default TransactionNav
