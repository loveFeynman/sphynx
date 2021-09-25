/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Text, Link, Flex, useModal } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import LinkIcon from 'assets/svg/icon/LinkYellow.svg'
import { useWeb3React } from '@web3-react/core'
import TicketContentTable from './TicketContentTable'
import moment from 'moment'
import ViewTickets from './ViewTickets'

const Container = styled.div<{ isDetail: boolean }>`
  min-width: 340px;
  // height:${(props) => (!props.isDetail ? '420px' : '750px')} ;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 340px;
  }
`

const ButtonWrapper = styled.div`
  background: #8b2a9b;
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
  color: white;
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
  margin: 0px 20px;
`
export default function TicketCard({ lastLoteryInfo, roundID }) {
  const [winningCards, setWinningCard] = React.useState([])
  const [totalCount, setTotalCount] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [onPresentSettingsModal] = useModal(<ViewTickets roundID={roundID} winningCards={winningCards} />)

  const [showDetail, setShowDetail] = React.useState(false)
  const { account } = useWeb3React()
  React.useEffect(() => {
    if (lastLoteryInfo !== null) {
      const arrayData = []
      for (let i = 1; i <= 6; i++) {
        arrayData.push(lastLoteryInfo.finalNumber.toString().charAt(i))
      }
      setWinningCard(arrayData)
      let price = ''
      const tokenprice = async () => {
        axios.get(`https://api.thesphynx.co/price/0x2e121ed64eeeb58788ddb204627ccb7c7c59884c`).then((response) => {
          price = response.data
        })
      }
      tokenprice()
      setTotalCount(
        (
          (lastLoteryInfo?.amountCollectedInCake * parseFloat(price)) /
          1000000000000000000 /
          1000000000000000000
        ).toFixed(5),
      )
      setEndTime(
        moment(new Date(parseInt(lastLoteryInfo?.endTime) * 1000).toString())
          .format('MMM d hh a')
          .toString()
          .concat(' UTC'),
      )
    }
  }, [lastLoteryInfo])

  const { t } = useTranslation()
  return (
    <Container isDetail={showDetail}>
      <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text bold color="white" fontSize="24px">
          {t('Round')} {roundID}
        </Text>
        <Text bold color="white" fontSize="12px">
          {endTime}
        </Text>
      </div>
      <div style={{ display: 'flex', padding: '4px 20px' }}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ margin: '8px' }}>
          <Text bold color="white" fontSize="16px">
            {t('Winning Numbers:')}
          </Text>
          <Flex>
            {winningCards.map((item) => (
              <Text bold color="white" fontSize="24px">
                {item === '' ? '?' : item},&nbsp;
              </Text>
            ))}
          </Flex>
        </div>
      </div>
      <div style={{ display: 'flex', padding: '4px 20px 32px' }}>
        <img width="60px" height="57px" src={MainLogo} alt="Logo" />
        <div style={{ margin: '8px' }}>
          <Text bold color="white" fontSize="16px">
            {t('Prize Pot:')}
          </Text>
          <Text bold color="white" fontSize="24px">
            {totalCount === 'NaN' || parseInt(totalCount) < 20 || totalCount === '' ? 'Calculating' : `${totalCount} $`}
          </Text>
        </div>
      </div>
      <SeperateLine />
      <TicketContentTable lastLoteryInfo={lastLoteryInfo} />
      <ButtonWrapper style={{ margin: '65px 20px 20px' }} onClick={() => onPresentSettingsModal()}>
        View your ticket
      </ButtonWrapper>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '36px' }}>
        <Text bold fontSize="16px" mr="12px">
          {t('View your BscScan')}
        </Text>
        <Link
          external
          href={'https://bscscan.com/address/'
            .toString()
            .concat(process.env.NODE_ENV !== 'production' ? '0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E' : account)}
        >
          <img width="12px" height="12px" src={LinkIcon} alt="Logo" />
        </Link>
      </div>
    </Container>
  )
}
