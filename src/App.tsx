import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { ResetCSS, Button, useMatchBreakpoints } from '@sphynxswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useMenuToggle } from 'state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import { DatePickerPortal } from 'components/DatePicker'
import ConnectWalletButton from 'components/ConnectWalletButton'
import LanguageOptionButton from 'components/LanguageOptionButton'
import SwitchNetworkButton from 'components/SwitchNetworkButton'
import Loader from 'components/myLoader/Loader'
import { useTranslation } from 'contexts/Localization'
import HotTokenBar from './views/Swap/components/HotTokenBar'
import Menu from './components/Menu'
import UserMenu from './components/Menu/UserMenu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import EasterEgg from './components/EasterEgg'
import GlobalStyle from './style/Global'
import Swap from "./views/Swap"

const NotFound = lazy(() => import('./views/NotFound'))
const Farms = lazy(() => import('./views/Farms'))
const Pools = lazy(() => import('./views/Pools'))
const Lottery = lazy(() => import('./views/LotterySphx'))
const Bridge = lazy(() => import('./views/Bridge'))
const FAQ = lazy(() => import('./views/FAQ'))

const BodyWrapper = styled.div<{ toggled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 12px;
  min-height: calc(100vh - 152px);
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background: ${({theme}) => theme.isDark ? "#1A1A3A": "#20234E"};
  position: relative;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: ${(props) => (props.toggled ? 'calc(100% - 51px)' : 'calc(100% - 320px)')};
    margin-left: ${(props) => (props.toggled ? '51px' : '320px')};
    padding: 0 32px;
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
  display: ${(props) => (props.toggled ? 'none' : 'block')};
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const TopBar = styled.div<{ toggled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  z-index: 999;
  width: ${(props) => (props.toggled ? 'calc(100% - 52px)' : 'calc(100% - 320px)')};
  height: 57px;
  flex-wrap: wrap;
  padding: 0 20px;
  background-color: ${({theme}) => theme.isDark ? "#0E0E26" : "#191C41"}
`

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div:first-child {
    padding: 9px;
    border-radius: 6px;
    height: 34px;
    color: white;
    background: #610D89;
    font-size: 16px;
    font-weight: 700;
    margin-right: 24px;
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    & p {
      font-size: 16px;
      line-height: 19px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: white;
      margin: 0 4px 0 8px;
    }
  }
`

const PageContent = styled.div`
  width: 100%;
  min-height: 100vh;
  margin-top: 57px;
`

const MenuOpenButton = styled(Button)`
  background: transparent;
  outline: none;
  padding: 0;
  & svg {
    fill: white;
    width: 32px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const TokenBarMobile = styled.div`
  width: 100%;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const TokenBarDesktop = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
`

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()
  const { account } = useWeb3React()
  const { isSm, isXs, isMd } = useMatchBreakpoints()
  const { menuToggled, toggleMenu } = useMenuToggle()
  const { t } = useTranslation()

  React.useEffect(() => {
    if (isMd || isSm || isXs) {
      toggleMenu(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}>
          <ResetCSS />
          <GlobalStyle />
          <Menu />
          <BodyWrapper toggled={menuToggled}>
            <BodyOverlay toggled={menuToggled} onClick={() => toggleMenu(false)} />
            <TopBar toggled={menuToggled}>
              <MenuOpenButton onClick={() => toggleMenu(!menuToggled)}>
                <svg viewBox="0 0 24 24" width="24px">
                  <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
                </svg>
              </MenuOpenButton>
              <TokenBarDesktop style={{ width: `calc(100% - ${account ? 620 : 540}px` }}>
                <HotTokenBar />
              </TokenBarDesktop>
              <LanguageOptionButton />
              <SwitchNetworkButton />
              {account ? (
                <AccountWrapper>
                  <div>{t('Connected')}</div>
                  <div>
                    <UserMenu />
                  </div>
                </AccountWrapper>
              ) : (
                <ConnectWalletButton />
              )}
            </TopBar>
            <TokenBarMobile style={{ width: '100%' }}>
              <HotTokenBar />
            </TokenBarMobile>
            <PageContent>
              <SuspenseWithChunkError fallback={<Loader />}>
                <Switch>
                  <Route path="/" exact>
                    <Redirect to="/swap" />
                  </Route>
                  <Route path="/swap" component={Swap} />
                  <Route exact strict path="/farms" component={Farms} />
                  <Route exact strict path="/farms/history" component={Farms} />
                  <Route exact strict path="/pools" component={Pools} />
                  <Route exact strict path="/pools/history" component={Pools} />
                  <Route exact strict path="/lottery" component={Lottery} />
                  <Route exact strict path="/bridge" component={Bridge} />
                  <Route exact strict path="/faq" component={FAQ} />
                  <Route component={NotFound} />
                </Switch>
              </SuspenseWithChunkError>
            </PageContent>
          </BodyWrapper>
          <EasterEgg iterations={2} />
          <ToastListener />
          <DatePickerPortal />
        </Suspense>
      </Router>
    </>
  )
}

export default App
