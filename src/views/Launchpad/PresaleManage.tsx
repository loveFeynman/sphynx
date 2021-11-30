import 'date-fns'
import React, { useEffect, useState } from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Text, Button } from '@sphynxdex/uikit'
import { ReactComponent as CheckList } from 'assets/svg/icon/CheckList.svg'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import axios from 'axios'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useParams } from 'react-router'
import { getPresaleContract } from 'utils/contractHelpers'
import { getPresaleAddress } from 'utils/addressHelpers'
import * as ethers from 'ethers'
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

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  color: white;
  font-size: 14px;
  line-height: 20px;
`

const WhitelistTitle = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
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
  border-radius: 8px 0px 0px 8px;
  padding: 1px;
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

const DarkButton = styled(Button)`
  border-radius: 5px;
  border: none;
  height: 34px;
  font-size: 13px;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#191C41')};
  outline: none;
  color: white;
  width: 276px;
`

const PresaleManage: React.FC = () => {
  const { t } = useTranslation()
  const param: any = useParams()
  const { chainId, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const [logoLink, setLogoLink] = useState('')
  const [webSiteLink, setWebSiteLink] = useState('')
  const [gitLink, setGitLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [redditLink, setRedditLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [projectDec, setProjectDec] = useState('')
  const [updateDec, setUpdateDec] = useState('')
  const [certikAudit, setCertikAudit] = useState(false)
  const [doxxedTeam, setDoxxedTeam] = useState(false)
  const [utility, setUtility] = useState(false)
  const [kyc, setKYC] = useState(false)
  const [raise, setRaise] = useState(0)
  const [tokenData, setTokenData] = useState(null)
  const { toastSuccess, toastError } = useToast()
  const presaleContract = getPresaleContract(signer)
  const [presaleStatus, setPresaleStatus] = useState('')
  const [softCap, setSoftCap] = useState('')
  const [isDeposit, setIsDeposit] = useState(false)
  const [isFinalize, setIsFinalize] = useState(false)
  const [liquidityUnlocked, setUnlockedLiquidity] = useState(false)
  const [isWhiteList, setIsWhiteList] = useState(false)
  const [whitelist1, setWhitelist1] = useState('')
  const [whitelist2, setWhitelist2] = useState('')
  const [isWithDraw, setWithdraw] = useState(false)

  useEffect(() => {
    const isValue = !Number.isNaN(parseInt(param.saleId))
    if (isValue && chainId) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_API_URL2}/getPresaleInfo/${param.saleId}/${chainId}`)
        .then((response) => {
          if (response.data) {
            setTokenData(response.data)
            setLogoLink(response.data.logo_link)
            setWebSiteLink(response.data.website_link)
            setGitLink(response.data.github_link)
            setTelegramLink(response.data.telegram_link)
            setTwitterLink(response.data.twitter_link)
            setRedditLink(response.data.reddit_link)
            setProjectDec(response.data.project_dec)
            setUpdateDec(response.data.update_dec)
            setCertikAudit(response.data.certik_audit)
            setDoxxedTeam(response.data.doxxed_team)
            setUtility(response.data.utility)
            setKYC(response.data.kyc)
            setSoftCap(response.data.soft_cap)
          }
        })
    }
  }, [param.saleId, chainId])

  useEffect(() => {
    const fetchData = async () => {
      let temp = (await presaleContract.totalContributionBNB(param.saleId)).toString()
      const value = parseFloat(ethers.utils.formatUnits(temp, tokenData.decimal))
      setRaise(value)

      temp = await presaleContract.isDeposited(param.saleId)
      setIsDeposit(temp)

      const finalize = await presaleContract.presaleStatus(param.saleId)
      setIsFinalize(finalize)

      const liquidityLockTime = await presaleContract.liquidityLockTime(param.saleId)
      const isUnlocked = new Date().getTime() / 1000 > parseFloat(liquidityLockTime)
      setUnlockedLiquidity(isUnlocked)

      const whileListStatus = await presaleContract.iswhitelist(param.saleId)
      setIsWhiteList(whileListStatus)

      const withdrawFlag = await presaleContract.withdrawFlag(param.saleId)
      setWithdraw(withdrawFlag)
    }

    if (tokenData) {
      fetchData()
    }
  }, [presaleContract, tokenData, param.saleId])

  const handleDeposit = async () => {
    if (tokenData) {
      const abi: any = ERC20_ABI
      const tokenContract = new ethers.Contract(tokenData.token_address, abi, signer)
      const tx = await tokenContract.approve(getPresaleAddress(), '0xfffffffffffffffffffffffffffffffff')
      await tx.wait()
      const tx1 = await presaleContract.depositToken(param.saleId)
      await tx1.wait()
    }
  }

  const handleFinalize = async () => {
    const tx = await presaleContract.finalize(param.saleId)
    await tx.wait()
  }

  const handleWithdraw = async () => {
    const tx = await presaleContract.withdrawLiquidity(param.saleId)
    await tx.wait()
  }

  const enableWhiteList = async () => {
    const tx = await presaleContract.enablewhitelist(param.saleId, true)
    const receipt = await tx.wait()
    if (receipt.status === 1) {
      setIsWhiteList(true)
    }
  }

  const disableWhiteList = async () => {
    const tx = await presaleContract.enablewhitelist(param.saleId, false)
    const receipt = await tx.wait()
    if (receipt.status === 1) {
      setIsWhiteList(false)
    }
  }

  const enableWhiteList1 = async () => {
    const whitelists = whitelist1.split(',')
    const tx = await presaleContract.updatewhitelist(param.saleId, whitelists, '1')
    const receipt = await tx.wait()
  }

  const enableWhiteList2 = async () => {
    const whitelists = whitelist2.split(',')
    const tx = await presaleContract.updatewhitelist(param.saleId, whitelists, '2')
    const receipt = await tx.wait()
  }

  const handleUpdate = () => {
    const isValue = !Number.isNaN(parseInt(param.saleId))
    if (isValue) {
      const data: any = {
        chain_id: chainId,
        sale_id: param.saleId,
        logo_link: logoLink,
        website_link: webSiteLink,
        github_link: gitLink,
        twitter_link: twitterLink,
        reddit_link: redditLink,
        telegram_link: telegramLink,
        project_dec: projectDec,
        update_dec: updateDec,
        certik_audit: certikAudit,
        doxxed_team: doxxedTeam,
        utility,
        kyc,
      }

      axios.post(`${process.env.REACT_APP_BACKEND_API_URL2}/updatePresaleInfo`, { data }).then((response) => {
        if (response.data) {
          toastSuccess('Updated!', 'Your presale info is udpated successfully.')
        } else {
          toastError('Failed!', 'Your action is failed.')
        }
      })
    }
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
            <Title>Manage Sale</Title>
          </InlineWrapper>
          <Sperate />
          <Notification>Congratulations your presale is created successfully.</Notification>
          <Sperate />
          <p style={{ color: '#D91A00' }}>
            If your token contains special transfers such as burn, rebase or something else you must ensure the DxSale
            LP Router Address and the Presale Address are excluded from these features! Or you must set fees, burns or
            whatever else to be 0 or disabled for the duration of the presale and until the finalize button is clicked!
          </p>
          <Sperate />
          <Notification>
            DxSale LP Router Address: 0x7519f576E666cD80c83BEF74Bc6a390aDDfb8e1C
            <br />
            Presale Address: 0x919Ce88872737b49FB861E68BeC43880DA824E6b
            <br />
            - You must deposit the required number of tokens to the presale address to start the sale (Click the Deposit
            Tokens button below)
            <br />
            - The finalize button will become available once you hit your hard cap or presale time ends.
            <br />
            - Clicking the finalize button will list your token on PancakeSwap immediately. Listing will be done at the
            set PancakeSwap rate with liquidity locked by DxLock.
            <br />
            - Once finalized your BNB will be released to the creation wallet.
            <br />
            Here is a summary of your presale (more details on the presale page):
            <br />
          </Notification>
        </NoteWrapper>
        <Sperate />
        <ContentWrapper>
          <div style={{ marginTop: '24px', width: '100%', marginBottom: '24px' }}>
            <StepContainer>
              <InlineWrapper>
                <p className="description w110">Token Address</p>
                <MyInput
                  className="ml16"
                  value={tokenData && tokenData.token_address}
                  readOnly
                  style={{ width: '80%' }}
                />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Name</p>
                <MyInput className="ml16" value={tokenData && tokenData.token_name} readOnly style={{ width: '80%' }} />
              </InlineWrapper>
              <Sperate />
              <InlineWrapper>
                <p className="description w110">Token Symbol</p>
                <MyInput
                  className="ml16"
                  value={tokenData && tokenData.token_symbol}
                  readOnly
                  style={{ width: '80%' }}
                />
              </InlineWrapper>
              <Sperate />
              {/* <InlineWrapper>
                <p className="description w110">Status</p>
                <MyInput className="ml16" value={presaleStatus} readOnly style={{ width: '80%' }} />
              </InlineWrapper> */}
              <Sperate />
              <WhitelistTitle>
                Raised: {raise}/{tokenData && tokenData.hard_cap}
              </WhitelistTitle>
              <ProgressBarWrapper>
                <ProgressBar>
                  <Progress state={tokenData && (raise / tokenData.hard_cap) * 100} />
                </ProgressBar>
              </ProgressBarWrapper>
              <Sperate />
              {isFinalize ? (
                ''
              ) : !isWhiteList ? (
                <>
                  <DarkButton onClick={enableWhiteList}>Enable WhiteList</DarkButton>
                  <Sperate />
                </>
              ) : (
                <>
                  <DarkButton onClick={disableWhiteList}>Disable WhiteList</DarkButton>
                  <Sperate />
                  <MyInput
                    onChange={(e) => setWhitelist1(e.target.value)}
                    value={whitelist1}
                    style={{ width: '100%' }}
                  />
                  <Sperate />
                  <DarkButton onClick={enableWhiteList1}>Add WhiteList1</DarkButton>
                  <Sperate />
                  <MyInput
                    onChange={(e) => setWhitelist2(e.target.value)}
                    value={whitelist2}
                    style={{ width: '100%' }}
                  />
                  <Sperate />
                  <DarkButton onClick={enableWhiteList2}>Add WhiteList2</DarkButton>
                  <Sperate />
                </>
              )}
              {isDeposit ? (
                isFinalize ? (
                  raise >= parseFloat(softCap) ? (
                    <>
                      <DarkButton onClick={handleWithdraw} disabled={!liquidityUnlocked || isWithDraw}>
                        Withdraw Liquidity Token
                      </DarkButton>
                    </>
                  ) : (
                    ''
                  )
                ) : (
                  <ColorButton onClick={handleFinalize}>Finalize</ColorButton>
                )
              ) : (
                <ColorButton onClick={handleDeposit}>Deposit</ColorButton>
              )}
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
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w140">Certik audit</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    defaultValue={!certikAudit ? 1 : 0}
                    onChange={(option: any) => setCertikAudit(option.value)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w140">Doxxed team</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    defaultValue={!doxxedTeam ? 1 : 0}
                    onChange={(option: any) => setDoxxedTeam(option.value)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <FlexWrapper>
                <InlineWrapper>
                  <p className="description w140">Utility information</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    defaultValue={!utility ? 1 : 0}
                    onChange={(option: any) => setUtility(option.value)}
                  />
                </InlineWrapper>
                <MarginWrapper />
                <InlineWrapper>
                  <p className="description w140">KYC</p>
                  <Select
                    options={[
                      {
                        label: t('No'),
                        value: false,
                      },
                      {
                        label: t('Yes'),
                        value: true,
                      },
                    ]}
                    defaultValue={!kyc ? 1 : 0}
                    onChange={(option: any) => setKYC(option.value)}
                  />
                </InlineWrapper>
              </FlexWrapper>
              <Sperate />
              <ColorButton onClick={handleUpdate}>Update</ColorButton>
            </StepContainer>
          </div>
        </ContentWrapper>
      </MuiPickersUtilsProvider>
    </Wrapper>
  )
}

export default PresaleManage
