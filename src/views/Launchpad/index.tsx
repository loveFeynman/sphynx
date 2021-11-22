import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, Flex, Box, useMatchBreakpoints } from '@sphynxswap/uikit'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import { ReactComponent as BinanceIcon1 } from 'assets/svg/icon/BinanceIcon1.svg'
import { ReactComponent as BinanceIcon2 } from 'assets/svg/icon/BinanceIcon2.svg'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterFullIcon.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramFullIcon.svg'
import { ReactComponent as DocumentIcon } from 'assets/svg/icon/DocumentIcon1.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/icon/DiscordFullIcon.svg'
import MainLogo1 from 'assets/images/sphynxToken.png'
import TokenIcon from 'assets/images/MainLogo.png'
import TVIcon from 'assets/images/sphynxTV.png'
import NFTIcon from 'assets/images/sphynxNFT.png'
import { ReactComponent as NounRaiseIcon } from 'assets/svg/icon/NounRaiseIcon.svg'
import { ReactComponent as NounProjectIcon } from 'assets/svg/icon/NounProjectIcon.svg'
import { ReactComponent as NounUserIcon } from 'assets/svg/icon/NounUserIcon.svg'
import { ReactComponent as NounLockIcon } from 'assets/svg/icon/NounLockIcon.svg'
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
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 24px;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const WelcomeText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 20px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 30px;
  }
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
`

const FlexIconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
  margin-top: 30px;
  padding: 0 30px;
`

const LogoTitle = styled(Text)`
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 18px;
    text-align: left;
  }
`

const SubTitle = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #c32bb4;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  outline: none;
  color: white;
  width: 156px;
`

const PresaleBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0px;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border: 1px solid #5e2b60;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 1.5em;
  margin-top: 25px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const PresaleLogoFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const PresaleTextFlex = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 0 15px 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: start;
    margin: 0 0 0 15px;
  }
`

const BorderFlex = styled(Flex)`
  height: 40px;
  opacity: 0.1;
  border-right: 1px solid #ffffff;
`

const BinanceCard = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 0px;
  position: relative;
  margin: 10px 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 48%;
  }
`

const WaterMarkFlex = styled(Flex)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`

const BottomFlex = styled.div`
  width: 100%;
  margin-top: 35px;
  padding: 20px;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 60px;
  }
`

const NetworkCard = ({ networkName, children }) => {
  return (
    <>
      {children}
      <Sperate />
      <Text fontSize="24px" bold>
        {networkName}
      </Text>
    </>
  )
}

const Launchpad: React.FC = () => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const handleNetwork = useCallback(async () => {
    console.log('handleNetwork')
  }, [])
  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="80" height="80" />
            <Flex flexDirection="column" ml="10px">
              <WelcomeText>{t('SPHYNX PAD')}</WelcomeText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PresaleBox>
        <PresaleLogoFlex>
          <BinanceIcon1 width="40" height="40" />
          <PresaleTextFlex>
            <LogoTitle>Binance Chain Decentralized</LogoTitle>
            <LogoTitle>Protocols & Services</LogoTitle>
          </PresaleTextFlex>
        </PresaleLogoFlex>
        {/* {!isMobile&&<BorderFlex /> } */}
        <Flex flexDirection="column" alignItems="start" justifyContent="center">
          {isMobile ? (
            <Text fontSize="14px" color="white" bold textAlign="center">
              Sphynx helps everyone to create their own tokens and token sales in few seconds. Tokens created on Sphynx
              will be verified and published on explorer websites.
            </Text>
          ) : (
            <>
              <Text fontSize="15px" color="white" bold>
                Sphynx helps everyone to create their own tokens and token sales in few seconds. <br /> Tokens created
                on Sphynx will be verified and published on explorer websites.
              </Text>
            </>
          )}
        </Flex>
        <Flex mt={isMobile ? '10px' : '0px'}>
          <Link to="/launchpad/presale">
            <ColorButton>{t('Create Presale')}</ColorButton>
          </Link>
        </Flex>
      </PresaleBox>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <ValueCard
          value="$ 1.8M"
          desc="Total Liquidity Raised"
          color="linear-gradient(90deg, #610D89 0%, #C42BB4 100%)"
        >
          <NounRaiseIcon />
        </ValueCard>
        <ValueCard value="12" desc="Projects">
          <NounProjectIcon />
        </ValueCard>
        <ValueCard value="3200" desc="Participants">
          <NounUserIcon />
        </ValueCard>
        <ValueCard value="$ 1.8M" desc="Total Liquidity Locked">
          <NounLockIcon />
        </ValueCard>
      </FlexWrapper>
      <FlexWrapper>
        <BinanceCard>
          <Title>BLOCKCHAINS</Title>
          <SubTitle>Supported BlockChain</SubTitle>
          <Sperate />
          <NetworkCard networkName="Binance">
            <BinanceIcon1 width="150" />
          </NetworkCard>
          <WaterMarkFlex>
            <BinanceIcon2 width="150" />
          </WaterMarkFlex>
        </BinanceCard>
        <BinanceCard>
          <Title>ECOSYSTEM</Title>
          <SubTitle>A New Revolutionary</SubTitle>
          <SubTitle>Ecosystem</SubTitle>
          <FlexIconWrapper>
            <ImgCard desc="Sphynx Swap">
              <img src={MainLogo1} alt="swap icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx Token">
              <img src={TokenIcon} alt="token icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx TV">
              <img src={TVIcon} alt="TV icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx Wallet">
              <img src={MainLogo1} alt="swap icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx Sale">
              <img src={MainLogo1} alt="swap icon" width="130" height="130" />
            </ImgCard>
            <ImgCard desc="Sphynx NFTs">
              <img src={NFTIcon} alt="NFT icon" width="130" height="130" />
            </ImgCard>
          </FlexIconWrapper>
        </BinanceCard>
      </FlexWrapper>
      <BottomFlex>
        <Title>Community</Title>
        <SubTitle>BE A PART OF ACTIVE COMMUNITY</SubTitle>
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
      </BottomFlex>
    </Wrapper>
  )
}

export default Launchpad
