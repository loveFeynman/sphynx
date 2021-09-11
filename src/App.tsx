import React, { lazy, useState } from 'react'
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { ResetCSS, Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { AppState } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { useMenuToggle } from 'state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import { DatePickerPortal } from 'components/DatePicker'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'

import { ReactComponent as SearchIcon } from 'assets/svg/icon/SearchIcon.svg'
import { ReactComponent as EmptyAvatar } from 'assets/svg/icon/EmptyAvatar.svg'
import { ReactComponent as ChevronDown } from 'assets/svg/icon/ChevronDown.svg'
import Loader from 'components/myLoader/Loader'
import { useSelector } from 'react-redux';
import HotTokenBar from './views/Swap/components/HotTokenBar'
import Menu from './components/Menu'
import UserMenu from './components/Menu/UserMenu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import GlobalStyle from './style/Global'
import history from './routerHistory'
// Views included in the main bundle
// import Pools from './views/Pools'
import Swap from './views/Swap'
import Farms from './views/Farms'
import Pools from './views/Pools'
import Bridge from './views/Bridge'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'



// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
// const Home = lazy(() => import('./views/Home'))
// const Farms = lazy(() => import('./views/Farms'))
// const Pools = lazy(() => import('./views/Pools'))

// const FarmAuction = lazy(() => import('./views/FarmAuction'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Collectibles = lazy(() => import('./views/Collectibles'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))
// const Voting = lazy(() => import('./views/Voting'))
// const Proposal = lazy(() => import('./views/Voting/Proposal'))
// const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'))
const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
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
  background: #1A1A27;
  position: relative;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: ${(props) => props.toggled ? 'calc(100% - 100px)' : 'calc(100% - 320px)'};
    margin-left: ${(props) => props.toggled ? '100px' : '320px'};
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
  display: ${(props) => props.toggled ? 'none' : 'block'};
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
  // & button:first-child {
  //   background: transparent;
  //   padding: 0;
  //   outline: none;
  //   border: none;
  //   box-shadow: none;
  //   margin-right: 12px;
  //   margin-bottom: 8px;
  //   height: 32px;
  //   & svg path {
  //     fill: white;
  //   }
  //   ${({ theme }) => theme.mediaQueries.xl} {
  //     display: none;
  //   }
  // }
`
const SearchWrapper = styled.div`
  display: flex;
  align-item: center;
  max-width: 350px;
  width: calc(100% - 100px);
  position: relative;
  & svg {
    width: 16px;
    height: 19px;
  }
  & input {
    width: calc(100% - 20px);
    background: transparent;
    box-shadow: none;
    border: none;
    margin-left: 8px;
    font-size: 20px;
    margin-top: -5px;
    outline: none;
    color: white;
    &::placeholder {
      color: white;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-left: 16px;
  }
`

const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  & > div:first-child {
    padding: 12px;
    border-radius: 6px;
    color: white;
    background: #3861FB;
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
  useFetchProfile()
  usePollCoreFarmData()
  const { account } = useWeb3React();
  const { menuToggled, toggleMenu } = useMenuToggle();
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input);
  const routerVersion = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.routerVersion)
  const [showLoader, setShowLoader] = useState<any>(false);
  // const history = useHistory();
  // history.push('/swap')

  React.useEffect(()=>{
    setTimeout(() => {
      setShowLoader(true)
    }, 3000);
    setShowLoader(false)
  }, [input, routerVersion])

  return (
    <>
      <Router>
        <ResetCSS />
        <GlobalStyle />

        {!showLoader ?  <Loader/>:
        <>
          <Menu />
          
          <BodyWrapper toggled={menuToggled}>
            <BodyOverlay toggled={menuToggled} onClick={() => toggleMenu(false)} />
            <TopBar>
              <MenuOpenButton onClick={() => toggleMenu(!menuToggled)}>
                <svg viewBox='0 0 24 24' width='24px'>
                  <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
                </svg>
              </MenuOpenButton>
              <TokenBarDesktop style={{ width: `calc(100% - ${account ? 320 : 150}px`}}>
                <HotTokenBar />
              </TokenBarDesktop>
              {
                account ?
                <AccountWrapper>
                    <div>Connected</div>
                    <div>
                      <UserMenu />
                    </div>
                  </AccountWrapper>
                :
                <ConnectWalletButton />
              }
            </TopBar>
            <TokenBarMobile style={{ width: '100%'}}>
              <HotTokenBar />
            </TokenBarMobile>
            <PageContent>
              <SuspenseWithChunkError fallback={<PageLoader />}>
                <Switch>
                  <Route path="/" exact>
                    <Redirect to="/swap" />
                  </Route>
                  {/* <Route path="/farms">
                    <Farms />
                  </Route>
                  <Route path="/pools">
                    <Pools />
                  </Route> */}

                  {/* <Route exact path="/farms/auction">
                    <FarmAuction />
                  </Route>
                  <Route path="/lottery">
                    <Lottery />
                  </Route>
                  <Route path="/ifo">
                    <Ifos />
                  </Route>
                  <Route path="/collectibles">
                    <Collectibles />
                  </Route>
                  <Route exact path="/teams">
                    <Teams />
                  </Route>
                  <Route path="/teams/:id">
                    <Team />
                  </Route>
                  <Route path="/profile">
                    <Profile />
                  </Route>
                  <Route path="/competition">
                    <TradingCompetition />
                  </Route>
                  <Route path="/prediction">
                    <Predictions />
                  </Route>
                  <Route exact path="/voting">
                    <Voting />
                  </Route>
                  <Route exact path="/voting/proposal/create">
                    <CreateProposal />
                  </Route>
                  <Route path="/voting/proposal/:id">
                    <Proposal />
                  </Route> */}

                  {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
                  <Route path="/swap" component={Swap} />
                  <Route exact strict path="/farms" component={Farms} />
                  <Route exact strict path="/pools" component={Pools} />
                  <Route exact strict path="/bridge" component={Bridge} />

                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route exact strict path="/liquidity" component={Liquidity} />
                  <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                  <Route exact path="/add" component={AddLiquidity} />
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact path="/create" component={AddLiquidity} />
                  <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

                  {/* Redirect */}
                  {/* <Route path="/pool">
                    <Redirect to="/liquidity" />
                  </Route>
                  <Route path="/staking">
                    <Redirect to="/pools" />
                  </Route>
                  <Route path="/syrup">
                    <Redirect to="/pools" />
                  </Route>
                  <Route path="/nft">
                    <Redirect to="/collectibles" />
                  </Route> */}

                  {/* 404 */}
                  <Route component={NotFound} />
                </Switch>
              </SuspenseWithChunkError>
            </PageContent>
          </BodyWrapper>
          <EasterEgg iterations={2} />
          <ToastListener />
          <DatePickerPortal />
        </>
        }
      </Router>
    </>
  )
}

export default React.memo(App)
