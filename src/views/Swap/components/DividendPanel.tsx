import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, useModal } from '@pancakeswap/uikit'
import DividendModal from 'components/Menu/GlobalSettings/DividendModal'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import MoreIcon from 'assets/svg/icon/MoreIcon2.svg'

const Wrapper = styled.div`
  background: black;
  border-radius: 16px;
  padding: 8px 20px;
  color: white;
  position: relative;
  & img {
    width: 48px;
  }
  & button {
    outline: none;
  }
`

const DetailsImage = styled.img`
  position: absolute;
  right: 0;
  width: auto !important;
  height: 40px;
  cursor: pointer;
`

const DividendPanel:React.FC = () => {
  const [onPresentDividendModal] = useModal(<DividendModal />)

  return (
    <Wrapper>
      <Flex>
        <img src={MainLogo} alt='Main Logo' />
        <Text color='white' mt={2} ml={1}>Sphynx Dividend</Text>
        <DetailsImage src={MoreIcon} alt='More Icon' onClick={() => onPresentDividendModal()} />
      </Flex>
      <Flex justifyContent='space-between' mt={2}>
        <Text color='white' fontSize='14px'>Amount to be Distributed</Text>
        <Text color='white' fontSize='14px'>$ 12,000</Text>
      </Flex>
    </Wrapper>
  )
}

export default DividendPanel