import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.div`
  text-align: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  padding: 20px 0px;
  & a {
    color: black;
  }
  & > div { 
    background: #FFFFFF;  
  }
  & .active {
    background: #8B2A9B;
    color: white;
    border-radius: 14px;
    margin-left: 0px;
  }
  & .inactive {
    background: #FFFFFF;
    color: black;
  }
`

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => {
  const { t } = useTranslation()

  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="primary">
        <ButtonMenuItem className={activeIndex === 0 ? 'active' : 'inactive'} id="next-lottery-nav-link">
          {t('Next Draw')}
        </ButtonMenuItem>
        <ButtonMenuItem className={activeIndex === 1 ? 'active' : 'inactive'} id="past-lottery-nav-link">
          {t('Past Draw')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
