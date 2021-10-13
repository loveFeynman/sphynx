import React, { lazy } from 'react'
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
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
import Loader from 'components/myLoader/Loader'
import { useTranslation } from 'contexts/Localization'
import HotTokenBar from './views/Swap/components/HotTokenBar'
import Menu from './components/Menu'
import UserMenu from './components/Menu/UserMenu'
import { ToastListener } from './contexts/ToastsContext'
import EasterEgg from './components/EasterEgg'
import GlobalStyle from './style/Global'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'

const Swap = React.lazy(() => import('./views/Swap'))
const Farms = React.lazy(() => import('./views/Farms'))
const Pools = React.lazy(() => import('./views/Pools'))
const LotterySphx = React.lazy(() => import('./views/LotterySphx'))
const Bridge = React.lazy(() => import('./views/Bridge'))
const FAQ = React.lazy(() => import('./views/FAQ'))
const NotFound = lazy(() => import('./views/NotFound'))
const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))

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
  background: #1a1a27;
  position: relative;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: ${(props) => (props.toggled ? 'calc(100% - 100px)' : 'calc(100% - 320px)')};
    margin-left: ${(props) => (props.toggled ? '100px' : '320px')};
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

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div:first-child {
    padding: 12px;
    border-radius: 6px;
    color: white;
    background: #3861fb;
    font-size: 16px;
    line-height: 20px;
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

// This config is required for number formatting
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
      <React.Suspense fallback={<Loader />}>
        <Router>
          <ResetCSS />
          <GlobalStyle />
          <Menu />
          <BodyWrapper toggled={menuToggled}>
            <BodyOverlay toggled={menuToggled} onClick={() => toggleMenu(false)} />
            <TopBar>
              <MenuOpenButton onClick={() => toggleMenu(!menuToggled)}>
                <svg viewBox="0 0 24 24" width="24px">
                  <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
                </svg>
              </MenuOpenButton>
              <TokenBarDesktop style={{ width: `calc(100% - ${account ? 470 : 300}px` }}>
                <HotTokenBar />
              </TokenBarDesktop>
              <LanguageOptionButton />
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
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/swap" />
                </Route>
                {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
                <Route path="/swap" component={Swap} />
                <Route exact strict path="/farms" component={Farms} />
                <Route exact strict path="/farms/history" component={Farms} />
                <Route exact strict path="/pools" component={Pools} />
                <Route exact strict path="/pools/history" component={Pools} />
                <Route exact strict path="/lottery" component={LotterySphx} />
                <Route exact strict path="/bridge" component={Bridge} />
                <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                <Route exact strict path="/faq" component={FAQ} />

                <Route exact path="/add" component={AddLiquidity} />
                <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                <Route exact path="/create" component={AddLiquidity} />
                <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route component={NotFound} />
              </Switch>
            </PageContent>
          </BodyWrapper>
          <EasterEgg iterations={2} />
          <ToastListener />
          <DatePickerPortal />
        </Router>
      </React.Suspense>
    </>
  )
}

export default React.memo(App)
