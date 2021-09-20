/* eslint-disable */
import React from 'react'
import styled from 'styled-components'

import Nav from 'components/LotteryCardNav'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import DownArrow from 'assets/svg/icon/LotteryDownIcon.svg'
import PotContentTable from './PotContentTable'

const Container = styled.div<{ isDetail: boolean }>`
  width: 340px;
  // height:${(props) => !props.isDetail ? '420px' : '750px'} ;
  background-color: rgba(0,0,0,0.4);
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
  background: ${(props) => !props.isEnable ? 'rgb(233, 234, 235)' : '#8B2A9B'}  ;
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
  color: ${(props) => !props.isEnable ? '#aaaaaa' : 'white'};
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
  text-align: ${(props) => props.isLeft ? 'left' : 'right'};
  color: white;
  padding-bottom: 20px;
`
const GridItem = styled.div<{ isLeft: boolean }>`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: ${(props) => props.isLeft ? 'left' : 'right'};
  color: white;
  padding: 6px 0px;
`
export default function PrizePotCard({ isNext, setModal, roundID, lotteryInfo, lastLoteryInfo }) {
  const [totalCount, setTotalCount] = React.useState(0);
  const [showDetail, setShowDetail] = React.useState(false);
  const { t } = useTranslation();
  const [remainningTime, setRemainingTime] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const { account } = useWeb3React();

  React.useEffect(() => {
    setTotalCount(lastLoteryInfo?.amountCollectedInCake / 1000000000000000000);
  }, [lastLoteryInfo])

  React.useEffect(() => {
    if (lotteryInfo !== null) {
      const now = new Date();
      if ((new Date().getTime() / 1000) > lotteryInfo.endTime) {
        setEnabled(false);
      } else {
        const date = new Date(lotteryInfo.endTime * 1000 - now.getTime());
        const hours = ('0'.toString().concat((date.getUTCHours()).toString())).slice(-2);
        const minutes = ('0'.toString().concat(date.getUTCMinutes().toString())).slice(-2);
        setRemainingTime((hours.toString()).concat("h ").concat(minutes.toString()).concat("m"));
        setEnabled(true);
      }
    }

  }, [lotteryInfo, account, roundID]);

  return (
    <Container isDetail={showDetail}>
      <div style={{ display: 'flex', paddingTop: '25px', paddingLeft: '25px' }}>
        <img width="60px" height="57px" src={MainLogo} alt='Logo' />
        <div style={{ paddingTop: '8px' }}>
          <HeaderLabel>
            {isNext ? t('Next Draw in:') : t('Prize Pot')}
          </HeaderLabel>
          <HeaderLabel style={{ color: isNext && !enabled ? 'rgb(233, 234, 235)' : 'white' }}>
            {isNext ? enabled ? remainningTime : 'On sale soon' : `${totalCount} SPX`}

          </HeaderLabel>
        </div>
      </div>
      {!isNext && (
        <>
          <PotContentTable isDetail={false} lotteryInfo={lastLoteryInfo} />
          <ButtonWrapper isEnable style={{ margin: '10px 0' }} onClick={() => null}>
            {t(`Unlock Wallet`)}
          </ButtonWrapper>
          <SeperateLine />
          <Footer
            onClick={(e) => setShowDetail(!showDetail)}
          >
            {showDetail ? t('Hide') : t('Details')}
            <img style={{ marginLeft: '10px' }} src={DownArrow} alt='Logo' />
          </Footer>
        </>
      )}
      {isNext && (
        <div style={{ marginBottom: '30px' }}>
          <Flex>
            <Grid>
              <GridHeaderItem isLeft>
                {t('Ticket No')}
              </GridHeaderItem>
              <GridHeaderItem isLeft={false}>
                {t('Ticket Number')}
              </GridHeaderItem>
              <>
                <GridItem isLeft>
                  tickets
                </GridItem>
                <GridItem isLeft={false}>
                  ticket Numbers
                </GridItem>
              </>
            </Grid>
          </Flex>
          <ButtonWrapper isEnable={enabled} style={{ marginTop: '30px' }} onClick={() => {
            if (enabled)
              setModal();
          }}>
            {t(`Buy Now`)}
          </ButtonWrapper>
        </div>
      )}
      {showDetail && (<PotContentTable isDetail lotteryInfo={lastLoteryInfo} />)}
    </Container>
  )
}