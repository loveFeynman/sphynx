import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

declare type Handler = () => void;

interface DividendModalProps {
  onDismiss?: Handler;
  balance?: number;
}

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  &.selected {
    background-color: #8b2a9b !important;
  }
`

const DividendModal: React.FC<DividendModalProps> = ({ onDismiss, balance }) => {
  const { t } = useTranslation()

  console.log(balance);
  return (
    <Modal
      title={t('Sphynx Dividend')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <Flex justifyContent='space-between' mt={2}>
        <Text>Amount to be Distributed</Text>
        <Text ml={3}>$ {balance}</Text>
      </Flex>
      <Text textAlign='center' mt={3}>Distribution in:</Text>
      <Text textAlign='center' mt={1}>6 days: 23 hrs: 43 min: 23 sec</Text>
      <Flex justifyContent='space-between' mt={3}>
        <Text>Previously Distributed</Text>
        <Text>$ {balance}</Text>
      </Flex>
      <Flex flexDirection="column" mt={3}>
        <ApplyButton className='selected' onClick={onDismiss}>Hide Details</ApplyButton>
      </Flex>
    </Modal>
  )
}

export default DividendModal
