import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Container = styled.div`
  border-radius: 16px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
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
  text-align: ${(props) => props.isLeft ? 'left' : 'center'};
  color: white;
  padding: 6px 0px;
`

export default function PotContentTable() {
  
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
          {t('Mached')}
        </GridHeaderItem>
        <GridHeaderItem isLeft={false}>
          {t('Winners')}
        </GridHeaderItem>
        <GridHeaderItem isLeft={false}>
          {t('Amount')}
        </GridHeaderItem>
        {PrizeArray.map((item)=>(
          <>
            <GridItem isLeft>
              {item.number}
            </GridItem>
            <GridItem isLeft={false}>
              {item.tokens}
            </GridItem>
            <>
              <GridItem isLeft>
                <div style={{textAlign: 'right'}}>
                  {item.totalTokens} SPX
                  <div style={{fontSize: '12px'}}>
                    {item.eachTokens}{t(`each`)}
                  </div>
                </div>
              </GridItem>
            </>
          </>
        ))}
      </Grid>
    </Container>
  )
}