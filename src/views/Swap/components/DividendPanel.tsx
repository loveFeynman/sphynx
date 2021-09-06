import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, useModal } from '@pancakeswap/uikit'
import DividendModal from 'components/Menu/GlobalSettings/DividendModal'
import QuestionHelper from 'components/QuestionHelper'
import MainLogo from 'assets/svg/icon/logo_new.svg'

const Wrapper = styled.div`
  background: black;
  border-radius: 16px;
  padding: 12px 20px;
  color: white;
  & img {
    width: 48px;
  }
  & button {
    outline: none;
  }
`

const DividendPanel:React.FC = () => {
  const [onPresentDividendModal] = useModal(<DividendModal />)

  return (
    <Wrapper>
      <Flex>
        <img src={MainLogo} alt='Main Logo' />
        <Text color='white' mt={2} ml={1}>Sphynx Dividend</Text>
      </Flex>
      <Flex justifyContent='space-between' mt={2}>
        <Text color='white' fontSize='14px'>Amount to be Distributed</Text>
        <Text color='white' fontSize='14px'>$ 12,000</Text>
      </Flex>
      <Button width='100%' height='36px' mt={2} onClick={() => onPresentDividendModal()}>
        Show Details
      </Button>
    </Wrapper>
  )
}

export default DividendPanel