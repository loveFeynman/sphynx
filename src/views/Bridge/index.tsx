import React from 'react'
import styled from 'styled-components'

import CardNav from 'components/CardNav'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import BridgeCard from './components/BridgeCard'

const Grid = styled.div`
  justify-content: center;
  padding-top: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(4, auto);
  }
`

export default function Bridge() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="white" mb="24px">
          {t('Bridge')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Transfer funds to other Blockchain Networks')}
        </Heading>
      </PageHeader>
      <Grid>
        <BridgeCard label="Sphynx To Bridge" isSpynx/>
        <BridgeCard label="Other Tokens To Bridge" isSpynx = {false}/>
      </Grid>
    </>
  )
}