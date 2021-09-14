import React from 'react'
import styled from 'styled-components'

import {Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import  LinkIcon from 'assets/svg/icon/LinkYellow.svg'

import TicketContentTable from './TicketContentTable'

const Container = styled.div<{ isDetail: boolean }>`
  min-width: 340px;
  // height:${(props)=> !props.isDetail?'420px':'750px'} ;
  background-color: rgba(0,0,0,0.4);
  border-radius: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 340px;
  }
`

const ButtonWrapper = styled.div`
  background: #8B2A9B;
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
export default function TicketCard() {
  const [totalCount, setTotalCount] = React.useState(33432);
  const [showDetail, setShowDetail] = React.useState(false);
  const { t } = useTranslation();
  return (
    <Container isDetail={showDetail}>
      <div style={{display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text bold color='white' fontSize="24px">
          Ticket #12
        </Text>
        <Text bold color='white' fontSize="12px">
          Sep 28, 3pm UTC
        </Text>
      </div>
      <div style={{display: 'flex', padding: '4px 20px'}}>
        <img width= "60px" height= "57px" src={MainLogo} alt='Logo' />
        <div style={{margin: '8px'}}>
          <Text bold color='white' fontSize="16px">
            Winning Numbers:
          </Text>
          <Text bold color='white' fontSize="24px">
            1, 16, 8, 9, 3, 4
          </Text>
        </div>
      </div>
      <div style={{display: 'flex', padding: '4px 20px 32px'}}>
        <img width= "60px" height= "57px" src={MainLogo} alt='Logo' />
        <div style={{margin: '8px'}}>
          <Text bold color='white' fontSize="16px">
            Prize Pot:
          </Text> 
          <Text bold color='white' fontSize="24px">
            {totalCount} SPX
          </Text>
        </div>
      </div>
      <SeperateLine/>
      <TicketContentTable />
      <ButtonWrapper style={{ margin: '65px 20px 20px' }} onClick={() => null}>
        View your ticket
      </ButtonWrapper>
      <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '36px'}}>
        <Text bold fontSize="16px" mr="12px">
          View your BscScan
        </Text>
        <Link external href="https://pancakeswap.com">
          <img width= "12px" height= "12px" src={LinkIcon} alt='Logo' />
        </Link>
      </div>
    </Container>
  )
}