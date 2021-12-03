import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import { ReactComponent as LightIcon } from 'assets/svg/icon/LightIcon.svg'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import WarningIcon from 'assets/images/WarningIcon.png'
import { getPresaleAddress } from 'utils/addressHelpers'

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
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const HeaderTitleText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 14px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 30px;
  }
`

const WarningTitleText = styled(HeaderTitleText)`
  font-size: 15px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  flex-wrap: wrap;
`

const TokenPresaleContainder = styled.div<{ toggled: boolean }>`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  background: ${({ theme }) => (theme.isDark ? '#1A1A3A' : '#2A2E60')};
  min-width: 240px;
  height: fit-content;
  padding: 14px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px 34px;
  }
`

const MainCardWrapper = styled(CardWrapper)`
  width: auto;
`

const SubCardWrapper = styled(CardWrapper)`
  width: 300px;
  padding: 30px;
`

const DefiFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  background: #e93f33;
  border: 1px solid #5e2b60;
  border-radius: 5px;
  padding: 17px;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 57%;
    margin-bottom: 0px;
  }
`

const SoftFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #e97f33;
  border: 1px solid #5e2b60;
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const LiquidityFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #ffb800;
  border: 1px solid #5e2b60;
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const WarningTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: white;
  padding-bottom: 4px;
  text-align: left;
  font-weight: 600;
`

const WarningSubTitle = styled(Text)`
  font-size: 12px;
  text-align: left;
  font-weight: 500;
`

const Separate = styled.div`
  margin-top: 30px;
`

const TokenContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
`

const TokenSymbol = styled.div`
  font-weight: 600;
  font-size: 22px;
  text-align: left;
`

const TokenName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #a7a7cc;
`

const TokenSymbolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TokenAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`

const AddressFlex = styled(Flex)`
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid #31314e;
  justify-content: space-between;
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  flex-direction: row;
  div {
    font-size: 14px;
  }
  div:last-child {
    color: #f2c94c;
    font-size: 12px;
    font-weight: 600;
    word-break: break-word;
    text-align: left;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const AddressSendError = styled.div`
  margin-top: -8px;
  font-style: italic;
  font-weight: normal;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.15em;
  color: #e93f33;
  text-align: left;
`

const CustomContract = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  div:last-child {
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: #a7a7cc;
  }
`

const WhitelistTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const ContributeWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
  border-radius: 5px;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  outline: none;
  color: white;
  width: 98px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 156px;
  }
`


const DataItem = styled.div`
  display: flex;
  justify-content: center;
  div:first-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px 0 5px 5px;
    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 5px 20px;
    }
    text-align: start;
    font-size: 12px;
    color: #a7a7cc;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
    border-right: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
  }
  div:last-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px 20px;
    text-align: start;
    font-size: 12px;
    color: #f2c94c;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
  }
`

const DataLatestItem = styled(DataItem)`
  div:first-child {
    border-bottom: 0px;
  }
  div:last-child {
    border-bottom: 0px;
  }
`

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`

const ThinkItem = styled.div`
  border: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
  box-sizing: border-box;
  border-radius: 11px;
  display: flex;
  height: fit-content;
  padding: 10px;
  flex-direction: column;
  width: 40%;
  align-items: center;
  margin: 9px 9px;
  img {
    width: 25px;
    height: 25px;
  }
  div {
    margin-top: 5px;
    font-weight: 500;
    font-size: 12px;
    color: #a7a7cc;
  }
`

const TokenPresaleBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#191C41')};
  padding: 23px 28px;
  border-radius: 5px;
  margin-top: 30px;
`

const ThinkCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LaunchNotifyText = styled(Text)`
  text-align: left;
`

const FairLaunchLive: React.FC = () => {
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const [tokenData, setTokenData] = useState(null)
  const [totalTokenSupply, setTotalTokenSupply] = useState(0)
  const presaleAddress = getPresaleAddress()
  const LAUNCH_DATA = [
    {
      launchItem: 'Sale ID:',
      launchValue: 36,
    },
    {
      launchItem: 'Total Supply:',
      launchValue: `${totalTokenSupply} ${tokenData && tokenData.token_symbol}`,
    },
    {
      launchItem: 'Tokens For Launch:',
      launchValue: `${tokenData && tokenData.hard_cap * tokenData.tier3} ${tokenData && tokenData.token_symbol}`,
    },
    {
      launchItem: 'Initial Liquidity:',
      launchValue: `${
        tokenData &&
        (tokenData.listing_rate * tokenData.hard_cap * (tokenData.router_rate + tokenData.default_router_rate)) / 100
      } BNB`,
    },
    {
      launchItem: 'Listing Rate:',
      launchValue: `${tokenData && tokenData.hard_cap * tokenData.tier3} ${tokenData && tokenData.token_symbol} / BNB`
    },
    {
      launchItem: 'Launch Time:',
      launchValue: `${new Date(tokenData && tokenData.start_time * 1000).toString()}`,
    },
    {
      launchItem: 'Liquidity Unlock Date:',
      launchValue: `${new Date(tokenData && tokenData.lock_time * 1000).toString()}`,
    },
  ]

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <HeaderTitleText>{t('SphynxSale Automated Warning System')}</HeaderTitleText>
              <Text fontSize="12px" color="#777777" bold textAlign="left">
                {t('Lorem ipsum dolor sit amet, consectetur adipiscing elit')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mt="30px">
          <Flex alignItems="center">
            <WarningIcon2 width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <WarningTitleText>{t('3 Warnings Detected')}</WarningTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <DefiFlex>
          <WarningTitle>Token Dump Warning</WarningTitle>
          <WarningSubTitle style={{ opacity: '0.8' }}>
            Too many tokens are held outside this sale. 
            Make sure these tokens are burned, locked or the owner has a valid reason to hold them. 
            Tokens held by teams can be sold to pull out liquidity and should be carefully examined.
          </WarningSubTitle>
        </DefiFlex>
      </FlexWrapper>
      <TokenPresaleBody>
        <TokenPresaleContainder toggled={menuToggled}>
          <MainCardWrapper>
            <TokenContainer>
              <img src={tokenData && tokenData.logo_link} width="64px" height="64px" alt="token icon" />
              <TokenSymbolWrapper>
                <TokenSymbol>{tokenData && tokenData.token_symbol}</TokenSymbol>
                <TokenName>{tokenData && tokenData.token_name}</TokenName>
              </TokenSymbolWrapper>
            </TokenContainer>
            <TokenAddressContainer>
              <AddressFlex>
                <AddressWrapper>
                  <Text color="#A7A7CC" bold>
                    Token Address:
                  </Text>
                  <Text>{presaleAddress}</Text>
                </AddressWrapper>
              </AddressFlex>
              <AddressSendError>Do not send BNB to the token address!</AddressSendError>
              <CustomContract>
                <SettingIcon />
                <Text>Custom Contract</Text>
              </CustomContract>
            </TokenAddressContainer>
            <Separate />
            <LaunchNotifyText color="#A7A7CC" bold >
              This token has already launched! Use the links below to trade the token.
            </LaunchNotifyText>
            <Separate />
            <Separate />
            <ContributeWrapper>
              {LAUNCH_DATA.map((item, index) =>
                index === LAUNCH_DATA.length - 1 ? (
                  <DataLatestItem>
                    <Text>{item.launchItem}</Text>
                    <Text>{item.launchValue}</Text>
                  </DataLatestItem>
                ) : (
                  <DataItem>
                    <Text>{item.launchItem}</Text>
                    <Text>{item.launchValue}</Text>
                  </DataItem>
                ),
              )}
            </ContributeWrapper>
          </MainCardWrapper>
          <SubCardWrapper>
            <ThinkCardWrapper>
              <LightIcon />
              <WhitelistTitle>What do you think?</WhitelistTitle>
              <ItemContainer>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={LikeIcon} alt="think icon" />
                    <Text>Like</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={HillariousIcon} alt="think icon" />
                    <Text>Hillarious</Text>
                  </ThinkItem>
                </ItemWrapper>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={DislikeIcon} alt="think icon" />
                    <Text>Dislike</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={WarningIcon} alt="think icon" />
                    <Text>Scam</Text>
                  </ThinkItem>
                </ItemWrapper>
              </ItemContainer>
              <Separate />
              <ColorButton style={{ width: '95%' }}>Join Community</ColorButton>
            </ThinkCardWrapper>
          </SubCardWrapper>
        </TokenPresaleContainder>
      </TokenPresaleBody>
    </Wrapper>
  )
}

export default FairLaunchLive
