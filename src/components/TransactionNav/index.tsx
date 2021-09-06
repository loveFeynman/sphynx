import React, { useState } from 'react'
import styled from 'styled-components'
import { RouterType } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useSetRouterType } from 'state/application/hooks'
import {  Button } from '@pancakeswap/uikit'

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

const TransactionNav = () => {
  const { setRouterType } = useSetRouterType()
  const [ activeIndex, setActiveIndex ] = useState(0)

  const { t } = useTranslation()

  return (
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
    <Button className={activeIndex === 3 ? 'active' : ''} id="transinfo-nav-link" onClick={() => { setActiveIndex(3) }}>
      {t('Info')}
    </Button>
  </StyledNav>
)}

export default TransactionNav
