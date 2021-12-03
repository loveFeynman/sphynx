import 'date-fns'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Button } from '@sphynxdex/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import axios from 'axios'
import { getFairLaunchContract } from 'utils/contractHelpers'
import { ReactComponent as CheckList } from 'assets/svg/icon/CheckList.svg'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'

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
  p.w140 {
    width: 140px;
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
  justify-content: start;
  & > div > div {
    background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  }
  & > div.MuiFormControl-root {
    background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  }
`

const MyInput = styled.input`
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  border-radius: 5px;
  border: 1px solid #4a5187;
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

const StepContainer = styled.div`
  max-width: 1000px;
`

const Notification = styled.p`
  color: white;
  font-size: 14px;
  line-height: 20px;
`

const ColorButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: linear-gradient(90deg, #610d89 0%, #c42bb4 100%);
  outline: none;
  color: white;
  width: 176px;
`

const FairLaunchManage: React.FC = () => {
  const { t } = useTranslation()
  const param: any = useParams();
  const { library } = useActiveWeb3React()
  const signer = library.getSigner()
  const [launchData, setLaunchData] = useState({})
  const { chainId } = useWeb3React()
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [launchTime, setLaunchTime] = useState('');
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [isLaunched, setIsLaunched] = useState(false)
  const [launchStatus, setLaunchStatus] = useState('');
  const [routerAddress, setRouterAddress] = useState('');
  const [isClickedCancel, setIsClickedCancel] = useState(false);
  const [isAvailableLaunch, setIsAvailableLaunch] = useState(false);
  const [successfulLaunched, setSuccessfulLaunched] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isWithdrawToken, setIsWithdrawToken] = useState(false);
  const [isWithdrawBNB, setIsWithdrawBNB] = useState(false);
  const { toastSuccess, toastError } = useToast()

  const fairLaunchContract = useMemo(() => getFairLaunchContract(signer), [signer])

  const handleCancelLaunch = () => {
    fairLaunchContract.calcel(parseInt(param.launchId))
    .then(response => {
      setIsClickedCancel(true)
      setIsCanceled(true);
    })
  }

  const handleWithdrawToken = () => {
    fairLaunchContract.tokenWithdraw(parseInt(param.launchId))
    .then(response => {
      setIsWithdrawToken(true)
    })
  }

  const handleWithdrawBNB = () => {
    fairLaunchContract.nativeCurrencyWithdraw(parseInt(param.launchId))
    .then(response => {
      setIsWithdrawBNB(true)
    })
  }

  const handleLaunchToken = () => {
    const fee = ethers.utils.parseEther('0.00001')
    fairLaunchContract.launch(parseInt(param.launchId), { value: fee })
    .then(response => {
      setIsLaunched(true)
    })
  }

  const handleUpdateInfo = () => {
    const data = {
      ...launchData,
      logo_link: logoLink,
      website_link: webSiteLink,
      github_link: gitLink,
      twitter_link: twitterLink,
      reddit_link: redditLink,
      telegram_link: telegramLink,
      project_dec: projectDec,
      update_dec: updateDec
    }
    axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/updateFairLaunchInfo`, data).then((response) => {
      if (response.data) {
        toastSuccess('Pushed!', 'Your fairlaunch info is saved successfully.')
      } else {
        toastError('Failed!', 'Your action is failed.')
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const now = Math.floor(new Date().getTime() / 1000)
      let item = '';
      if (parseInt(launchTime) > now) {
        item = 'Upcoming'
        setIsAvailableLaunch(false)
      } else if (isLaunched) {
        item = 'Success'
      } else if (now > parseInt(launchTime) && now < parseInt(launchTime) + 600) {
        item = 'Active';
        setIsAvailableLaunch(true)
      } else {
        item = 'Failed'
        setIsAvailableLaunch(false)
      }
      setLaunchStatus(item)
      fairLaunchContract.isCanceled(parseInt(param.launchId))
      .then(response => {
        setIsCanceled(response);
      })

      fairLaunchContract.withdrawToken(parseInt(param.launchId))
      .then(response => {
        setIsWithdrawToken(response);
      })

      fairLaunchContract.withdrawNativeCurrency(parseInt(param.launchId))
      .then(response => {
        setIsWithdrawBNB(response);
      })

      fairLaunchContract.isLaunched(parseInt(param.launchId))
      .then(response => {
        setIsLaunched(response);
      })
    }

    fetchData()
    // const interval = setInterval(() => {
    //   checkAvaiableLaunch();
    // }, 1000);
    // return () => clearInterval(interval);
  }, [launchTime, fairLaunchContract, isLaunched, param.launchId])

  useEffect(() => {
    (async function fetchData() {
      const RetrieverDataProcess = async () => {
        const launchId = param.launchId;
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getFairLaunchInfo/${launchId}/${chainId}`)
        .then(response => {
          const data = response.data;
          setLaunchData(data)
          if(data) {
            setLogoLink(data.logo_link)
            setWebSiteLink(data.website_link)
            setGitLink(data.github_link)
            setTwitterLink(data.twitter_link)
            setTelegramLink(data.telegram_link)
            setRedditLink(data.reddit_link)
            setProjectDec(data.project_dec)
            setUpdateDec(data.update_dec)
            setTokenName(data.token_name)
            setTokenSymbol(data.token_symbol)
            setTokenAddress(data.token_address)
            setLaunchTime(data.launch_time)
          }
          const fetchContractData = async () => {
            const isLaunchedFromContract = await fairLaunchContract.isLaunched(launchId.toString())
            const routerAddressFromContract = await fairLaunchContract.router(launchId.toString())
            setIsLaunched(isLaunchedFromContract)
            setRouterAddress(routerAddressFromContract);
          }

          fetchContractData();
        })
      }
      await RetrieverDataProcess();
    })();
  }, [param, chainId, fairLaunchContract])

  return (
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <LogoTitle>
          <CheckList /> Manage FairLaunch
        </LogoTitle>
        <Sperate />
        <NoteWrapper>
          <InlineWrapper>
            <Title>Manage settings for your existing fair launch!</Title>
          </InlineWrapper>
          <Sperate />
          <Notification>Congratulations your Fair Launch is scheduled!</Notification>
          <Sperate />
          <p style={{ color: '#D91A00' }}>
            If your token contains special transfers such as burn, rebase or something else you must ensure the SphynxSwap
            Router Address is excluded from these features! Or you must set fees, burns or
            whatever else to be 0 or disabled for the duration of the presale and until the finalize button is clicked!
          </p>
          <Sperate />
          <Notification>
            SphynxSwap Router Address: {routerAddress}
            <Sperate />
            - The launch button will become available once your listing countdown ends.
            <br />
            - You must list your token within 10 minutes of this time or your launch will fail!
            <br />
            - Clicking the launch button will list your token on PancakeSwap immediately. Liquidity will be locked by SphynxLock.
            <Sperate />
            Here is a summary of your fair launch (more details on the fair launch view page):
          </Notification>
          <Sperate />
          <Notification>Name: {tokenName}</Notification>
          <Notification>Symbol: {tokenSymbol}</Notification>
          <Notification>Token Address: {tokenAddress}</Notification>
          <Notification>Status: {launchStatus} Launch</Notification>
          <Sperate />
          {
            isCanceled ?
            (
              <>  
                <Button disabled={isWithdrawToken} mr="20px" mt="20px" onClick={handleWithdrawToken}>
                  WITHDRAW TOKEN
                </Button>
                <Button disabled={isWithdrawBNB} mt="20px" onClick={handleWithdrawBNB}>
                  WITHDRAW BNB
                </Button>
              </>
            ) 
            : 
            isLaunched ? 
            <Notification> Successful Launched! </Notification>
            :
            (
              <>  
                {/* <Button disabled={!isAvailableLaunch} onClick={handleLaunchToken} mr="20px" mt="20px"> */}
                <Button disabled={!isAvailableLaunch} onClick={handleLaunchToken} mr="20px" mt="20px">
                  LAUNCH TOKEN
                </Button>
                <Button mt="20px" onClick={handleCancelLaunch}>
                  CANCEL LAUNCH
                </Button>
              </>
            )
          }
          <Sperate />
          <Notification>If you have trouble with launching please ensure the required addresses are whitelisted or your special transfer functions are disabled!</Notification>
          <Notification>If you still cannot launch then please cancel your sale and test your contract throughly on our supported test nets!</Notification>
        </NoteWrapper>
        <Sperate />
        <ContentWrapper>
          <div style={{ marginTop: '24px', width: '100%', marginBottom: '24px' }}>
            <StepContainer>
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
              <ColorButton onClick={handleUpdateInfo}>Update</ColorButton>
            </StepContainer>
          </div>
        </ContentWrapper>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default FairLaunchManage
