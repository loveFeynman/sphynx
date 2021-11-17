import 'date-fns'
import React, { useState } from 'react'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ReactComponent as NoteIcon } from 'assets/svg/icon/NoteIcon.svg'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import * as ethers from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { isAddress } from '@ethersproject/address'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { ERC20_ABI } from 'config/abi/erc20'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin-top: 24px;
  text-align: left;
  .ml16 {
    margin-left: 16px;
  }
  .ml32 {
    margin-left: 32px;
  }
  p {
    line-height: 24px;
  }
  p.w110 {
    width: 110px;
  }
  p.w220 {
    width: 220px;
  }
  p.w80 {
    width: 80px;
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
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: flex-start;
  }
`

const LogoTitle = styled.h2`
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 36px;
    line-height: 42px;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  color: #de64ed;
  font-size: 24px;
  font-weight: 700;
`

const NoteWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? "#040413" : "#2A2E60")};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
  color: white;
  p {
    max-width: 724px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-flow: row-reverse;
  flex-wrap: wrap;
  p.description {
    font-size: 14px;
  }
  & > * {
    width: 95%;
    margin: 2.5%;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    & > *:first-child {
      width: 20%;
      margin: 1.5%;
    }
    & > *:nth-child(2) {
      width: 75%;
      margin: 1%;
    }
  }
`

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const MarginWrapper = styled.div`
  margin-top: 32px;
  margin-left: 0px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-top: 0px;
    width: 0%;
  }
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
  }
`

const CardWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? "#040413" : "#2A2E60")};
  border: 1px solid #21214a;
  padding: 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
  border-radius: 10px;
  height: max-content;
  h3 {
    font-size: 30px;
    text-align: center;
  }
`

const NumberWrapper = styled.div`
  background: rgba(189, 21, 229, 0.3);
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  color: #9c3bab;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`

const FeeCard = () => {
  return (
    <CardWrapper>
      <MainLogo />
      <Sperate />
      <p>Current Fee: 1BNB</p>
      <h3>+</h3>
      <p>2% of Tokens Sold</p>
      <h3>+</h3>
      <p>2% of BNB Raised</p>
    </CardWrapper>
  )
}

const MyInput = styled.input`
  background: ${({ theme }) => (theme.isDark ? '#040413' : '#2A2E60')};
  border-radius: 8px;
  padding: 10px 14px;
  height: 44px;
  color: white;
  border: none;
  outline: none;
  &:focus {
    outline: 2px solid #8B2A9B99;
  }
`

const LineBtn = styled.button`
  height: 35px;
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
  &:hover {
    color: #9b3aab;
    border: 1px solid #9b3aab;
  }
  &:disabled {
    color: #888;
    border: 1px solid #888;
  }
`
const FillBtn = styled.button`
  height: 35px;
  background: #8b2a9b;
  border: 1px solid #8b2a9b;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #9b3aab;
    border: 1px solid #9b3aab;
  }
  &:disabled {
    background: #888;
    border: 1px solid #888;
  }
`

const StepContainer = styled.div`
  max-width: 1000px;
`

const NumberMark = ({ number }) => {
  return <NumberWrapper>{number}</NumberWrapper>
}

const StepWrapper = ({ number, stepName, children, step, onClick }) => {
  return (
    <StepContainer>
      <InlineWrapper style={{ cursor: 'pointer' }} onClick={onClick}>
        <NumberMark number={number} />
        <Title style={{ color: 'white', marginLeft: '8px' }}>{stepName}</Title>
      </InlineWrapper>
      {parseInt(number) === step ? (
        <>
          <Sperate />
          {children}
        </>
      ) : (
        ''
      )}
    </StepContainer>
  )
}

const Presale: React.FC = () => {
  const { library } = useActiveWeb3React()
  const signer = library.getSigner()
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenName, setName] = useState('')
  const [tokenSymbol, setSymbol] = useState('')
  const [tokenDecimal, setDecimal] = useState('')
  const [presaleRate, setPresaleRate] = useState('')
  const [softCap, setSoftCap] = useState('')
  const [hardCap, setHardCap] = useState('')
  const [minBuy, setMinBuy] = useState('')
  const [maxBuy, setMaxBuy] = useState('')
  const [liquidityRate, setLiquidityRate] = useState('')
  const [listingRate, setListingRate] = useState('')
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [presaleStart, setPresaleStart] = useState(new Date())
  const [presaleEnd, setPresaleEnd] = useState(new Date())
  const [liquidityLock, setLiquidityLock] = useState(new Date())
  const [step, setStep] = useState(1)
  const { toastError } = useToast()

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
        setDecimal(decimals)
      } catch (err) {
        console.log('error', err.message)
      }
    }
  }

  const handleChangeRate = (e) => {
    setPresaleRate(e.target.value)
  }

  const validate = () => {
    if (!tokenAddress || !tokenName || !tokenSymbol) {
      toastError("Oops, we can not parse token data, please inpute correct token address!")
      setStep(1)
    }
    if (!parseFloat(presaleRate)) {
      toastError("Please input presale rate correctly!")
      setStep(2)
    }
    if (!parseFloat(softCap) || !parseFloat(hardCap)) {
      toastError("Please input soft cap & hard cap!")
      setStep(3)
    }
    if (parseFloat(softCap) * 2 > parseFloat(hardCap)) {
      toastError("Hard cap should be greater than 2 times about soft cap")
      setStep(3)
    }
    if (!parseFloat(minBuy) || !parseFloat(maxBuy)) {
      toastError("Please input contribution limit correctly!")
      setStep(4)
    }
    if (parseFloat(minBuy) >= parseFloat(maxBuy)) {
      toastError("Max buy amount should be greater than min buy amount!")
      setStep(4)
    }
    if (!parseFloat(liquidityRate) || parseFloat(liquidityRate) <= 50) {
      toastError("Liquidity amount should be more than 50%!")
      setStep(5)
    }
    if (!parseFloat(listingRate)) {
      toastError("Please input listing rate!")
      setStep(6)
    }

    if (new Date(presaleStart).getTime() <= (new Date().getTime() + 600000)) {
      toastError("Presale start time must be more than 10 minutes after now!")
      setStep(8)
    }
    if (new Date(presaleStart).getTime() >= new Date(presaleEnd).getTime() || (new Date(presaleStart).getTime() + 3600 * 1000 * 24 * 3) <= new Date(presaleEnd).getTime()) {
      toastError("Presale period must be less than 3 days!")
      setStep(8)
    }
    if (new Date(liquidityLock).getTime() <= (new Date(presaleEnd).getTime() + 30 * 24 * 3600 * 1000)) {
      toastError("Liquidity lock time must be more than 1 month from presale end time!")
      setStep(8)
    }
  }

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <LogoTitle>Create/Manage Presale</LogoTitle>
        <Sperate />
        <NoteWrapper>
          <InlineWrapper>
            <NoteIcon />
            <Title className="ml16">Create Sale</Title>
          </InlineWrapper>
          <Sperate />
          <p>Get started in just a few simple steps!</p>
          <Sperate />
          <p>
            This process is entirely decentralized, we cannot be held reponsible for incorrect entry of information or
            be held liable for anything related to your use of our platform. Please ensure you enter all your details to
            the best accuracy possible and that you are in compliance with your local laws and regulations.
          </p>
          <Sperate />
          <p>If your local laws require KYC and AML please use the security menu option to first KYC your account!</p>
          <Sperate />
          <p style={{ color: '#D91A00' }}>
            For tokens with burns, rebase or other special transfers please ensure you have a way to whitelist multiple
            addresses or turn off the special transfer events (By setting fees to 0 for example for the duration of the
            presale)
          </p>
        </NoteWrapper>
        <Sperate />
        <ContentWrapper>
          <FeeCard />
          <div>
            <StepWrapper number="1" stepName="Token Address" step={step} onClick={() => setStep(1)}>
              <p className="description">Enter your token Adderss</p>
              <MyInput onChange={handleChange} value={tokenAddress} style={{ width: '100%' }} />
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Name</p>
                <MyInput className="ml16" value={tokenName} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Symbol</p>
                <MyInput className="ml16" value={tokenSymbol} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Decimal</p>
                <MyInput className="ml16" value={tokenDecimal} readOnly />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn disabled>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(2)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="2" stepName="Presale Rate" step={step} onClick={() => setStep(2)}>
              <p className="description">Enter your Presale Rate/BNB</p>
              <MyInput onChange={handleChangeRate} value={presaleRate} style={{ width: '100%' }} />
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(1)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(3)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="3" stepName="Soft/Hard Cap" step={step} onClick={() => setStep(3)}>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w80">Soft Cap</p>
                  <MyInput className="ml16" onChange={(e) => setSoftCap(e.target.value)} value={softCap} />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w80">Hard Cap</p>
                  <MyInput className="ml16" onChange={(e) => setHardCap(e.target.value)} value={hardCap} />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(2)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(4)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="4" stepName="Contribution Limits" step={step} onClick={() => setStep(4)}>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w80">Min Buy</p>
                  <MyInput className="ml16" onChange={(e) => setMinBuy(e.target.value)} value={minBuy} />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w80">Max Buy</p>
                  <MyInput className="ml16" onChange={(e) => setMaxBuy(e.target.value)} value={maxBuy} />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(3)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(5)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="5" stepName="SphynxSwap Liquidity" step={step} onClick={() => setStep(5)}>
              <p className="description">
                Enter the percentage of raised funds that should be allocated to Liquidity on PancakeSwap (Min 51%, Max
                100%, We recommend &gt; 70%)
              </p>
              <MyInput
                onChange={(e) => setLiquidityRate(e.target.value)}
                value={liquidityRate}
                style={{ width: '100%' }}
              />
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(4)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(6)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="6" stepName="SphynxSwap Listing Rate" step={step} onClick={() => setStep(6)}>
              <p className="description">
                Enter the PancakeSwap listing price: (If I buy 1 BNB worth on PancakeSwap how many tokens do I get?
                Usually this amount is lower than presale rate to allow for a higher listing price on PancakeSwap)
              </p>
              <MyInput onChange={(e) => setListingRate(e.target.value)} value={listingRate} style={{ width: '100%' }} />
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(5)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(7)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="7" stepName="Additional Information" step={step} onClick={() => setStep(7)}>
              <p className="description">
                Please fill out the additional information below to display it on your presale. (Information in this
                section is optional, but a description and logo link is recommended) Note the information in this
                section can be updated at any time by the presale creator while the presale is active. Any links left
                blank will not be displayed on your sale.
              </p>
              <Sperate />
              <p className="description">
                Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif)
              </p>
              <MyInput onChange={(e) => setLogoLink(e.target.value)} value={logoLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Website Link</p>
              <MyInput onChange={(e) => setWebSiteLink(e.target.value)} value={webSiteLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">GitHub Link</p>
              <MyInput onChange={(e) => setGitLink(e.target.value)} value={gitLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Twitter Link</p>
              <MyInput onChange={(e) => setTwitterLink(e.target.value)} value={twitterLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Reddit Link</p>
              <MyInput onChange={(e) => setRedditLink(e.target.value)} value={redditLink} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Telegram Link</p>
              <MyInput
                onChange={(e) => setTelegramLink(e.target.value)}
                value={telegramLink}
                style={{ width: '100%' }}
              />
              <Sperate />
              <p className="description">Project Description</p>
              <MyInput onChange={(e) => setProjectDec(e.target.value)} value={projectDec} style={{ width: '100%' }} />
              <Sperate />
              <p className="description">Any update you want to provide to participants</p>
              <MyInput onChange={(e) => setUpdateDec(e.target.value)} value={updateDec} style={{ width: '100%' }} />
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(6)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(8)}>
                  Next
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="8" stepName="Timing" step={step} onClick={() => setStep(8)}>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Presale Start Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd hh:mm:ss"
                    value={presaleStart}
                    onChange={(date, value) => setPresaleStart(date)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w110">Presale End Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd hh:mm:ss"
                    value={presaleEnd}
                    onChange={(date, value) => setPresaleEnd(date)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w110">Liquidity Lockup Time</p>
                  <KeyboardDateTimePicker
                    format="yyyy-MM-dd hh:mm:ss"
                    value={liquidityLock}
                    onChange={(date, value) => setLiquidityLock(date)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <InlineWrapper>
                <LineBtn onClick={() => setStep(7)}>Back</LineBtn>
                <FillBtn className="ml16" onClick={() => setStep(9)}>
                  Finish
                </FillBtn>
              </InlineWrapper>
            </StepWrapper>
            <Sperate />
            <StepWrapper number="9" stepName="Finalize" step={step} onClick={() => setStep(9)}>
              <NoteWrapper style={{ maxWidth: 'unset' }}>
                <FlexWrapper>
                  <p className="description w220">Token Name</p>
                  <p className="description w220">{tokenName}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Token Symbol</p>
                  <p className="description w220">{tokenSymbol}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Presale Rate(Per BNB)</p>
                  <p className="description w220">{presaleRate}/BNB</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Soft/Hard Caps(BNB)</p>
                  <p className="description w220">Soft Cap: {softCap}</p>
                  <p className="description w220">Hard Cap: {hardCap}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Contribution Limits(BNB)</p>
                  <p className="description w220">Min: {minBuy}</p>
                  <p className="description w220">Max: {maxBuy}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">Presale Timings</p>
                  <p className="description w220">Starts: {presaleStart.toDateString()}</p>
                  <p className="description w220">Ends: {presaleEnd.toDateString()}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">SphynxSwap Liquidity</p>
                  <p className="description w220">{liquidityRate}</p>
                  <p className="description">Liquidity Locked: {liquidityLock.toDateString()}</p>
                </FlexWrapper>
                <Sperate />
                <FlexWrapper>
                  <p className="description w220">SphynxSwap Rate(Per BNB)</p>
                  <p className="description w220">{listingRate}</p>
                </FlexWrapper>
                <Sperate />
                <InlineWrapper>
                  <LineBtn onClick={() => setStep(1)}>Edit</LineBtn>
                  <FillBtn className="ml16" onClick={validate}>
                    Submit
                  </FillBtn>
                </InlineWrapper>
              </NoteWrapper>
            </StepWrapper>
          </div>
        </ContentWrapper>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default Presale