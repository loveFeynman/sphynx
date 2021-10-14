import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useLocation } from 'react-router'
import { Button, Link } from '@sphynxswap/uikit'
import { addToken, deleteTokens } from 'state/wallet/tokenSlice'
import { useMenuToggle, useRemovedAssets } from 'state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import Illustration from 'assets/images/Illustration.svg'
import { v4 as uuidv4 } from 'uuid'
import CloseIcon from '@material-ui/icons/Close'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/icon/WalletIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import DiscordIcon from 'assets/images/discord.png'
import axios from 'axios'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import storages from 'config/constants/storages'
import { BalanceNumber } from 'components/BalanceNumber'
import { useTranslation } from 'contexts/Localization'
import { links } from './config'
import { Field, replaceSwapState } from '../../state/swap/actions'

const MenuWrapper = styled.div<{ toggled: boolean }>`
  width: 320px;
  background: #1a1a27;
  border-right: 1px solid #afafaf;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: ${(props) => (props.toggled ? '-320px' : 0)};
  transition: left 0.5s;
  z-index: 2;
  height: 100vh;
  & img {
    width: 140px;
  }
  & p {
    font-size: 16px;
    line-height: 19px;
    color: white;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    left: 0;
    width: ${(props) => (props.toggled ? '100px' : '320px')};
    & p {
      font-size: ${(props) => (props.toggled ? '14px' : '16px')};
      line-height: ${(props) => (props.toggled ? '16px' : '19px')};
    }
  }
`

const MenuIconWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  & span {
    color: white;
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
  }
  & button {
    background: transparent !important;
    padding: 10px;
    outline: none;
    & svg path {
      fill: white;
    }
  }
`

const MenuContentWrapper = styled.div<{ toggled: boolean }>`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 32px;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: ${(props) => (props.toggled ? '0 8px' : '0 24px')};
  }
`

const WalletHeading = styled.div<{ toggled: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.toggled ? 'center' : 'space-between')};
  align-items: center;
  background: #8b2a9b;
  width: 100%;
  // height: 56px;
  padding: ${(props) => (props.toggled ? '0' : '0 48px')};
  padding-top: 12px;
  padding-bottom: 12px;
  & div {
    display: flex;
    align-items: center;
    & svg {
      margin: -2px 10px 0 0;
    }
  }
`
const TokenItemWrapper = styled.div<{ toggled: boolean }>`
  background: #5e5d62;
  border-radius: 8px;
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.toggled ? '4px' : '8px 24px 8px 12px')};
  position: relative;
  cursor: pointer;
  & > div:first-child {
    width: ${(props) => (props.toggled ? '100%' : '66%')};
  }
  & > div:last-child {
    width: ${(props) => (props.toggled ? '100%' : '32%')};
  }
  & div p:last-child {
    margin-top: ${(props) => (props.toggled ? '0px' : '8px')};
  }
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    font-size: ${(props) => (props.toggled ? '10px' : '14px')};
  }
`

const ButtonWrapper = styled.div`
  background: #8b2a9b;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
`

const MenuItem = styled.a`
  display: none;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    margin: 8px 0;
    border-radius: 10px;
    text-decoration: none !important;
    & p {
      width: calc(100% - 32px);
    }
    &:hover,
    &.active {
      background: #8b2a9b;
    }
  }
`

const MenuItemMobile = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin: 8px 0;
  border-radius: 10px;
  text-decoration: none !important;
  & p {
    width: calc(100% - 32px);
  }
  &:hover,
  &.active {
    background: #8b2a9b;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const SocialWrapper = styled.div`
  margin: 10px 0 32px;
  & p {
    margin-left: 12px;
    margin-bottom: 10px;
  }
`

const TokenListWrapper = styled.div`
  overflow-y: auto;
  max-height: 330px;
`

const SocialIconsWrapper = styled.div<{ toggled: boolean }>`
  display: flex;
  height: ${(props) => (props.toggled ? 'auto' : '48px')};
  & div {
    display: flex;
    width: ${(props) => (props.toggled ? '100%' : 'auto')};
    flex-direction: ${(props) => (props.toggled ? 'column' : 'row')};
    align-items: center;
    background: rgba(159, 219, 236, 0.2);
    border-radius: 20px;
    & svg {
      margin: ${(props) => (props.toggled ? '11px 0' : '0 11px')};
    }
  }
`

const IllustrationWrapper = styled.div`
  width: 100%;
  margin-left: -24px;
  & img {
    width: 100%;
  }
`

const RemoveIconWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 20;
  border: 1px solid white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & svg {
    width: 14px;
    height: 14px;
  }
  & svg path {
    fill: white;
  }
`

const TokenIconContainer = styled.div`
  position: relative;
`

const Menu = () => {
  const { account } = useWeb3React()
  const { menuToggled, toggleMenu } = useMenuToggle()
  const { removedAssets, setRemovedAssets } = useRemovedAssets()
  const [showAllToken, setShowAllToken] = useState(true)

  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const realPath = `/#${pathname}`

  const [sum, setSum] = useState(0)
  const [getAllToken, setAllTokens] = useState([])

  const { t } = useTranslation()

  const getDataQuery = `
  {
    ethereum(network: bsc) {
      address(address: {is: "${account}" }){
        balances {
          value
          currency {
            address
            symbol
            tokenType 
          }
        }
      }
    }
  }`

  const fetchData = async () => {
    if (account) {
      let removedTokens = JSON.parse(localStorage.getItem(storages.LOCAL_REMOVED_TOKENS))
      if (removedTokens === null) {
        removedTokens = []
      }
      setRemovedAssets(removedTokens)

      const bitConfig = {
        headers: {
          'X-API-KEY': BITQUERY_API_KEY,
        },
      }
      const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery }, bitConfig)
      if (queryResult.data.data) {
        let allsum: any = 0
        const { balances } = queryResult.data.data.ethereum.address[0]
        const promises = balances.map((elem) => {
          return axios.get(
            `${process.env.REACT_APP_BACKEND_API_URL}/price/${elem.currency.address === '-' ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : elem.currency.address
            }`,
          )
        })

        const prices: any = await Promise.all(promises)
        let i = 0

        dispatch(deleteTokens())
        // eslint-disable-next-line no-restricted-syntax
        for (const elem of balances) {
          const dollerprice: any = prices[i].data.price * elem.value
          elem.dollarPrice = dollerprice
          i++
          if (removedTokens.indexOf(elem.currency.symbol) === -1) {
            allsum += dollerprice
          }
          const token = { symbol: elem.currency.symbol, value: elem.value }
          dispatch(addToken(token))
        }

        setSum(allsum)
        setAllTokens(balances)
      }
    }
    else{
      dispatch(deleteTokens())
    }
  }

  const updateWallet = () => {
    let allsum = 0
    getAllToken.forEach((elem) => {
      if (removedAssets.indexOf(elem.currency.symbol) === -1) {
        allsum += elem.dollarPrice
      }
    })

    setSum(allsum)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    updateWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedAssets])

  const removeAsset = (asset: any) => {
    const assets = removedAssets.map((val) => val)
    assets.push(asset.currency.symbol)
    setRemovedAssets(assets)
    localStorage.setItem(storages.LOCAL_REMOVED_TOKENS, JSON.stringify(assets))
  }

  const tokenData = getAllToken
    .filter((val) => removedAssets.findIndex((item) => item === val.currency.symbol) === -1)
    .sort((a, b) => (Number(a.dollarPrice) < Number(b.dollarPrice) ? 1 : -1))
    .map(item => ({
      ...item,
      id: uuidv4()
    }))
    .map((elem: any) => {
      const { currency, value, dollarPrice, id } = elem

      const handleTokenItem = () => {
        dispatch(
          replaceSwapState({
            outputCurrencyId: 'BNB',
            inputCurrencyId: currency.address,
            typedValue: '',
            field: Field.OUTPUT,
            recipient: null,
          }),
        )
      }

      const handleRemoveAsset = () => {
        removeAsset(elem)
      }
      return (
        <TokenIconContainer key={id}>
          <a href={`#/swap/${currency.address}`}>
            <TokenItemWrapper
              toggled={menuToggled}
              onClick={handleTokenItem}
            >
              {menuToggled ? (
                <>
                  <div>
                    <p>
                      <b>{currency.symbol}</b>
                    </p>
                    <p>
                      <BalanceNumber prefix="$" value={Number(dollarPrice).toFixed(2)} />
                    </p>
                    <p>
                      <BalanceNumber prefix="" value={Number(value).toFixed(2)} />
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p>
                      <b>{currency.symbol}</b>
                    </p>
                    <p>
                      <BalanceNumber prefix="$" value={Number(dollarPrice).toFixed(2)} />
                    </p>
                  </div>
                  <div>
                    <p>
                      <BalanceNumber prefix="" value={Number(value).toFixed(2)} />
                    </p>
                    <p />
                  </div>
                </>
              )}
            </TokenItemWrapper>
          </a>
          {!menuToggled && (
            <RemoveIconWrapper
              onClick={handleRemoveAsset}
            >
              <CloseIcon />
            </RemoveIconWrapper>
          )}
        </TokenIconContainer>
      )
    })

  const showAllRemovedTokens = useCallback(() => {
    localStorage.setItem(storages.LOCAL_REMOVED_TOKENS, null)
    setRemovedAssets([])
  }, [setRemovedAssets])

  const handleToggleMenu = useCallback(() => {
    toggleMenu(!menuToggled)
  }, [menuToggled, toggleMenu])

  const handleShowAllToken = useCallback(() => {
    setShowAllToken(!showAllToken)
  }, [showAllToken])

  const handleMobileMenuItem = useCallback(() => {
    toggleMenu(false)
  }, [toggleMenu])

  return (
    <MenuWrapper toggled={menuToggled}>
      <Link external href="https://thesphynx.co">
        <img src={MainLogo} alt="Main Logo" width="159.118" height="151" />
      </Link>
      <MenuIconWrapper>
        {!menuToggled && <span>{t('Main Menu')}</span>}
        <Button
          onClick={handleToggleMenu}
          aria-label="menu toggle"
        >
          {menuToggled ? (
            <svg viewBox="0 0 24 24" width="24px">
              <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
            </svg>
          ) : (
            <MenuOpenIcon />
          )}
        </Button>
      </MenuIconWrapper>
      <WalletHeading toggled={menuToggled}>
        <div>
          <WalletIcon />
          {!menuToggled && <p>{t('Wallet')}</p>}
        </div>
        {!menuToggled && <p>{account ? <BalanceNumber prefix="$ " value={Number(sum).toFixed(2)} /> : ''}</p>}
      </WalletHeading>
      {account ? (
        <div style={{ width: '100%', padding: '0px 24px' }}>
          <TokenListWrapper>{showAllToken ? tokenData : tokenData.slice(0, 3)}</TokenListWrapper>
          <ButtonWrapper
            style={{ margin: '10px 0' }}
            onClick={handleShowAllToken}
          >
            <p>
              <b>{showAllToken ? t('Show Some Tokens') : t('Show All Tokens')}</b>
            </p>
          </ButtonWrapper>
          {removedAssets.length === 0 ? null : (
            <ButtonWrapper
              style={{ margin: '10px 0' }}
              onClick={showAllRemovedTokens}
            >
              <p>
                <b>{t('Show all removed Tokens')}</b>
              </p>
            </ButtonWrapper>
          )}
        </div>
      ) : (
        ''
      )}
      <MenuContentWrapper toggled={menuToggled}>
        {links.map(item => ({
          ...item,
          id: uuidv4()
        })).map((link) => {
          const Icon = link.icon
          return (
            <div
              key={link.id}>
              <MenuItem
                className={realPath.indexOf(link.href) > -1 && link.href !== '#' ? 'active' : ''}
                href={link.href}
                target={link.newTab ? '_blank' : ''}
                rel="noreferrer"
              >
                <Icon />
                {!menuToggled && (
                  <p>
                    <b>{t(`${link.label}`)}</b>
                  </p>
                )}
              </MenuItem>
              <MenuItemMobile
                className={realPath.indexOf(link.href) > -1 && link.href !== '#' ? 'active' : ''}
                href={link.href}
                target={link.newTab ? '_blank' : ''}
                onClick={handleMobileMenuItem}
              >
                <Icon />
                <p>
                  <b>{t(`${link.label}`)}</b>
                </p>
              </MenuItemMobile>
            </div>
          )
        })}
        <SocialWrapper>
          <p>
            <b>{t('Socials')}</b>
          </p>
          <SocialIconsWrapper toggled={menuToggled}>
            <div>
              <Link external href="https://twitter.com/sphynxswap?s=21" aria-label="twitter">
                <TwitterIcon />
              </Link>
              <Link external href="https://sphynxtoken.co" aria-label="social2">
                <SocialIcon2 />
              </Link>
              <Link external href="https://t.me/sphynxswap" aria-label="telegram">
                <TelegramIcon />
              </Link>
              <Link external href="https://discord.gg/ZEuDaFk4qz" aria-label="discord">
                <img src={DiscordIcon} alt="discord" style={{ height: "45px", width: "45px", padding: "8px" }} />
              </Link>
              {/* <Link external href="https://instagram.com/sphynxswap?utm_medium=copy_link">
                <img src={InstaIcon} alt="insta" style={{height: "45px", width: "45px", padding: "8px"}} />
              </Link> */}
            </div>
          </SocialIconsWrapper>
        </SocialWrapper>
        {!menuToggled && (
          <IllustrationWrapper>
            <img src={Illustration} width="321" height="501" alt="Illustration" />
          </IllustrationWrapper>
        )}
      </MenuContentWrapper>
    </MenuWrapper>
  )
}

export default Menu
