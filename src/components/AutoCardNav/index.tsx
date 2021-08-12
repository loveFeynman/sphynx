import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useSetVersion } from 'state/application/hooks'
import { Version } from 'hooks/useToggledVersion'
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
`

const AutoNav = () => {
  const { setVersion } = useSetVersion()
  const [ activeIndex, setActiveIndex ] = useState(0)

  const { t } = useTranslation()

  return (
  <StyledNav>
    <Button className={activeIndex === 0 ? 'active' : ''} id="auto-nav-link" onClick={() => { setVersion(Version.v2); setActiveIndex(0) }}>
      {t('AUTO')}
    </Button>
    <Button className={activeIndex === 1 ? 'active' : ''} id="dgsn-nav-link" onClick={() => { setVersion(Version.v1); setActiveIndex(1) }}>
      {t('SPXLP')}
    </Button>
    <Button className={activeIndex === 2 ? 'active' : ''} id="pcv-nav-link" onClick={() => { setVersion(Version.v2); setActiveIndex(2) }}>
      {t('PCV2')}
    </Button>
  </StyledNav>
)}

export default AutoNav
