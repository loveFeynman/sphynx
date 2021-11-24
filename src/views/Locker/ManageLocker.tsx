import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, useMatchBreakpoints, Button } from '@sphynxswap/uikit'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import * as ethers from 'ethers'
import { ERC20_ABI } from 'config/abi/erc20'
import { isAddress } from '@ethersproject/address'
import Select, { OptionProps } from 'components/Select/Select'
import Slider from 'react-rangeslider'
import { DarkButtonStyle, ColorButtonStyle } from 'style/buttonStyle'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  p {
    line-height: 24px;
  }
  div.MuiTextField-root {
    margin-left: 16px;
    color: white !important;
    background: black;
    border-radius: 8px;
    padding: 10px 14px;
    height: 44px !important;
    border: none;
    outline: none;
    .MuiInput-underline:after {
      border: none !important;
    }
    input {
      color: white;
      width: 140px;
      font-size: 14px;
      margin-top: -3px;
    }
    button {
      color: white;
      margin-right: -15px;
      margin-top: -3px;
    }
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

const PageBody = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  p.description {
    text-align: left;
    margin-right: 20px;
    font-size: 14px;
  }
  p.w110{
    color: #A7A7CC;
  }
  p.w120{
    color: white;
  }
`

const MyInput = styled.input`
  width: 100%;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  border: 1px solid #4A5187;
  padding: 10px 14px;
  padding-inline-start: 12px;
  height: 38px;
  color: white;
  border: none;
  outline: none;
  &:focus {
    outline: 2px solid #8b2a9b99;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
`

const ControlStretch = styled(Flex) <{ isMobile?: boolean }>`
    height: 47px;
    margin: 12px 0;
    width: 100%;
    max-width: 1000px;
    background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
    > div {
        flex: 1;
        height: 47px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
        > div {
            border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
            height: 47px;
            background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
            > div {
                color: #A7A7CC;
            }
        }
  }
`

const ManageLocker: React.FC = () => {
  const { library } = useActiveWeb3React()
  const signer = library.getSigner()
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setName] = useState('')
  const [tokenSymbol, setSymbol] = useState('')
  const [totalSupply, setTotalSupply] = useState(0)
  const [unLock, setUnLock] = useState(new Date())
  const [logoLink, setLogoLink] = useState('')
  const [percent, setPercent] = useState(0)
  const [isApprove, setIsApprove] = useState(false)
  const options = [
    {
      label: t('No vesting, all tokens will be released at unlock time!'),
      value: 0,
    },
    {
      label: t('Vest twice (Unlock 50% tokens in 2 periods, 1 halfway and 1 at unlock time)'),
      value: 1,
    },
    {
      label: t('Vest four times (25% of your tokens are unlocked in 4 periods)'),
      value: 2,
    },
    {
      label: t('Vest five times'),
      value: 3,
    },
    {
      label: t('Vest ten times'),
      value: 4,
    },
    {
      label: t('Vest twenty times'),
      value: 5,
    },
    {
      label: t('Vest twenty-five times'),
      value: 6,
    },
    {
      label: t('Vest fifty times'),
      value: 7,
    },
    {
      label: t('Vest one-hundred times'),
      value: 8,
    },
  ]

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 25,
      label: '25',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 75,
      label: '75',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];

  const handleChange = async (e) => {
    const value = e.target.value
    setTokenAddress(value)
    const address = isAddress(value)
    if (address) {
      try {
        const abi: any = ERC20_ABI
        const tokenContract = new ethers.Contract(value, abi, signer)
        const name = await tokenContract.name()
        const symbol = await tokenContract.symbol()
        const decimals = await tokenContract.decimals()
        setName(name)
        setSymbol(symbol)
        setTotalSupply(decimals)
      } catch (err) {
        console.log('error', err.message)
      }
    }
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    console.log(option.value)
  }

  const handleChangePercent = (sliderPercent: number) => {
    setPercent(sliderPercent)
  }

  const valueLabelFormat = (value: number) => {
    return marks.findIndex((mark) => mark.value === value) + 1;
  }

  const valuetext = (value: number) => {
    return `${value}%`;
  }

  const handleApproveClick = () => {
    console.log("clicked approve")
  }

  const handleSubmitClick = () => {
    console.log("clicked submit")
  }

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <PageHeader>
          <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
            <Flex alignItems="center">
              <MainLogo width="80" height="80" />
              <Flex flexDirection="column" ml="10px">
                <WelcomeText>{t('SPHYNX LOCKERS/MANAGE')}</WelcomeText>
              </Flex>
            </Flex>
          </Flex>
        </PageHeader>
        <Sperate />
        <PageBody>
          <p className="description w110" style={{ marginBottom: '5px' }}>Token Address</p>
          <InlineWrapper>
            <MyInput onChange={handleChange} value={tokenAddress} style={{ maxWidth: '1000px' }} />
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <p className="description w110">Token Name:</p>
            <p className="description w120">{tokenName}</p>
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <p className="description w110">Token Symbol:</p>
            <p className="description w120">{tokenSymbol}</p>
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <p className="description w110">Total Supply:</p>
            <p className="description w120">{totalSupply}</p>
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <p className="description w110">UnLockup Time</p>
            <KeyboardDateTimePicker
              format="yyyy-MM-dd hh:mm:ss"
              value={unLock}
              onChange={(date, value) => setUnLock(date)}
            />
          </InlineWrapper>
          <Sperate />
          <p className="description w110" style={{ marginBottom: '5px' }}>
            Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif)
          </p>
          <InlineWrapper>
            <MyInput onChange={(e) => setLogoLink(e.target.value)} value={logoLink} style={{ maxWidth: '1000px' }} />
          </InlineWrapper>
          <Sperate />
          <InlineWrapper>
            <ControlStretch isMobile={isMobile}>
              <Select
                options={options}
                onChange={handleSortOptionChange}
              />
            </ControlStretch>
          </InlineWrapper>
          <Sperate />
          <p className="description w110">
            Select % of your Tokens to Lock
          </p>
          <Slider
            min={0}
            max={100}
            value={percent}
            onChange={(value) => handleChangePercent(Math.ceil(value))}
            name="lock"
            getAriaValueText={valuetext}
            aria-label="Always visible"
            valueLabelFormat={valueLabelFormat}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
          <Sperate />
          <InlineWrapper>
            <p className="description w110">Your Tokens to be Locked:</p>
            <p className="description w120">{totalSupply * percent / 100}/{totalSupply}</p>
          </InlineWrapper>
          <Sperate />
          <Button
            onClick={handleApproveClick}
            disabled={!isApprove}
            mr="20px"
            style={DarkButtonStyle}
          >
            {t('Approve')}
          </Button>
          <Button
            onClick={handleSubmitClick}
            style={ColorButtonStyle}
          >
            {t('Submit')}
          </Button>
          <Sperate />
          <Text color='#E93F33'>For tokens with special transfers burns, tax or other fees make sure the DxLock address is whitelisted(excludeFromFee) before you deposit or you won&apos;t be able to withdraw!
          </Text>
          <InlineWrapper style={{ justifyContent: 'center' }}>
            <p className="description w110">DxLock Address:</p>
            <p className="description w120">0xbB93f97fB792e9ebb81768d71a1b8998639cEA35</p>
          </InlineWrapper>
        </PageBody>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default ManageLocker
