import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Text, Flex } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import { ReactComponent as StopwatchIcon } from 'assets/svg/icon/StopwatchIcon1.svg'
import { ReactComponent as LightIcon } from 'assets/svg/icon/LightIcon.svg'
import ShivaLogo from 'assets/images/ShiaToken.png'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import WarningIcon from 'assets/images/WarningIcon.png'
import { getPresaleContract } from 'utils/contractHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import presaleABI from 'config/abi/presaleABI.json'
import * as ethers from 'ethers'

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
  background: #E93F33;
  border: 1px solid #5E2B60;
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
  background: #E97F33;
  border: 1px solid #5E2B60;
  border-radius: 5px;
  padding: 17px;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 19%;
  }
`

const LiquidityFlex = styled(Flex)`
  width: 49%;
  flex-direction: column;
  background: #FFB800;
  border: 1px solid #5E2B60;
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

const UnderLine = styled.div`
  width: 100%;
  opacity: 0.1;
  border-bottom: 1px solid #FFFFFF;
  margin: 10px 0;
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
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid #31314E;
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
    color: #F2C94C;
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
  border: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
  box-sizing: border-box;
  border-radius: 5px;
  width: 100%;
  padding: 15px;
  position: relative;
  margin: 10px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 25px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 49%;
    margin: 0;
    padding: 25px;
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

const WhitelistSubText = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  color: #A7A7CC;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 15px;
  }
`

const WalletAddressError = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  align-items: center;
  bottom: 30px;
  padding: 17px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  div:last-child {
      text-align: center;
      font-weight: 600;
      font-size: 12px;
      color: #A7A7CC;
  }
`

const ContributeWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
  border-radius: 5px;
`



const TokenRateView = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ContributeFlex = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  padding: 0 10px;
  border: 1px solid #595989;
  box-sizing: border-box;
  border-radius: 5px;
  justify-content: center;
  display: flex;
  max-width: 50%;
  margin-right: 5px;
  & input {
    width: 100%;
    background: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    color: #A7A7CC;
    font-size: 13px;
    &::placeholder {
      color: #A7A7CC;
    }
  }
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: linear-gradient(90deg,#610D89 0%,#C42BB4 100%);
  outline: none;
  color: white;
  width: 98px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 156px;
  }
`

const DarkButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => theme.isDark ? '#0E0E26' : '#191C41'};
  outline: none;
  color: white;
  width: 100%;
`

const TokenAmountView = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
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
    color: #A7A7CC;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
    border-right: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
  }
  div:last-child {
    flex: 1;
    align-items: center;
    display: flex;
    padding: 5px 20px;
    text-align: start;
    font-size: 12px;
    color: #F2C94C;
    font-style: normal;
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
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
  border: 1px solid ${({ theme }) => theme.isDark ? '#5E2B60' : '#4A5187'};
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
    color: #A7A7CC;
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

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ProgressBar = styled.div`
  background-color: #23234B;
  border-radius: 8px;
  position: relative;
`

const Progress = styled.div<{ state }>`
  width: ${props => `${props.state}%`};
  height: 12px;
  background: linear-gradient(90deg, #610D89 0%, #C42BB4 100%);
  border-radius: 8px 0px 0px 8px;
  padding: 1px;
`

const PRESALE_DATA = [
  {
    presaleItem: "Sale ID:",
    presaleValue: "671",
  },
  {
    presaleItem: "Total Supply:",
    presaleValue: "9,195,981.563 SHIVA",
  },
  {
    presaleItem: "Tokens For Presale:",
    presaleValue: "4,600,000 SHIVA",
  },
  {
    presaleItem: "Tokens For Liquidity:",
    presaleValue: "3,220,000 SHIVA",
  },
  {
    presaleItem: "Soft Cap:",
    presaleValue: "100 BNB",
  },
  {
    presaleItem: "Hard Cap:",
    presaleValue: "200 BNB",
  },
  {
    presaleItem: "Presale Rate:",
    presaleValue: "23,000 BZAP per BNB",
  },
  {
    presaleItem: "PancakeSwap Listing Rate:",
    presaleValue: "23,000 BZAP per BNB",
  },
  {
    presaleItem: "PancakeSwap Liquidity:",
    presaleValue: "70%",
  },
  {
    presaleItem: "Minimum Contribution:",
    presaleValue: "0.1 BNB",
  },
  {
    presaleItem: "Maximum Contribution:",
    presaleValue: "1 BNB",
  },
  {
    presaleItem: "Presale Start Time:",
    presaleValue: "30 Sep 2021 at 22:30",
  },
  {
    presaleItem: "Presale End Time:",
    presaleValue: "1 Oct 2021 at 00:30",
  },
  {
    presaleItem: "Liquidity Unlock:",
    presaleValue: "30 Sep 2022 at 22:30",
  },
]

const PresaleLive: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const [claimToken, setClaimToken] = useState(true)
  const { library } = useActiveWeb3React()
  const signer = library.getSigner()
  const presaleContract = getPresaleContract(signer)
  const [contribute, setContribute] = useState('')

  const handlerChange = (e: any) => {
    setContribute(e.target.value)
  }

  const handleComponent = () => {
    const value = new BigNumber(contribute).times(BIG_TEN.pow(18)).toString()
    presaleContract.contribute('0', {value})
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
              <WhitelistCard style={{ padding: '75px 15px' }}>
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
                <WhitelistTitle>Raised: 270.5/300</WhitelistTitle>
                <ProgressBarWrapper>
                  <ProgressBar>
                    <Progress state='70' />
                  </ProgressBar>
                </ProgressBarWrapper>

                <TokenRateView>
                  <Text fontSize="14px" fontWeight="600" color="#777777" textAlign="left">1 BNB = 250000000 SHIVA</Text>
                </TokenRateView>
                <ContributeFlex>
                  <InputWrapper>
                    <input
                      placeholder=""
                      onChange={handlerChange}
                    />
                  </InputWrapper>
                  <ColorButton style={{ borderRadius: "8px" }} onClick={handleComponent}>Contribute</ColorButton>
                </ContributeFlex>
                <Flex alignItems="center" style={{ width: '100%' }}>
                  <StopwatchIcon />
                  <Text fontSize="13px" fontWeight="600" style={{ margin: '0 10px' }}>Sale ends in: </Text>
                  <Text fontSize="12px" fontWeight="600" color="#A7A7CC">06:23:49:16</Text>
                </Flex>
                <UnderLine />
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

                <TokenAmountView>
                  <Text fontSize="12px" fontWeight="600" color="#A7A7CC">Your Contributed Account:</Text>
                  <Text fontSize="12px" fontWeight="600" textAlign="center" color="#F2C94C">1BNB</Text>
                </TokenAmountView>
                <UnderLine />
                <TokenAmountView>
                  <Text fontSize="12px" fontWeight="600" color="#A7A7CC">Your Reserved Tokens:</Text>
                  <Text fontSize="12px" fontWeight="600" textAlign="center" color="#F2C94C">250000000 SHIVA</Text>
                </TokenAmountView>
                <Separate />
                <DarkButton>Emergency Withdraw</DarkButton>
              </WhitelistCard>
            </FlexWrapper>
            <Separate />
            <ContributeWrapper>
              {PRESALE_DATA.map((item, index) => (
                index === PRESALE_DATA.length - 1 ?
                  < DataLatestItem >
                    <Text>{item.presaleItem}</Text>
                    <Text>{item.presaleValue}</Text>
                  </DataLatestItem>
                  :
                  <DataItem>
                    <Text>{item.presaleItem}</Text>
                    <Text>{item.presaleValue}</Text>
                  </DataItem>
              ))}
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
    </Wrapper >
  )
}

export default PresaleLive
