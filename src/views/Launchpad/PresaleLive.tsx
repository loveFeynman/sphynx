import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Text, Flex, Link } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useMenuToggle } from 'state/application/hooks'
import { ERC20_ABI } from 'config/abi/erc20'
import { ReactComponent as MainLogo } from 'assets/svg/icon/WarningIcon.svg'
import { ReactComponent as WarningIcon2 } from 'assets/svg/icon/WarningIcon2.svg'
import { ReactComponent as SettingIcon } from 'assets/svg/icon/SettingIcon.svg'
import { ReactComponent as StopwatchIcon } from 'assets/svg/icon/StopwatchIcon1.svg'
import { ReactComponent as LightIcon } from 'assets/svg/icon/LightIcon.svg'
import LikeIcon from 'assets/images/LikeIcon.png'
import DislikeIcon from 'assets/images/DislikeIcon.png'
import HillariousIcon from 'assets/images/HillariousIcon.png'
import WarningIcon from 'assets/images/WarningIcon.png'
import { getPresaleContract } from 'utils/contractHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useParams } from 'react-router'
import axios from 'axios'
import * as ethers from 'ethers'
import { getPresaleAddress } from 'utils/addressHelpers'
import TimerComponent from 'components/Timer/TimerComponent'

import DefaultLogoIcon from 'assets/images/MainLogo.png'
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import GitIcon from 'assets/images/githubIcon.png'
import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
import RedditIcon from 'assets/images/redditIcon.png'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'

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
    font-size: 22px;
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
  font-size: 18px;
  font-weight: 600;
  color: white;
  padding-bottom: 4px;
  text-align: left;
  font-weight: 600;
`

const WarningSubTitle = styled(Text)`
  font-size: 14px;
  text-align: left;
  font-weight: 500;
`

const Separate = styled.div`
  margin-top: 30px;
`

const UnderLine = styled.div`
  width: 100%;
  opacity: 0.1;
  border-bottom: 1px solid #ffffff;
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
  font-size: 25px;
  text-align: left;
`

const TokenName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #a7a7cc;
  text-align: left;
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
    font-size: 14px;
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
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.15em;
  color: #ff2f21;
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
    color: white;
  }
`

const WhitelistCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
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
  color: white;
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
    color: white;
  }
`

const ContributeWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => (theme.isDark ? '#5E2B60' : '#4A5187')};
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
    color: white;
    font-size: 13px;
    &::placeholder {
      color: white;
    }
  }
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

const DarkButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#191C41')};
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
    font-size: 14px;
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
    font-size: 14px;
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
    font-size: 14px;
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

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

const ProgressBar = styled.div`
  background-color: #23234b;
  border-radius: 8px;
  position: relative;
`

const Progress = styled.div<{ state }>`
  width: ${(props) => `${props.state}%`};
  height: 12px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  border-radius: 8px;
  padding: 1px;
  display: flex;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
`

const SocialIconsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const IconBox = styled.div<{ color?: string }>`
  background: ${({ color }) => color};
  padding: 10px;
  border-radius: 3px;
  display: flex;
  width: fit-content;
  align-items: center;
`

const PresaleLive: React.FC = () => {
  const param: any = useParams()
  const { t } = useTranslation()
  const history = useHistory()
  const { menuToggled } = useMenuToggle()
  const [presaleStatus, setPresaleStatus] = useState(false)
  const { library, account, chainId } = useActiveWeb3React()
  const signer = library.getSigner()
  const presaleContract = getPresaleContract(signer)
  const [contribute, setContribute] = useState('')
  const [tokenData, setTokenData] = useState(null)
  const [raise, setRaise] = useState(0)
  const [userContributeBNB, setUserContributeBNB] = useState(0)
  const [userContributeToken, setUserContributeToken] = useState(0)
  const [totalTokenSupply, setTotalTokenSupply] = useState(0)
  const [isClaimed, setIsClaimed] = useState(false)
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [whiteList1, setWhiteList1] = useState(false)
  const [whiteList2, setWhiteList2] = useState(false)
  const [baseWhiteList, setBaseWhiteList] = useState(false)
  const [privateSale1, setPrivateSale1] = useState(false)
  const [privateSale2, setPrivateSale2] = useState(false)
  const [publicSale, setPublicSale] = useState(false)
  const [endSale, setendSale] = useState(false)
  const [failedSale, setFailedSale] = useState(false)
  const presaleAddress = getPresaleAddress()
  const timerRef = useRef<NodeJS.Timeout>()
  const PRESALE_DATA = [
    {
      presaleItem: 'Sale ID:',
      presaleValue: param.saleId,
    },
    {
      presaleItem: 'Total Supply:',
      presaleValue: `${totalTokenSupply} ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Tokens For Presale:',
      presaleValue: `${tokenData && tokenData.hard_cap * tokenData.tier3} ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Tokens For Liquidity:',
      presaleValue: `${tokenData &&
        (tokenData.listing_rate * tokenData.hard_cap * (tokenData.router_rate + tokenData.default_router_rate)) / 100
        } ${tokenData && tokenData.token_symbol}`,
    },
    {
      presaleItem: 'Soft Cap:',
      presaleValue: `${tokenData && tokenData.soft_cap} BNB`,
    },
    {
      presaleItem: 'Hard Cap:',
      presaleValue: `${tokenData && tokenData.hard_cap} BNB`,
    },
    {
      presaleItem: 'Presale Rate:',
      presaleValue: `${tokenData && tokenData.tier3} ${tokenData && tokenData.token_symbol} per BNB`,
    },
    {
      presaleItem: 'SphynxSwap Listing Rate:',
      presaleValue: `${tokenData && tokenData.listing_rate} ${tokenData && tokenData.token_symbol} per BNB`,
    },
    {
      presaleItem: 'SphynxSwap Liquidity:',
      presaleValue: `${tokenData && tokenData.default_router_rate}%`,
    },
    {
      presaleItem: 'PancakeSwap Liquidity:',
      presaleValue: `${tokenData && tokenData.router_rate}%`,
    },
    {
      presaleItem: 'Minimum Contribution:',
      presaleValue: `${tokenData && tokenData.min_buy} BNB`,
    },
    {
      presaleItem: 'Maximum Contribution:',
      presaleValue: `${tokenData && tokenData.max_buy} BNB`,
    },
    {
      presaleItem: 'Presale Start Time:',
      presaleValue: `${new Date(tokenData && tokenData.start_time * 1000).toString()}`,
    },
    {
      presaleItem: 'Presale End Time:',
      presaleValue: `${new Date(tokenData && tokenData.end_time * 1000).toString()}`,
    },
    {
      presaleItem: 'Liquidity Unlock:',
      presaleValue: `${new Date(tokenData && tokenData.lock_time * 1000).toString()}`,
    },
  ]

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (tokenData) {
        const now = Math.floor(new Date().getTime() / 1000)
        if (parseInt(tokenData.start_time) < now && now < parseInt(tokenData.tier1_time)) {
          setPrivateSale1(true)
        } else if (parseInt(tokenData.tier1_time) < now && now < parseInt(tokenData.tier2_time)) {
          setPrivateSale1(false)
          setPrivateSale2(true)
        } else if (parseInt(tokenData.tier2_time) < now && now < parseInt(tokenData.end_time)) {
          setPrivateSale1(false)
          setPrivateSale2(false)
          setPublicSale(true)
        } else if (now >= parseInt(tokenData.end_time)) {
          setendSale(true)
        }
      }
    }, 10000)
    return () => {
      clearInterval(timerRef.current!)
    }
  }, [timerRef, tokenData])

  useEffect(() => {
    const isValue = !Number.isNaN(parseInt(param.saleId))
    if (isValue && chainId) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getPresaleInfo/${param.saleId}/${chainId}`)
        .then((response) => {
          if (response.data) {
            console.log('responseData', response.data)
            setTokenData(response.data)
          }
        })
    }
  }, [param.saleId, chainId])

  useEffect(() => {
    const fetchData = async () => {
      let temp: any
      let value: any
      /* from presale contract */
      temp = (await presaleContract.totalContributionBNB(param.saleId)).toString()
      value = parseFloat(ethers.utils.formatEther(temp))
      setRaise(value)
      if (value < tokenData?.soft_cap && endSale) {
        setFailedSale(true)
      }

      temp = await presaleContract.presaleStatus(param.saleId)
      setPresaleStatus(temp)

      temp = (await presaleContract.userContributionBNB(param.saleId, account)).toString()
      value = parseFloat(ethers.utils.formatEther(temp))
      setUserContributeBNB(value)

      temp = (await presaleContract.userContributionToken(param.saleId, account)).toString()
      value = parseFloat(ethers.utils.formatUnits(temp, tokenData.token_decimal))
      setUserContributeToken(value)

      temp = await presaleContract.isClaimed(param.saleId, account)
      setIsClaimed(temp)

      temp = await presaleContract.iswhitelist(param.saleId)
      setIsWhiteList(temp)
      /* from token contract */
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenData.token_address, abi, signer)
      temp = (await tokenContract.totalSupply()).toString()
      value = parseFloat(ethers.utils.formatUnits(temp, tokenData.token_decimal))
      setTotalTokenSupply(value)

      temp = await presaleContract.whitelist1(param.saleId, account)
      setWhiteList1(temp)

      temp = await presaleContract.whitelist2(param.saleId, account)
      setWhiteList2(temp)

      temp = await presaleContract.basewhitelist(account)
      setBaseWhiteList(temp)
    }

    if (tokenData) {
      fetchData()
    }
  }, [presaleContract, tokenData, param.saleId, account, signer, endSale])

  const handlerChange = (e: any) => {
    setContribute(e.target.value)
  }

  const handleComponent = async () => {
    const isValue = !Number.isNaN(parseInt(param.saleId))
    if (isValue && parseFloat(contribute) > 0 && tokenData) {
      const value = ethers.utils.parseEther(contribute)
      const tx = await presaleContract.contribute(param.saleId, { value })
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/contribute`, { saleId: param.saleId, chainId })
          .then((res) => {
            console.log("response", res)
          })
      }
    }
  }

  const handleClaimToken = async () => {
    const tx = await presaleContract.claimToken(param.saleId)
    await tx.wait()
  }

  const handleEmergencyWithdraw = async () => {
    const tx = await presaleContract.emergencyWithdraw(param.saleId)
    await tx.wait()
  }

  const toSphynxSwap = () => {
    history.push(`/swap/${tokenData.token_address}`)
  }

  return (
    <Wrapper>
      <PageHeader>
        <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
          <Flex alignItems="center">
            <MainLogo width="40" height="40" />
            <Flex flexDirection="column" ml="10px">
              <HeaderTitleText>{t('SphynxSale Automated Warning System')}</HeaderTitleText>
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
          <WarningTitle>DeFi Zone Warning</WarningTitle>
          <WarningSubTitle>
            This sale is listed in the DeFi Zone. Presales in this area use custom contracts that are not vetted by the
            DxSale team. Developers of tokens in this area can block transfers, can stop users from claiming tokens, can
            stop trading on exchanges and requires extra vetting. Participate at your own risk!
          </WarningSubTitle>
        </DefiFlex>
        <SoftFlex>
          <WarningTitle>Soft Cap Warning</WarningTitle>
          <WarningSubTitle>The softcap of this sale is very low.</WarningSubTitle>
        </SoftFlex>
        <LiquidityFlex>
          <WarningTitle style={{ color: '#1A1A3A' }}>Liquidity Percentage Warning</WarningTitle>
          <WarningSubTitle color="#1A1A3A" style={{ opacity: '0.7' }}>
            This sale has a very low liquidity percentage.
          </WarningSubTitle>
        </LiquidityFlex>
      </FlexWrapper>
      <TokenPresaleBody>
        <TokenPresaleContainder toggled={menuToggled}>
          <MainCardWrapper>
            <TokenContainer>
              <img src={tokenData && (tokenData.logo_link === "" ? DefaultLogoIcon : tokenData.logo_link)} width="64px" height="64px" alt="token icon" />
              <TokenSymbolWrapper>
                <TokenSymbol>{tokenData && tokenData.token_symbol}</TokenSymbol>
                <TokenName>{tokenData && tokenData.token_name}</TokenName>
              </TokenSymbolWrapper>
            </TokenContainer>
            <TokenDescription>
              <Text fontSize="14px" textAlign="left" color="white">
                ${tokenData && tokenData.token_symbol} is a new reflection protocol on the Binance Smart Chain with a
                deflationary burn mechanism that offers reflections to holders with 0% buy and sell tax.
              </Text>
            </TokenDescription>
            <TokenAddressContainer>
              <AddressFlex>
                <AddressWrapper>
                  <Text color="white" bold>
                    Presale Address:
                  </Text>
                  <Text>{presaleAddress}</Text>
                </AddressWrapper>
                <AddressWrapper>
                  <Text color="white" bold>
                    Token Address:
                  </Text>
                  <Text>{tokenData && tokenData.token_address}</Text>
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
                <WhitelistTitle mb="16px">Whitelist {isWhiteList ? 'Enabled' : 'Public'} Sale</WhitelistTitle>
                <WhitelistSubText mb="28px">
                  {isWhiteList
                    ? 'Only Whitelisted Wallets can Purchase This Token!'
                    : 'Anybody can Purchase This Token!'}
                </WhitelistSubText>
                {isWhiteList && whiteList1 && <Text>Your wallet address is on the whitelist1!</Text>}
                {isWhiteList && whiteList2 && <Text>Your wallet address is on the whitelist2!</Text>}
                {isWhiteList && !whiteList1 && !whiteList2 && (
                  <WalletAddressError>
                    <img src={WarningIcon} alt="nuclear icon" />
                    <Text>Your wallet address is not whitelisted</Text>
                  </WalletAddressError>
                )}
              </WhitelistCard>
              <WhitelistCard>
                {!presaleStatus ? (
                  !failedSale ? (
                    <>
                      <WhitelistTitle>
                        Raised: {raise}/{tokenData?.hard_cap}
                      </WhitelistTitle>
                      <ProgressBarWrapper>
                        <ProgressBar>
                          <Progress state={(raise / tokenData?.hard_cap) * 100} />
                        </ProgressBar>
                      </ProgressBarWrapper>
                      <TokenRateView>
                        <Text fontSize="14px" fontWeight="600" color="white" textAlign="left">
                          1 BNB = {tokenData && tokenData.tier3} {tokenData && tokenData.token_symbol}{' '}
                        </Text>
                      </TokenRateView>
                      <ContributeFlex>
                        <InputWrapper>
                          <input placeholder="" onChange={handlerChange} />
                        </InputWrapper>
                        <ColorButton onClick={handleComponent}>Contribute</ColorButton>
                      </ContributeFlex>
                      <Flex alignItems="center" style={{ width: '100%' }}>
                        <StopwatchIcon />
                        <Text fontSize="13px" fontWeight="600" style={{ margin: '0 10px' }}>
                          {privateSale1
                            ? 'Private sale 1 ends in'
                            : privateSale2
                              ? 'Private sale 2 ends in'
                              : 'Public sale ends in'}{' '}
                        </Text>
                        <TimerComponent
                          time={
                            tokenData && privateSale1
                              ? tokenData?.tier1_time
                              : privateSale2
                                ? tokenData?.tier2_time
                                : tokenData?.end_time
                          }
                        />
                      </Flex>
                      <UnderLine />
                    </>
                  ) : (
                    <>
                      <Text textAlign="left" fontSize="12px" fontWeight="500" color="white">
                        This presale has failed!
                      </Text>
                      <Text textAlign="left" fontSize="12px" fontWeight="500" mt="16px" color="white">
                        If you participated in the presale click the claim button below to claim your BNB!
                      </Text>
                      <ColorButton
                        style={{ width: '100%' }}
                        mt="16px"
                        mb="16px"
                        onClick={handleClaimToken}
                        disabled={isClaimed}
                      >
                        Claim BNB
                      </ColorButton>
                    </>
                  )
                ) : (
                  <>
                    <Text textAlign="left" fontSize="14px" fontWeight="500" color="white">
                      This presale has ended. Go back to the dashboard to view others!
                    </Text>
                    {/* <Link external href="https://pancakeswap.finance/swap" style={{ width: '100%' }}>
                      <DarkButton style={{ width: '100%', textDecoration: 'none' }} mt="16px">
                        Trade on PancakeSwap
                      </DarkButton>
                    </Link> */}
                    <DarkButton onClick={toSphynxSwap} style={{ width: '100%' }} mt="16px">
                      Trade on SphynxSwap
                    </DarkButton>
                    <Text textAlign="left" fontSize="14px" fontWeight="500" mt="16px" color="white">
                      If you participated in the presale click the claim button below to claim your tokens!
                    </Text>
                    <ColorButton
                      style={{ width: '100%' }}
                      mt="16px"
                      mb="16px"
                      onClick={handleClaimToken}
                      disabled={isClaimed}
                    >
                      Claim Token
                    </ColorButton>
                  </>
                )}
                <TokenAmountView>
                  <Text fontSize="14px" fontWeight="600" color="white">
                    Your Contributed Account:
                  </Text>
                  <Text fontSize="14px" fontWeight="600" textAlign="center" color="#F2C94C">
                    {userContributeBNB}BNB
                  </Text>
                </TokenAmountView>
                <UnderLine />
                <TokenAmountView>
                  <Text fontSize="14px" fontWeight="600" color="white">
                    Your Reserved Tokens:
                  </Text>
                  <Text fontSize="14px" fontWeight="600" textAlign="center" color="#F2C94C">
                    {userContributeToken} {tokenData && tokenData.token_symbol}
                  </Text>
                </TokenAmountView>
                {!presaleStatus && !failedSale ? (
                  <>
                    <Separate />
                    <DarkButton onClick={handleEmergencyWithdraw}>Emergency Withdraw</DarkButton>
                  </>
                ) : (
                  ''
                )}
              </WhitelistCard>
            </FlexWrapper>
            <Separate />
            <ContributeWrapper>
              {PRESALE_DATA.map((item, index) =>
                index === PRESALE_DATA.length - 1 ? (
                  <DataLatestItem>
                    <Text>{item.presaleItem}</Text>
                    <Text>{item.presaleValue}</Text>
                  </DataLatestItem>
                ) : (
                  <DataItem>
                    <Text>{item.presaleItem}</Text>
                    <Text>{item.presaleValue}</Text>
                  </DataItem>
                ),
              )}
            </ContributeWrapper>
            <Separate />
            <SocialIconsWrapper>
              <Link external href={tokenData&&tokenData.website_link} aria-label="social2">
                <IconBox color="#710D89">
                  <SocialIcon2 width="15px" height="15px" />
                </IconBox>
              </Link>
              <Link external href={tokenData&&tokenData.github_link} aria-label="social2">
                <IconBox color="#3f4492">
                  <img src={GitIcon} alt='Git Logo' width="15px" height="15px" />
                </IconBox>
              </Link>
              <Link external href={tokenData&&tokenData.twitter_link} aria-label="twitter">
                <IconBox color="#33AAED">
                  <TwitterIcon width="15px" height="15px" />
                </IconBox>
              </Link>
              <Link external href={tokenData&&tokenData.reddit_link} aria-label="discord">
                <IconBox color="#2260DA">
                <img src={RedditIcon} alt='Git Logo' width="15px" height="15px" />
                </IconBox>
              </Link>
              <Link external href={tokenData&&tokenData.telegram_link} aria-label="telegram">
                <IconBox color="#3E70D1">
                  <TelegramIcon width="15px" height="15px" />
                </IconBox>
              </Link>
            </SocialIconsWrapper>
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
              <Link external href="https://discord.gg/ZEuDaFk4qz" aria-label="discord">
                <ColorButton style={{ width: '180px' }}>
                  Join Community
                </ColorButton>
              </Link>
            </ThinkCardWrapper>
          </SubCardWrapper>
        </TokenPresaleContainder>
      </TokenPresaleBody>
    </Wrapper>
  )
}

export default PresaleLive
