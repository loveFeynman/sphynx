/* eslint-disable */
import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'contexts/Localization'

const Container = styled.div`
  border-radius: 16px;
`

const Grid = styled.div`
  display: grid;
  justify-content: space-between;
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
  padding-bottom: 20px;
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

export default function PotContentTable({ isDetail, lotteryInfo }) {
  const [latestInfoArray, setLastInfoArray] = React.useState([])
  React.useEffect(() => {
    const newArray = []
    if (lotteryInfo !== null) {
      for (let i = 6; i > 0; i--) {
        newArray.push({
          number: i,
          tokens:
            (parseInt(lotteryInfo?.sphynxPerBracket[i - 1]) / 10 ** 18) * lotteryInfo?.countWinnersPerBracket[i - 1],
          matchNumber: lotteryInfo?.countWinnersPerBracket[i - 1],
          eachTokens:
            lotteryInfo?.countWinnersPerBracket[i - 1] === '0'
              ? '0'
              : parseInt(lotteryInfo?.sphynxPerBracket[i - 1]) / 10 ** 18,
        })
      }
    }
    setLastInfoArray(newArray)
  }, [lotteryInfo])

  const { t } = useTranslation()

  return (
    <Container>
      <Grid>
        <GridHeaderItem isLeft>{t('No. Matched')}</GridHeaderItem>
        <GridHeaderItem isLeft={false}>{t('Player Matched')}</GridHeaderItem>
      </Grid>
      {latestInfoArray.map((item, key) => (
        <Grid style={{ width: '100%' }} key={key}>
          <GridItem isLeft>{item.number}</GridItem>
          {isDetail ? (
            <>
              <GridItem isLeft={false}>
                <div style={{ textAlign: 'right' }}>
                  {parseFloat(item.tokens).toFixed(5)} SPHYNX
                  <div style={{ fontSize: '12px' }}>
                    {parseFloat(item.eachTokens).toFixed(5)} {t(' each')}
                  </div>
                </div>
              </GridItem>
            </>
          ) : (
            <GridItem isLeft={false}>{item.matchNumber.toString()}</GridItem>
          )}
        </Grid>
      ))}
    </Container>
  )
}
