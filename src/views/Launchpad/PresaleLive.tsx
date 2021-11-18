import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import ShivaLogo from 'assets/images/ShiaToken.png'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import WarningIcon from 'assets/images/WarningIcon.png'
import { Line } from 'rc-progress';
import { SwapTabs, SwapTabList, SwapTab, SwapTabPanel } from 'components/Tab/tab'

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

const HeaderTitleText = styled(Text)`
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
  flex-wrap:wrap;
  width: 100%;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  background: ${({ theme }) => (theme.isDark ? "#1A1A3A" : "#2A2E60")};
  min-width: 240px;
  height: fit-content;
  padding: 24px 34px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px;
  }
`

const MainCardWrapper = styled(CardWrapper)`
  width: auto;
`

const SubCardWrapper = styled(CardWrapper)`
  width: 300px;
`

const PadTitle = styled.div`
    max-width: 264px;
    width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 240px;
  }
`

const PadText = styled.div`
  font-size: 22px;
  font-weight: 500;
  margin-top: 52px;
`

const DefiFlex = styled(Flex)`
  width: 57%;
  flex-direction: column;
  background: #E93F33;
  border: 1px solid #5E2B60;
  border-radius: 5px;
  padding: 17px;
`

const SoftFlex = styled(Flex)`
  width: 19%;
  flex-direction: column;
  background: #E97F33;
  border: 1px solid #5E2B60;
  border-radius: 5px;
  padding: 17px;
`

const LiquidityFlex = styled(Flex)`
  width: 19%;
  flex-direction: column;
  background: #FFB800;
  border: 1px solid #5E2B60;
  border-radius: 5px;
  padding: 17px;
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
  color: #A7A7CC;
`

const TokenSymbolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TokenDescription = styled.div`
  margin-top: 25px;
`

const TokenAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`

const AddressFlex = styled(Flex)`
  padding-bottom: 10px;
  border-bottom: 1px solid #31314E;
`

const AddressWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  flex-direction: row;
  div:last-child {
    color: #F2C94C;
    font-size: 12px;
    font-weight: 600;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    div {
      font-size: 14px;
    }
  }
`

const AddressSendError = styled.div`
  margin-top: -8px;
  font-style: italic;
  font-weight: normal;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.15em;
  color: #E93F33;
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
    color: #A7A7CC;
  }
`

const WhitelistCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #5E2B60;
  box-sizing: border-box;
  border-radius: 5px;
  width: 49%;
  padding: 25px;
`

const WhitelistTitle = styled(Text)`
  font-weight: 600;
  font-size: 20px;
`

const WhitelistSubText = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  color: #A7A7CC;
`

const WalletAddressError = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  img {
    width: 20px;
    height: 20px;
  }
  div:last-child {
      text-align: center;
      font-weight: 600;
      font-size: 12px;
      color: #A7A7CC;
  }
`

const ContributeWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`

const LinearProgressBar = styled.div`
  max-width: 355px;
  width: 100%;
`

const TokenRateView = styled.div`
  border: 1px solid #8B2A9B;
  border-radius: 10px;
  padding: 12px 12px;
  max-width: 355px;
  width: 100%;
`

const AmountWrapper = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`

const TokenAmountView = styled.div`
  border: 1px solid #8B2A9B;
  border-radius: 10px;
  padding: 9px 34px;
`

const PresaleDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const DataItem = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    gap: 64px;
  }
  div:first-child {
    flex: 1;
    text-align: end;
    font-size: 12px;
    font-weight: 500;
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 17px;
    }
  }
  div:last-child {
    flex: 1;
    text-align: start;
    font-size: 12px;
    font-weight: 500;
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 17px;
    }
  }
`

const CardTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`

const ItemContainer = styled.div`
  display: flex;
  margin: 40px 0 20px;
  flex-direction: column;
  gap: 10px;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`

const ThinkItem = styled.div`
  background: ${({ theme }) => theme.isDark ? "rgba(0, 0, 0, 0.8)" : "rgb(32 35 78)"};
  box-shadow: 0px 2px 12px rgba(37, 51, 66, 0.15);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  height: fit-content;
  padding: 10px;
  gap: 10px;
  img {
    width: 25px;
    height: 25px;
  }
`

const TokenPresaleBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#191C41"};
  padding: 23px 28px;
  border-radius: 5px;
  margin-top: 30px;
`

const ThinkCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`


const PRESALE_DATA = [
  {
    presaleItem: "Sale ID",
    presaleValue: "671",
  },
  {
    presaleItem: "Total Supply",
    presaleValue: "9,195,981.563 SHIVA",
  },
  {
    presaleItem: "Tokens For Presale",
    presaleValue: "4,600,000 SHIVA",
  },
  {
    presaleItem: "Tokens For Liquidity",
    presaleValue: "3,220,000 SHIVA",
  },
  {
    presaleItem: "Soft Cap",
    presaleValue: "100 BNB",
  },
  {
    presaleItem: "Hard Cap",
    presaleValue: "200 BNB",
  },
  {
    presaleItem: "Presale Rate",
    presaleValue: "23,000 BZAP per BNB",
  },
  {
    presaleItem: "PancakeSwap Listing Rate",
    presaleValue: "23,000 BZAP per BNB",
  },
  {
    presaleItem: "PancakeSwap Liquidity",
    presaleValue: "70%",
  },
  {
    presaleItem: "Minimum Contribution",
    presaleValue: "0.1 BNB",
  },
  {
    presaleItem: "Maximum Contribution",
    presaleValue: "1 BNB",
  },
  {
    presaleItem: "Presale Start Time",
    presaleValue: "30 Sep 2021 at 22:30",
  },
  {
    presaleItem: "Presale End Time",
    presaleValue: "1 Oct 2021 at 00:30",
  },
  {
    presaleItem: "Liquidity Unlock",
    presaleValue: "30 Sep 2022 at 22:30",
  },
]

const PresaleLive: React.FC = () => {
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const [claimToken, setClaimToken] = useState(true)

  const handleChangeQuery = (e) => {
    console.log(e)
  }

  const handleComponent = () => {
    setClaimToken(!claimToken)
  }

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems='center' flexDirection='row'>
          <Flex alignItems='center'>
            <MainLogo width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <HeaderTitleText>
                {t('SphynxSale Automated Warning System')}
              </HeaderTitleText>
              <Text fontSize="12px" color="#777777" bold textAlign='left'>
                {t('Lorem ipsum dolor sit amet, consectetur adipiscing elit')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems='center' flexDirection='row' mt='30px'>
          <Flex alignItems='center'>
            <WarningIcon2 width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <WarningTitleText>
                {t('3 Warnings Detected')}
              </WarningTitleText>
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <FlexWrapper style={{ marginTop: '32px' }}>
        <DefiFlex>
          <WarningTitle>DeFi Zone Warning</WarningTitle>
          <WarningSubTitle style={{ opacity: '0.8' }}>This sale is listed in the DeFi Zone. Presales in this area use custom contracts that are not vetted by the DxSale team. Developers of tokens in this area can block transfers, can stop users from claiming tokens, can stop trading on exchanges and requires extra vetting. Participate at your own risk!</WarningSubTitle>
        </DefiFlex>
        <SoftFlex>
          <WarningTitle>Soft Cap Warning</WarningTitle>
          <WarningSubTitle style={{ opacity: '0.8' }}>The softcap of this sale is very low.</WarningSubTitle>
        </SoftFlex>
        <LiquidityFlex>
          <WarningTitle style={{ opacity: '0.8', color: '#1A1A3A' }}>Liquidity Percentage Warning</WarningTitle>
          <WarningSubTitle color='#1A1A3A' style={{ opacity: '0.7' }}>This sale has a very low liquidity percentage.</WarningSubTitle>
        </LiquidityFlex>
      </FlexWrapper>
      <TokenPresaleBody>
        <TokenPresaleContainder toggled={menuToggled}>
          <MainCardWrapper>
            <TokenContainer>
              <img src={ShivaLogo} width="64px" height="64px" alt="token icon" />
              <TokenSymbolWrapper>
                <TokenSymbol>SHIVA</TokenSymbol>
                <TokenName>Shiva Token</TokenName>
              </TokenSymbolWrapper>
            </TokenContainer>
            <TokenDescription>
              <Text fontSize='12px' textAlign='left' color='#A7A7CC'>$SHIVA is a new reflection protocol on the Binance Smart Chain with a deflationary burn mechanism that offers reflections to holders with 0% buy and sell tax.</Text>
            </TokenDescription>
            <TokenAddressContainer>
              <AddressFlex>
                <AddressWrapper>
                  <Text color='#A7A7CC' bold>Presale Address:</Text>
                  <Text>0xB90B5CFE959c1a663da15BC21F1b4bfE5B83C706</Text>
                </AddressWrapper>
                <AddressWrapper>
                  <Text color='#A7A7CC' bold>Token Address:</Text>
                  <Text>0xE44a3670D9691C8F7caF197123fEF5095cF956Eb</Text>
                </AddressWrapper>
              </AddressFlex>
              <AddressSendError>Do not send BNB to the token address!</AddressSendError>
              <CustomContract>
                <SettingIcon />
                <Text>Custom Contract</Text>
              </CustomContract>
            </TokenAddressContainer>
            <Separate />
            <FlexWrapper>
              <WhitelistCard>
                <WhitelistTitle mb="16px">Whitelist Enabled Sale</WhitelistTitle>
                <WhitelistSubText mb="28px">Only Whitelisted Wallets can Purchase This Token!</WhitelistSubText>
                <WalletAddressError>
                  <img src={WarningIcon} alt="nuclear icon" />
                  <Text>Your wallet address is not whitelisted</Text>
                </WalletAddressError>
              </WhitelistCard>
              <WhitelistCard>
                {claimToken ? (
                  <>
                    <WhitelistTitle textAlign="center" color="#37AEE2" fontSize="16px" fontWeight="500">Raised: 270.5/300</WhitelistTitle>
                    <LinearProgressBar>
                      <Line percent={86} strokeWidth={1} strokeColor="#70D4FB" />
                    </LinearProgressBar>
                    <TokenRateView>
                      <Text fontSize="16px" fontWeight="600" color="#616161" textAlign="center">1 BNB = 250000000 SHIVA</Text>
                    </TokenRateView>
                    <Text fontSize="12px" fontWeight="600">Tokens you will get</Text>
                    <Button style={{ borderRadius: "8px" }} onClick={handleComponent}>Contribute</Button>
                    <Text fontSize="12px" fontWeight="600">Sale ends in: 06:23:49:16</Text>
                  </>
                ) : (
                  <>
                    <Text textAlign="center" fontSize="12px" fontWeight="500">This presale has ended. Go back to the dashboard to view others!</Text>
                    <Button style={{ backgroundColor: "#6941C6", borderRadius: "8px" }} mt="16px">Trade on PancakeSwap</Button>
                    <Button style={{ backgroundColor: "#8B2A9B", borderRadius: "8px" }} mt="16px">Trade on SphynxSwap</Button>
                    <Text textAlign="center" fontSize="12px" fontWeight="500" mt="16px">If you participated in the presale click the claim button below to claim your tokens!</Text>
                    <Button style={{ backgroundColor: "#31B902", borderRadius: "8px" }} mt="16px" mb="16px" onClick={handleComponent}>Claim Token</Button>
                  </>
                )}

                <AmountWrapper>
                  <TokenAmountView>
                    <Text fontSize="12px" fontWeight="normal">Your Contributed Account</Text>
                    <Text fontSize="12px" fontWeight="600" textAlign="center">1BNB</Text>
                  </TokenAmountView>
                  <TokenAmountView>
                    <Text fontSize="12px" fontWeight="normal">Your Reserved Tokens</Text>
                    <Text fontSize="12px" fontWeight="600" textAlign="center">250000000 SHIVA</Text>
                  </TokenAmountView>
                </AmountWrapper>
                <Separate />
                <Button style={{ borderRadius: "8px", fontSize: "14px", background: "rgba(139, 42, 155, 0.2)" }}>Emergency Withdraw</Button>
              </WhitelistCard>
            </FlexWrapper>

            <Separate />
            <ContributeWrapper>
              <Separate />
              <Separate />
              <PresaleDataContainer>
                {PRESALE_DATA.map((item) => (
                  <DataItem>
                    <Text>{item.presaleItem}</Text>
                    <Text>{item.presaleValue}</Text>
                  </DataItem>
                ))}
              </PresaleDataContainer>
              <Separate />
              <Separate />
            </ContributeWrapper>
          </MainCardWrapper>
          <SubCardWrapper>
            <ThinkCardWrapper>
              <CardTitle>What do you think?</CardTitle>
              <ItemContainer>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={LikeIcon} alt="think icon" />
                    <Text fontSize="16px" fontWeight="normal">Like</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={HillariousIcon} alt="think icon" />
                    <Text fontSize="16px" fontWeight="normal">Hillarious</Text>
                  </ThinkItem>
                </ItemWrapper>
                <ItemWrapper>
                  <ThinkItem>
                    <img src={DislikeIcon} alt="think icon" />
                    <Text fontSize="16px" fontWeight="normal">Dislike</Text>
                  </ThinkItem>
                  <ThinkItem>
                    <img src={WarningIcon} alt="think icon" />
                    <Text fontSize="16px" fontWeight="normal">Scam</Text>
                  </ThinkItem>
                </ItemWrapper>
              </ItemContainer>
              <SwapTabs
                selectedTabClassName='is-selected'
                selectedTabPanelClassName='is-selected'
              >
                <SwapTabList>
                  <SwapTab borderBottom>
                    <Text>
                      {t('Comments')}
                    </Text>
                  </SwapTab>
                  <SwapTab borderBottom>
                    <Text>
                      {t('Community')}
                    </Text>
                  </SwapTab>
                </SwapTabList>
                <SwapTabPanel>
                  <Separate />
                  <Button style={{ backgroundColor: "transparent", borderRadius: "10px", border: "1px solid #8B2A9B" }}>Join the Discussion</Button>
                </SwapTabPanel>
                <SwapTabPanel>
                  <Separate />
                  <Button style={{ backgroundColor: "transparent", borderRadius: "10px", border: "1px solid #8B2A9B" }}>Join the Discussion</Button>
                </SwapTabPanel>
              </SwapTabs>
            </ThinkCardWrapper>
          </SubCardWrapper>
        </TokenPresaleContainder>
      </TokenPresaleBody>
    </Wrapper>
  )
}

export default PresaleLive
