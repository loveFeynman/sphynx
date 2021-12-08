import React from 'react';
import styled from 'styled-components'
import { Flex, Text } from '@sphynxdex/uikit'
import { useTranslation } from 'contexts/Localization'
import Card from 'components/Card'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import TokenSection from './components/TokenSection'

const Separate = styled.div`
  margin-top: 32px;
`

const Trending = () => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ height: 24 }} />
      <PageHeader>
        <Flex>
          <Flex flexDirection="column" ml="10px">
            <Text fontSize="26px" color="white" bold>
              {t('Trending')}
            </Text>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Card borderRadius="0 0 3px 3px" padding="20px 10px">
          <TokenSection tokenNumber={1} />
          <Separate />
          <TokenSection tokenNumber={2} />
          <Separate />
          <TokenSection tokenNumber={3} />
          <Separate />
          <TokenSection tokenNumber={4} />
          <Separate />
          <TokenSection tokenNumber={5} />
          <Separate />
          <TokenSection tokenNumber={6} />
          <Separate />
          <TokenSection tokenNumber={7} />
          <Separate />
          <TokenSection tokenNumber={8} />
          <Separate />
          <TokenSection tokenNumber={9} />
          <Separate />
          <TokenSection tokenNumber={10} />
          <Separate />
          <TokenSection tokenNumber={11} />
          <Separate />
          <TokenSection tokenNumber={12} />
          <Separate />
          <TokenSection tokenNumber={13} />
          <Separate />
          <TokenSection tokenNumber={14} />
          <Separate />
          <TokenSection tokenNumber={15} />
        </Card>
      </Page>
    </>
  )
}

export default Trending