import React from 'react'
import styled from 'styled-components'

import Nav from 'components/LotteryCardNav'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import  DownArrow from 'assets/svg/icon/LotteryDownIcon.svg'

import PotContentTable from './PotContentTable'

const Container = styled.div<{ isDetail: boolean }>`
  width: 340px;
  // height:${(props)=> !props.isDetail?'420px':'750px'} ;
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
`
const Footer = styled.div`
  display: flex;
  color: white;
  padding: 17.5px 0px;
  justify-content: center;
`
export default function PrizePotCard({isNext, setModal}) {
  const [totalCount, setTotalCount] = React.useState(33432);
  const [showDetail, setShowDetail] = React.useState(false);
  const { t } = useTranslation();
  return (
    <Container isDetail={showDetail}>
      <div style={{display: 'flex', paddingTop: '25px', paddingLeft: '25px'}}>
        <img width= "60px" height= "57px" src={MainLogo} alt='Logo' />
        <div style={{paddingTop: '8px'}}>
          <HeaderLabel>
            {isNext? t('Next Draw in:') : t('Prize Pot')}
          </HeaderLabel>
          <HeaderLabel>
            {isNext?'0h 43m': `${totalCount} SPX`}
            
          </HeaderLabel>
        </div>
      </div>
      {!isNext && (
        <>
          <PotContentTable isDetail={false}/>
          <ButtonWrapper style={{ margin: '10px 0' }} onClick={() => null}>
            {t(`Unlock Wallet`)}
          </ButtonWrapper>
          <SeperateLine/>
          <Footer 
            onClick={(e)=>setShowDetail(!showDetail)}
          >
            {showDetail? t('Hide') : t('Details')}
            <img style={{marginLeft: '10px'}} src={DownArrow} alt='Logo' />
          </Footer>
        </>
      )}
      {isNext && (
        <div style={{marginBottom: '30px'}}>
          <ButtonWrapper style={{ marginTop: '30px' }} onClick={setModal}>
            {t(`Buy Now`)}
          </ButtonWrapper>
        </div>
      )}
      {showDetail && (<PotContentTable isDetail/>)}
    </Container>
  )
}