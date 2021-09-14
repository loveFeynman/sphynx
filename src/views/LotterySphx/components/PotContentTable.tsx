import React from 'react'
import styled from 'styled-components'

import Nav from 'components/LotteryCardNav'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'

const Container = styled.div`
  border-radius: 16px;
`

const Grid = styled.div`
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

export default function PotContentTable({isDetail}) {
  
  const PrizeArray =[
    {number: 6, tokens: 2 ,totalTokens: 4000 ,eachTokens: 2000},
    {number: 5, tokens: 72 ,totalTokens: 3120 ,eachTokens: 4.57},
    {number: 4, tokens: 421 ,totalTokens: 2104 ,eachTokens: 1.47},
    {number: 3, tokens: 1204 ,totalTokens: 320 ,eachTokens: 0.63},
    {number: 2, tokens: 1423 ,totalTokens: 202 ,eachTokens: .041},
  ]
  const { t } = useTranslation();
  return (
    <Container>
       <Grid>
        <GridHeaderItem isLeft>
          {t('No. Mached')}
        </GridHeaderItem>
        <GridHeaderItem isLeft={false}>
          {t('Player Matched')}
        </GridHeaderItem>
        {PrizeArray.map((item)=>(
          <>
            <GridItem isLeft>
              {item.number}
            </GridItem>
            {isDetail? (
            <>
              <GridItem isLeft>
                <div style={{textAlign: 'right'}}>
                  {item.totalTokens} SPX
                  <div  style={{fontSize: '12px'}}>
                    {item.eachTokens} {t('each')}
                  </div>
                </div>
              </GridItem>
            </>
            ):(
              <GridItem isLeft={false}>
                {item.tokens}
              </GridItem>
            )}
          </>
        ))}
      </Grid>
    </Container>
  )
}