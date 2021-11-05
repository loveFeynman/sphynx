/* eslint-disable */
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { RouterType, ChainId } from '@sphynxswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useSetRouterType } from 'state/application/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button } from '@sphynxswap/uikit'
import SwapRouter from 'config/constants/swaps'

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
    &:hover,
    &.active {
      background: #8b2a9b !important;
      color: white;
    }
  }
`

const AutoNav = (props) => {
  const { setRouterType } = useSetRouterType()
  const { swapRouter, setSwapRouter, connectedNetworkID } = props

  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    setTimeout(() => {
      if(swapRouter === SwapRouter.SPHYNX_SWAP) {
        setRouterType(RouterType.sphynx)
      } else {
        if(chainId === ChainId.MAINNET)
          setRouterType(RouterType.pancake)
        if(chainId === ChainId.ETHEREUM)
          setRouterType(RouterType.uniswap)
      }
    })
  }, [swapRouter])

  const { t } = useTranslation()

  return (
    <StyledNav>
      {/* <Button
        className={swapRouter === SwapRouter.AUTO_SWAP ? 'active' : ''}
        id="auto-nav-link"
        onClick={() => {
          setRouterType(RouterType.sphynx)
          setSwapRouter(SwapRouter.AUTO_SWAP)
        }}
      >
        {t('AUTO')}
      </Button> */}
      <Button
        className={swapRouter === SwapRouter.SPHYNX_SWAP ? 'active' : ''}
        id="dgsn-nav-link"
        onClick={() => {
          setRouterType(RouterType.sphynx)
          setSwapRouter(SwapRouter.SPHYNX_SWAP)
        }}
      >
        {t('SPHYNX-LP')}
      </Button>
      <Button
        className={swapRouter === SwapRouter.PANCAKE_SWAP || swapRouter === SwapRouter.UNI_SWAP ? 'active' : ''}
        id="pcv-nav-link"
        onClick={() => {
          if(chainId === ChainId.MAINNET) {
            setRouterType(RouterType.pancake)
            setSwapRouter(SwapRouter.PANCAKE_SWAP)
          }
          if(chainId === ChainId.ETHEREUM) {
            setRouterType(RouterType.uniswap)
            setSwapRouter(SwapRouter.UNI_SWAP)
          }
        }}
      >
        {t(Number(connectedNetworkID) === ChainId.MAINNET? 'PCV2': 'UNV2')}
      </Button>
    </StyledNav>
  )
}

export default AutoNav
