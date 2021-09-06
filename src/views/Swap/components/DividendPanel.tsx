import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from '@pancakeswap/uikit'
import QuestionHelper from 'components/QuestionHelper'
import MainLogo from 'assets/svg/icon/logo_new.svg'

const Wrapper = styled.div`
  background: black;
  border-radius: 16px;
  padding: 20px;
  color: white;
  & img {
    width: 60px;
  }
`

const DividendPanel:React.FC = () => {
  const [ detailsShown, showDetails ] = useState(false)
  return (
    <Wrapper>
      <Flex>
        <img src={MainLogo} alt='Main Logo' />
        <Text color='white' mt={2} ml={1}>Sphynx Dividend</Text>
      </Flex>
      <Flex justifyContent='space-between' mt={2}>
        <Text color='white'>Amount to be Distributed</Text>
        <Text color='white'>$ 12,000</Text>
      </Flex>
      {
        detailsShown &&
          <>
            <Text color='white' textAlign='center' mt={3}>Distribution in:</Text>
            <Text color='white' textAlign='center' mt={1}>6 days: 23 hrs: 43 min: 23 sec</Text>
            <Flex justifyContent='space-between' mt={3}>
              <Text color='white'>Previously Distributed</Text>
              <Text color='white'>$ 11,232</Text>
            </Flex>
          </>
      }
      <Button width='100%' mt={3} onClick={() => showDetails(!detailsShown)}>
        { detailsShown ? 'Hide' : 'Show' } Details
      </Button>
    </Wrapper>
  )
}

export default DividendPanel