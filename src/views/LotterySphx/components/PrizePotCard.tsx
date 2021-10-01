/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import Nav from 'components/LotteryCardNav'
import { Image, Heading, RowType, Toggle, Text, Button, useModal, Flex } from '@sphynxswap/uikit'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { AppState } from '../../../state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import DownArrow from 'assets/svg/icon/LotteryDownIcon.svg'
import PotContentTable from './PotContentTable'
import { claimTickets } from '../../../hooks/useLottery'
import { Spinner } from './Spinner'
import { getTokenPrice } from 'state/info/ws/priceData'
import { simpleRpcProvider } from 'utils/providers'
import ViewTickets from './ViewTickets'
import useToast from 'hooks/useToast'

const Container = styled.div<{ isDetail: boolean }>`
  width: 340px;
  // height:${(props) => (!props.isDetail ? '420px' : '750px')} ;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 340px;
  }
`
const HeaderLabel = styled.div`
  font-family: Raleway;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  margin: 0px 0px 5px 9px;
`

const ButtonWrapper = styled.div<{ isEnable: boolean }>`
  background: ${(props) => (!props.isEnable ? 'rgb(233, 234, 235)' : '#8B2A9B')};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => (!props.isEnable ? '#aaaaaa' : 'white')};
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
    border-radius: 10px;
  }
`
const SeperateLine = styled.div`
  border-bottom: 1px solid #ffffff;
`
const Footer = styled.div`
  display: flex;
  color: white;
  padding: 17.5px 0px;
  justify-content: center;
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(4, auto);
  padding: 20px 20px 0px 20px;
`
const GridHeaderItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => (props.isLeft ? 'left' : 'right')};
  color: white;
  padding: 6px 0px;
`

export default function PrizePotCard({
  isNext,
  setModal,
  roundID,
  lotteryInfo,
  lastLoteryInfo,
  userTicketInfos,
  winningCards,
}) {
  const [totalCount, setTotalCount] = React.useState('')
  const [showDetail, setShowDetail] = React.useState(false)
  const { t } = useTranslation()
  const [remainningTime, setRemainingTime] = React.useState('')
  const [enabled, setEnabled] = React.useState(false)
  const [isClaimable, setClaimable] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)
  const { account, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const [toastMessage, setToastMessage] = React.useState({
    title: '',
    message: '',
  })
  const { toastSuccess, toastError } = useToast()
  const [onPresentViewTicketModal] = useModal(<ViewTickets roundID={roundID} winningCards={winningCards} />)


  React.useEffect(() => {
    if (toastMessage.title !== '' && toastMessage.title.includes('Error')) {
      toastError(t(toastMessage.title), t(toastMessage.message))
    }
    if (toastMessage.title !== '' && toastMessage.title.includes('Success')) {
      toastSuccess(t(toastMessage.title), t(toastMessage.message))
    }
    if (toastMessage.title !== '') {
      setToastMessage({
        title: '',
        message: '',
      })
    }
  }, [toastMessage])

  React.useEffect(() => {
    if (userTicketInfos?.length > 0) {
      userTicketInfos.map((item) => {
        if (item.status === true) {
          setClaimable(false)
        }
      })
    }
  }, [userTicketInfos])

  const handleClaimTickets = async () => {
    const ticketIDS = []
    const brackets = []
    userTicketInfos.map((ticket) => {
      let bracket = -1
      for (let i = 0; i <= 5; i++) {
        if (ticket.ticketnumber.charAt(6 - i) !== winningCards[5 - i]) {
          break
        }
        bracket = i
      }
      if (bracket >= 0) {
        ticketIDS.push(ticket.id)
        brackets.push(bracket)
      }
    })
    //account, roundID, ticketIds, brackets

    setLoading(true)
    await claimTickets(signer, roundID, ticketIDS, brackets, setToastMessage)
    setLoading(false)
  }

  React.useEffect(() => {
    if (lotteryInfo !== null) {
      const now = new Date()
      if (new Date().getTime() / 1000 > lotteryInfo.endTime) {
        setEnabled(false)
      } else {
        const date = new Date(lotteryInfo.endTime * 1000 - now.getTime())
        const hours = '0'.toString().concat(date.getUTCHours().toString()).slice(-2)
        const minutes = '0'.toString().concat(date.getUTCMinutes().toString()).slice(-2)
        setRemainingTime(hours.toString().concat('h ').concat(minutes.toString()).concat('m'))
        setEnabled(true)
      }

      axios.get(`https://thesphynx.co/api/price/0x2e121ed64eeeb58788ddb204627ccb7c7c59884c`).then((response) => {
        let price = response.data.price
        let _amountCollectedInSphynx = (lotteryInfo?.amountCollectedInSphynx / 10 ** 18).toString()
        let prizePot = (parseFloat(_amountCollectedInSphynx) * parseFloat(price)).toFixed(5)
        setTotalCount(prizePot)
      })
    }
  }, [lotteryInfo])

  return (
    <Container isDetail={showDetail}>
      <div style={{ display: 'flex', paddingTop: '25px', paddingLeft: '25px' }}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ paddingTop: '8px' }}>
          <HeaderLabel>{isNext ? t('Next Draw in:') : t('Prize Pot')}</HeaderLabel>
          <HeaderLabel style={{ color: isNext && !enabled ? 'rgb(233, 234, 235)' : 'white' }}>
            {isNext
              ? enabled
                ? remainningTime
                : 'On sale soon'
              : totalCount === 'NaN' || totalCount === ''
              ? 'Calculating'
              : `$${totalCount}`}
          </HeaderLabel>
        </div>
      </div>
      {!isNext && (
        <>
          <PotContentTable isDetail={false} lotteryInfo={lastLoteryInfo} />
          <ButtonWrapper isEnable style={{ margin: '10px 0' }} onClick={handleClaimTickets}>
            {t(`Claim Tickets`)}
          </ButtonWrapper>
          <SeperateLine />
          <Footer onClick={(e) => setShowDetail(!showDetail)}>
            {showDetail ? t('Hide') : t('Details')}
            <img style={{ marginLeft: '10px' }} src={DownArrow} alt="Logo" />
          </Footer>
        </>
      )}
      {isNext && (
        <div style={{ marginBottom: '30px' }}>
          <Flex style={{ flexDirection: 'column' }}>
            <Grid>
              <GridHeaderItem isLeft>{t('Ticket ID')}</GridHeaderItem>
              <GridHeaderItem isLeft={false}>{t('Ticket Number')}</GridHeaderItem>
            </Grid>
            <Flex
              style={{
                overflowY: 'scroll',
                maxHeight: '255px',
              }}
            >
              <Grid>
                {userTicketInfos?.map((it, index) => (
                  <React.Fragment key={index}>
                    <GridItem isLeft>{it.id}</GridItem>
                    <GridItem isLeft={false}>{it.ticketnumber.toString().slice(1, 7)}</GridItem>
                  </React.Fragment>
                ))}
              </Grid>
            </Flex>
          </Flex>
          <ButtonWrapper
            isEnable={enabled}
            style={{ marginTop: '30px' }}
            onClick={() => {
              if (enabled) setModal()
            }}
          >
            {t(`Buy Now`)}
          </ButtonWrapper>
          <ButtonWrapper isEnable={userTicketInfos.length > 0}style={{ marginTop: '20px' }} onClick={() => onPresentViewTicketModal()}>
            View your ticket
          </ButtonWrapper>
          {isClaimable && (
            <ButtonWrapper isEnable style={{ marginTop: '10px' }} onClick={handleClaimTickets}>
              {isLoading ? <Spinner /> : t(`Check Tickets`)}
            </ButtonWrapper>
          )}
        </div>
      )}
      {showDetail && <PotContentTable isDetail lotteryInfo={lastLoteryInfo} />}
    </Container>
  )
}
