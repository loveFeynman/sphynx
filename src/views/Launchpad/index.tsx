import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import { ReactComponent as BinanceIcon } from 'assets/svg/icon/BinanceIcon.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterFullIcon.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramFullIcon.svg'
import { ReactComponent as DocumentIcon } from 'assets/svg/icon/DocumentIcon.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordFullIcon.svg'
import TokenIcon from 'assets/images/MainLogo.png'
import TVIcon from 'assets/images/sphynxTV.png'
import NFTIcon from 'assets/images/sphynxNFT.png'
import { Button } from '@sphynxswap/uikit'
import styled from 'styled-components'
import ValueCard from './components/ValueCard'
import ImgCard from './components/ImgCard'
import CommunityCard from './components/CommunityCard'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin-top: 24px;
  text-align: center;
  p {
    line-height: 24px;
  }
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
  & > * {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 8px;
    margin-bottom: 8px;

    ${({ theme }) => theme.mediaQueries.xl} {
      width: 24%;
      margin-left: 0.5%;
      margin-right: 0.5%;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
`

const LogoTitle = styled.h2`
  font-size: 36px;
  line-height: 42px;
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  color: #8b2a9b;
  font-size: 24px;
`

const NetworkCard = ({ networkName, children }) => {
  return (
    <>
      {children}
      <Sperate />
      <p>{networkName}</p>
    </>
  )
}

const Launchpad: React.FC = () => {
  return (
    <Wrapper>
      <MainLogo />
      <Title>Welcome to sphynx!</Title>
      <Sperate />
      <LogoTitle>BINANCE CHAIN DECENTRALIZED</LogoTitle>
      <LogoTitle>PROTOCOLS & SERVICES</LogoTitle>
      <Sperate />
      <p>Sphynx helps everyone to create their own tokens and token sales in few seconds.</p>
      <p>Tokens created on Sphynx willbe verified and published on explorer websites.</p>
      <Sperate />
      <Link to="/launchpad/presale">
        <Button>Create Presale</Button>
      </Link>
      <Sperate />
      <FlexWrapper style={{ marginTop: '32px' }}>
        <ValueCard value="$ 1.8M" desc="Total Liquidity Raised" />
        <ValueCard value="12" desc="Projects" />
        <ValueCard value="3200" desc="Participants" />
        <ValueCard value="$ 1.8M" desc="Total Liquidity Locked" />
      </FlexWrapper>
      <Sperate />
      <Title>Blockchains</Title>
      <Sperate />
      <LogoTitle>SUPPORTED BLOCKCHAIN</LogoTitle>
      <Sperate />
      <NetworkCard networkName="Binance">
        <BinanceIcon />
      </NetworkCard>
      <Sperate />
      <Title>Ecosystem</Title>
      <Sperate />
      <LogoTitle>A NEW REVOLUTIONARY ECOSYSTEM</LogoTitle>
      <Sperate />
      <FlexWrapper>
        <ImgCard desc="Sphynx Swap">
          <MainLogo />
        </ImgCard>
        <ImgCard desc="Sphynx Token">
          <img src={TokenIcon} alt="token icon" />
        </ImgCard>
        <ImgCard desc="Sphynx TV">
          <img src={TVIcon} alt="TV icon" />
        </ImgCard>
        <ImgCard desc="Sphynx Wallet">
          <MainLogo />
        </ImgCard>
      </FlexWrapper>
      <FlexWrapper style={{ justifyContent: 'center' }}>
        <ImgCard desc="Sphynx Sale">
          <MainLogo />
        </ImgCard>
        <ImgCard desc="Sphynx NFTs">
          <img src={NFTIcon} alt="NFT icon" />
        </ImgCard>
      </FlexWrapper>
      <Sperate />
      <Title>Community</Title>
      <Sperate />
      <LogoTitle>BE A PART OF ACTIVE COMMUNITY</LogoTitle>
      <Sperate />
      <FlexWrapper>
        <CommunityCard desc="Follow us on Twitter">
          <TwitterIcon />
        </CommunityCard>
        <CommunityCard desc="Join Community on Telegram">
          <TelegramIcon />
        </CommunityCard>
        <CommunityCard desc="Read our Document">
          <DocumentIcon />
        </CommunityCard>
        <CommunityCard desc="Join Discord">
          <DiscordIcon />
        </CommunityCard>
      </FlexWrapper>
      <Sperate />
    </Wrapper>
  )
}

export default Launchpad
