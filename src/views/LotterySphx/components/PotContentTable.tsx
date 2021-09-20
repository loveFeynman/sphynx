/* eslint-disable */
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

export default function PotContentTable({isDetail, lotteryInfo}) {

  const [latestInfoArray, setLastInfoArray] = React.useState([]);
  React.useEffect(()=>{
    const newArray=[];
    if (lotteryInfo !== null) {
      for (let i = 6; i >0;i--){
        newArray.push(
          {
            number: i, 
            tokens: parseInt(lotteryInfo?.cakePerBracket[i-1])/10000000000000000000 ,
            matchNumber: lotteryInfo?.countWinnersPerBracket[i-1] ,
            eachTokens: lotteryInfo?.countWinnersPerBracket[i-1] === '0'?'0': 
                      parseInt(lotteryInfo?.cakePerBracket[i-1])/10000000000000000000/lotteryInfo?.countWinnersPerBracket[i-1]
          }
        )
      }
    }  
    setLastInfoArray(newArray);
  }, [lotteryInfo])
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
        {latestInfoArray.map((item)=>(
          <>
            <GridItem isLeft>
              {item.number}
            </GridItem>
            {isDetail? (
            <>
              <GridItem isLeft>
                <div style={{textAlign: 'right'}}>
                  {item.tokens} SPX
                  <div  style={{fontSize: '12px'}}>
                    {item.eachTokens} {t('each')}
                  </div>
                </div>
              </GridItem>
            </>
            ):(
              <GridItem isLeft={false}>
                {item.matchNumber.toString()}
              </GridItem>
            )}
          </>
        ))}
      </Grid>
    </Container>
  )
}