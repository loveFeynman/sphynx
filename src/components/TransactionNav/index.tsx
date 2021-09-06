import React, { useState } from 'react'
import styled from 'styled-components'
import { RouterType } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useSetRouterType } from 'state/application/hooks'
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
  const { setRouterType } = useSetRouterType()
  const [ activeIndex, setActiveIndex ] = useState(0)
  const [ infoToggled, toggleInfoBar ] = useState(false)

  const { t } = useTranslation()

  return (
  <>
    <StyledNav>
      <Button className={activeIndex === 0 ? 'active' : ''} id="tokendv-nav-link" onClick={() => { setActiveIndex(0) }}>
        {t('Token DX')}
      </Button>
      <Button className={activeIndex === 1 ? 'active' : ''} id="transbuyer-nav-link" onClick={() => { setActiveIndex(1) }}>
        {t('Buyers')}
      </Button>
      <Button className={activeIndex === 2 ? 'active' : ''} id="transseller-nav-link" onClick={() => { setActiveIndex(2) }}>
        {t('Sellers')}
      </Button>
      <Button className={activeIndex === 3 ? 'active' : ''} id="transinfo-nav-link" onClick={() => { setActiveIndex(3); toggleInfoBar(true) }}>
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
