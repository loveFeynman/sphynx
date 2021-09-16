import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, PancakeToggle, Toggle, Flex, Modal, InjectedModalProps, Button, Input } from '@pancakeswap/uikit'
import { useAudioModeManager, useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import usePersistState from 'hooks/usePersistState'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  background: #8B2A9B;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`

const ButtonWrapper = styled.div`
  background: #8B2A9B;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 12px 4px;
  border-radius: 8px;
  cursor: pointer;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: white;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
    border-radius: 10px;

  }
`
const BuyTicketModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  
  const { account } = useWeb3React();
  const [manualTicketGenerate, setManualTicketGenerate] = useUserSingleHopOnly()
  const [tokenNumber, setTokenNumber] = useState('')
  const [tokens, setTokens] = useState<string>('')

  const { t } = useTranslation()

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setTokenNumber(input)
  }, [])

  const handleInputTokens = useCallback((event) => {
    const input = event.target.value
    if (parseInt(input) > 100)
      setTokens("100");
    else
      setTokens(input);
  }, [])

  const randomTickets = useCallback(() => {
    const input = Math.floor(Math.random() * 10).toString()+
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString() ;
    setTokenNumber(input)
  }, [])
  
  return (
    <Modal
      title={t('Buy Tickets')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '380px',  maxWidth: '380px' }}
    >
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center" mb="24px">
          <Flex alignItems="center">
            <Text>{t('Manual Ticket Numbers')}</Text>
          </Flex>
          <Toggle
            id="toggle-disable-multihop-button"
            checked={manualTicketGenerate}
            scale="md"
            onChange={() => {
              setManualTicketGenerate(!manualTicketGenerate);
              setTokenNumber('');
            }}
          />
        </Flex>
        <Text bold > {t('Ticket Number')} </Text>
        {manualTicketGenerate && (
          <Input
            id="token-search-input"
            placeholder={t('0')}
            scale="lg"
            autoComplete="off"
            value={tokenNumber}
            onChange={handleInput}
            maxLength={6}
            pattern="\d*" 
            color="#fff"
            required
          />)}
        {!manualTicketGenerate && (
          <Flex flexDirection="row" justifyContent="space-between"  alignItems="center">
            <Input
              id="token-search-input"
              placeholder={t('0')}
              scale="lg"
              autoComplete="off"
              value={tokenNumber}
              onChange={handleInput}
              maxLength={6}
              pattern="\d*" 
              required
              disabled
              color="#fff"
            />
            <ApplyButton style={{marginLeft: '12px', width: '90px'}} onClick={randomTickets}> {t('Random')} </ApplyButton>
          </Flex>)}

        <Text bold style={{marginTop: '12px'}} > {t('Tickets')} </Text>
        <Input
            id="token-search-input"
            placeholder={t('0')}
            scale="lg"
            autoComplete="off"
            value={tokens}
            onChange={handleInputTokens}
            maxLength={3}
            pattern="\d*"
            required
          />
        <Flex justifyContent="center" alignItems="center" marginTop="20px">
          {
            account ?
              <ApplyButton className='selected' onClick={onDismiss}>Apply</ApplyButton>
            :
              <ConnectWalletButton />
          }
        </Flex>
      </Flex>
    </Modal>
  )
}

export default BuyTicketModal
