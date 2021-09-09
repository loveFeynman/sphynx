import React from 'react'
import styled from 'styled-components'
import Nav from 'components/LotteryCardNav'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import PrizePotCard  from './components/PrizePotCard'

const Grid = styled.div`
  justify-content: center;
  padding-top: 55px;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 12px;
`

const WinningCard= styled.div`
  width: 94px;
  height: 94px;
  background: #8B2A9B;
  border-radius: 24px;
  margin: 0px 36px;
`

export default function Lottery() {
  const winningCards=[1,16,8,9,3,4]
  const { t } = useTranslation();
  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="white" ml="-400px">
          {t('Lottery')}
        </Heading>
        <Heading scale="lg" color="text" ml="-400px">
          {t('Win Lottery if  2, 3, 4 of your ticket numbers matched')}
        </Heading>
      </PageHeader>
      <div>
        <Nav activeIndex={0} />
      </div>
      <div style={{display: 'flex',  justifyContent: 'center'}}>
        <div style={{marginRight: '10px'}}>
          <PrizePotCard isNext={false}/>
        </div>
        <div style={{marginLeft: '10px'}}>
          <PrizePotCard isNext/>
        </div>
      </div>
      <div style={{textAlign: 'center', margin: '88px 0px 76px 0px' }}>
        <Text fontSize="48px" color="white" style={{fontWeight: 700}}>How it works</Text>
        <div>
          <Text fontSize="16px">SpendSPX to buy tickets, contributing to the lottery </Text>
          <Text style={{marginLeft: '-20px'}}>pot. Win prizes if 2, 3, or 4 of your ticket numbers </Text>
          <Text>match the winning numbers and their exact order!</Text>
        </div>
      </div>
      <div 
        style={{
          textAlign: 'center', 
          margin: '88px 0px 76px 0px' , 
          background:'rgba(0, 0, 0, 0.4)', 
          borderRadius: '24px',
          paddingTop: '32px',
          paddingBottom: '42px',
      }}>
        <Text fontSize="36px" color="white" style={{fontWeight: 700}}>Latest Winning Numbers</Text>
        <div style={{display: 'flex', marginTop: '21px', justifyContent: 'center'}}>
          {winningCards.map((item)=>(
            <WinningCard>
              <Text fontSize="36px" color="white" style={{fontWeight: 700, padding: '26px'}}> {item}</Text>
            </WinningCard>
          ))}
        </div>
      </div>
    </>
  )
}