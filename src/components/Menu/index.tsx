import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
// import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Button, Link } from '@pancakeswap/uikit'
import { useMenuToggle } from 'state/application/hooks'
import { useWeb3React } from '@web3-react/core'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import Illustration from 'assets/images/Illustration.svg'
import { ReactComponent as MenuOpenIcon } from 'assets/svg/icon/MenuOpenIcon.svg'
import { ReactComponent as WalletIcon } from 'assets/svg/icon/WalletIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import Web3 from 'web3';
import axios from 'axios'
import config, { links } from './config'
import { typeInput } from '../../state/input/actions'
// import UserMenu from './UserMenu'
// import GlobalSettings from './GlobalSettings'

const MenuWrapper = styled.div<{ toggled: boolean }>`
  width: 320px;
  background: #1A1A27;
  border-right: 1px solid #AFAFAF;
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
`;

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
  justify-content: ${(props) => props.toggled ? 'center' : 'space-between'};
  align-items: center;
  background: #8B2A9B;
  width: 100%;
  // height: 56px;
  padding: ${(props) => props.toggled ? '0' : '0 48px'};
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
  background: #5E5D62;
  border-radius: 8px;
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.toggled ? '4px' : '8px 12px')};
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
    font-size: ${(props) => (props.toggled ? '10px' : '14px')}
  }
`

const ButtonWrapper = styled.div`
  background: #8B2A9B;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  // height: 56px;
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
    padding: 12px 24px;
    border-radius: 10px;
    text-decoration: none !important;
    & p {
      width: calc(100% - 32px);
    }
    &:hover, &.active {
      background: #8B2A9B;
    }  
  }
`

const MenuItemMobile = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none !important;
  & p {
    width: calc(100% - 32px);
  }
  &:hover, &.active {
    background: #8B2A9B;
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
  height: ${(props) => props.toggled ? 'auto' : '48px'};
  & div {
    display: flex;
    width: ${(props) => props.toggled ? '100%' : 'auto'};
    flex-direction: ${(props) => props.toggled ? 'column' : 'row'};
    align-items: center;
    background: rgba(159, 219, 236, 0.2);
    border-radius: 20px;
    & svg {
      margin: ${(props) => props.toggled ? '11px 0' : '0 11px'};
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

const Menu = (props) => {

  const { account } = useWeb3React()
  const { menuToggled, toggleMenu } = useMenuToggle();
  const [showAllToken, setShowAllToken] = useState(true);

  const [walletbalance, setWalletBalance] = useState(0);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const realPath = `/#${pathname}`;

  const [sum, setSum] = useState(0);
  const [getAllToken, setAllTokens] = useState([]);

  // const { isDark, toggleTheme } = useTheme()
  // const cakePriceUsd = usePriceCakeBusd()
  // const { profile } = useProfile()
  // const { currentLanguage, setLanguage, t } = useTranslation()

  const getBalance = () => {
    const testnet = 'https://bsc-dataseed1.defibit.io';
    const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
    const balance = account && web3.eth.getBalance(account).then((res: any) => {
      setWalletBalance(res / 1000000000000000000);
    })
  }

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
      // const g= await axios.get('https://thesphynx.co/api/price/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');
      // // eslint-disable-next-line no-console
      // console.log("price============>",g);

      const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery });
      // const addres=setAddress(queryResult.data.data.ethereum.address[0].balances.currency.address)
      // console.log("address============>",addres);
      if (queryResult.data.data) {
        // queryResult.data.data.ethereum.address[0].balances.forEach(async (elem, index)=>{
        let allsum: any = 0;

        const balances = queryResult.data.data.ethereum.address[0].balances;

        // for await (const elem of queryResult.data.data.ethereum.address[0].balances) {
          const promises = balances.map(elem => {
            return axios.get(`https://thesphynx.co/api/price/${elem.currency.address === '-' ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : elem.currency.address}`);
          })
          const prices : any = await Promise.all(promises);
          let i = 0;
          // eslint-disable-next-line no-restricted-syntax
        for(const elem of balances){
          const dollerprice: any = prices[i].data.price * elem.value;
          elem.dollarPrice = dollerprice;
          allsum += dollerprice;
          i++;
        }
        
        setSum(allsum)
        setAllTokens(balances)
      }
    }
  }

  useEffect(() => {
    fetchData()
    // getBalance()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const tokenData = getAllToken.map((elem: any) => {
    const { currency, value, dollarPrice } = elem;
    //  const link = `https://bscscan.com/token/${currency.address}`

    return (
      <>
        <TokenItemWrapper toggled={menuToggled} onClick={() => { dispatch(typeInput({ input: currency.address })) }}>
          {
            menuToggled ?
              <>
                <div>
                  <p><b>{currency.symbol}</b></p>
                  <p><b>${Number(dollarPrice).toFixed(2).toLocaleString()}</b></p>
                  <p><b>{Number(value).toFixed(2).toLocaleString()}</b></p>
                </div>
              </> :
              <>
                <div>
                  <p><b>{currency.symbol}</b></p>
                  <p><b>${Number(dollarPrice).toFixed(2).toLocaleString()}</b></p>
                </div>
                <div>
                  <p><b>{Number(value).toFixed(2).toLocaleString()}</b></p>
                  <p />
                </div>
              </>
          }

          {/* {
                  !menuToggled &&
                  <div>
                    <p><b>{currency.symbol }</b></p>
                    <p><b>${ value}</b></p>
                  </div>

                } */}

        </TokenItemWrapper>


      </>

    )
  })

  return (
    <MenuWrapper toggled={menuToggled}>
      <Link external href="https://thesphynx.co"><img src={MainLogo} alt='Main Logo' /></Link>
      <MenuIconWrapper>
        {!menuToggled && <span>Main Menu</span>
        }
        <Button onClick={() => { toggleMenu(!menuToggled) }}>
          {menuToggled ?
            <svg viewBox='0 0 24 24' width='24px'>
              <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" />
            </svg>
            :
            <MenuOpenIcon />
          }
        </Button>
      </MenuIconWrapper>
      <WalletHeading toggled={menuToggled}>
        <div>
          <WalletIcon />
          {
            !menuToggled && <p>Wallet</p>
          }
        </div>
        {!menuToggled && <p><b>{account ? `$ ${Number(sum).toFixed(2).toLocaleString()}` : ""}</b></p>
        }
      </WalletHeading>
      {
        account ?
          <div style={{ width: '100%', padding: '0px 24px' }}>
            <TokenListWrapper>
              {showAllToken ? tokenData : tokenData.slice(0, 3)}
            </TokenListWrapper>
            <ButtonWrapper style={{ margin: '10px 0' }} onClick={() => { setShowAllToken(!showAllToken) }}>
              <p><b>{showAllToken ? 'Show Some Tokens' : 'Show All Tokens'}</b></p>
            </ButtonWrapper>
          </div>
          : ""
      }
      <MenuContentWrapper toggled={menuToggled}>
        {
          links.map((link) => {
            const Icon = link.icon
            return (
              <>
                <MenuItem className={realPath.indexOf(link.href) > -1 && link.href !== '#' ? 'active' : ''} href={link.href}>
                  <Icon />
                  {
                    !menuToggled && <p><b>{link.label}</b></p>
                  }
                </MenuItem>
                <MenuItemMobile className={realPath.indexOf(link.href) > -1 && link.href !== '#' ? 'active' : ''} href={link.href} onClick={() => toggleMenu(false)}>
                  <Icon />
                  <p><b>{link.label}</b></p>
                </MenuItemMobile>
              </>
            )
          })
        }
        <SocialWrapper>
          <p><b>Socials</b></p>
          <SocialIconsWrapper toggled={menuToggled}>
            <div>
              <Link external href="https://twitter.com/sphynxswap?s=21">
                <TwitterIcon />
              </Link>
              <Link external href="https://www.thesphynx.co">
                <SocialIcon2 />
              </Link>
              <Link external href="https://t.me/sphynxswap">
                <TelegramIcon />
              </Link>
            </div>
          </SocialIconsWrapper>
        </SocialWrapper>
        {!menuToggled &&
          <IllustrationWrapper>
            <img src={Illustration} alt='Illustration' />
          </IllustrationWrapper>
        }
      </MenuContentWrapper>
    </MenuWrapper>

    // <UikitMenu
    //   userMenu={<UserMenu />}
    //   globalMenu={<GlobalSettings />}
    //   isDark={isDark}
    //   toggleTheme={toggleTheme}
    //   currentLang={currentLanguage.code}
    //   langs={languageList}
    //   setLang={setLanguage}
    //   cakePriceUsd={cakePriceUsd.toNumber()}
    //   links={config(t)}
    //   profile={{
    //     username: profile?.username,
    //     image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
    //     profileLink: '/profile',
    //     noProfileLink: '/profile',
    //     showPip: !profile?.username,
    //   }}
    //   {...props}
    // />
  )
}

export default Menu
