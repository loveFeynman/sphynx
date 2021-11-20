import 'date-fns'
import React, { useState } from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ReactComponent as BellIcon } from 'assets/svg/icon/Bell.svg'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import { ReactComponent as CheckList } from 'assets/svg/icon/CheckList.svg'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'

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

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  & > *:first-child {
    margin-right: 16px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 36px;
    line-height: 42px;
  }
`

const Sperate = styled.div`
  margin-top: 32px;
`

const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
`

const NoteWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
  color: white;
  padding-left: 12px;
  padding-right: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 48px;
    padding-right: 48px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  p.description {
    font-size: 14px;
  }
`

const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const CardWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border: 1px solid #21214a;
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  height: max-content;
  h3 {
    font-size: 30px;
    text-align: center;
  }
`

const NumberWrapper = styled.div`
  background: linear-gradient(90deg, #610D89 0%, #C42BB4 100%);
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`

const FeeWrapper = styled.div`
  margin-left: 16px;
  display: flex;
  flex-flow: column;
  font-weight: 700;
  max-width: 1080px;
  & > p {
    line-height: 36px;
    & > span {
      color: #f2c94c;
      margin-left: 8px;
    }
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-flow: row;
    flex-grow: 1;
    justify-content: space-around;
  }
`

const VerticalSperator = styled.div`
  width: 0px;
  height: 0px;
  ${({ theme }) => theme.mediaQueries.xl} {
    border-right: 1px solid #ffffff12;
    height: 36px;
  }
`

const FeeCard = () => {
    return (
        <CardWrapper>
            <MainLogo style={{ width: '60px', height: '60px' }} />
            <Sperate />
            <FeeWrapper>
                <p>
                    Current Fee: <span>1BNB</span>
                </p>
                <VerticalSperator />
                <p>
                    Tokens Sold: <span>2%</span>
                </p>
                <VerticalSperator />
                <p>
                    BNB Raised: <span>2%</span>
                </p>
            </FeeWrapper>
        </CardWrapper>
    )
}

const MyInput = styled.input`
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

const LineBtn = styled.button`
  height: 35px;
  background: ${({ theme }) => (theme.isDark ? '#222341' : '#1A1A3A')};
  width: 125px;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  border: none;
  &:hover {
    background: #3A3A5A;
  }
  &:disabled {
    background: #777;
    border: 1px solid #444;
  }
`
const FillBtn = styled.button`
  height: 35px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  width: 125px;
  border: 1px solid #8b2a9b;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  &:hover {
    background: linear-gradient(90deg, #722da9 0%, #e44bd4 100%);
    border: 1px solid #9b3aab;
  }
  &:disabled {
    background: linear-gradient(90deg, #222 0%, #fff 100%);
    border: 1px solid #444;
  }
`

const StepContainer = styled.div`
  max-width: 1000px;
`

const Notification = styled.p`
  color: #777;
  font-size: 14px;
  line-height: 20px;
`

const WarningPanel = styled.div`
  background: #fa899e;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  color: white;
  font-size: 14px;
`

const NumberMark = ({ number }) => {
    return <NumberWrapper>{number}</NumberWrapper>
}

const PresaleEdit: React.FC = () => {
    const { account } = useWeb3React()
    const [logoLink, setLogoLink] = useState('')
    const [webSiteLink, setWebSiteLink] = useState('')
    const [gitLink, setGitLink] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [redditLink, setRedditLink] = useState('')
    const [telegramLink, setTelegramLink] = useState('')
    const [projectDec, setProjectDec] = useState('')
    const [updateDec, setUpdateDec] = useState('')
    const { toastSuccess, toastError } = useToast()

    const validate = () => {
        const data: any = {
            own_address: account,
            logo_link: logoLink,
            website_link: webSiteLink,
            github_link: gitLink,
            twitter_link: twitterLink,
            reddit_link: redditLink,
            telegram_link: telegramLink,
            description: projectDec,
            extra: updateDec,

        }

        axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/updatePresaleInfo`, { data }).then((response) => {
            toastSuccess('Updated!', 'Your presale info is udpated successfully.')
        })
    }

    return (
        <Wrapper>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <LogoTitle>
                    <CheckList /> Create/Manage Presale
                </LogoTitle>
                <Sperate />
                <NoteWrapper>
                    <InlineWrapper>
                        <Title>Create Sale</Title>
                    </InlineWrapper>
                    <Sperate />
                    <Notification>Get started in just a few simple steps!</Notification>
                    <Sperate />
                    <Notification>
                        This process is entirely decentralized, we cannot be held reponsible for incorrect entry of information or
                        be held liable for anything related to your use of our platform. Please ensure you enter all your details to
                        the best accuracy possible and that you are in compliance with your local laws and regulations. If your
                        local laws require KYC and AML please use the security menu option to first KYC your account!
                    </Notification>
                    <Sperate />
                    <p style={{ color: '#D91A00' }}>
                        For tokens with burns, rebase or other special transfers please ensure you have a way to whitelist multiple
                        addresses or turn off the special transfer events (By setting fees to 0 for example for the duration of the
                        presale)
                    </p>
                    <Sperate />
                    <WarningPanel>
                        <BellIcon style={{ flexShrink: 0.3 }} />
                        <p className="ml16">
                            For tokens with burns, rebase or other special transfers please ensure you have a way to whitelist
                            multiple addresses or turn off the special transfer events (By setting fees to 0 for example for the
                            duration of the presale)
                        </p>
                    </WarningPanel>
                </NoteWrapper>
                <Sperate />
                <ContentWrapper>
                    <FeeCard />
                    <div style={{ marginTop: '24px', width: '100%', marginBottom: '24px' }}>
                        <StepContainer>
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
                                <FillBtn className="ml16" onClick={validate}>
                                    save
                                </FillBtn>
                            </InlineWrapper>
                        </StepContainer>
                    </div>
                </ContentWrapper>
            </MuiPickersUtilsProvider>
        </Wrapper>
    )
}

export default PresaleEdit
