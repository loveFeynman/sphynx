/* eslint-disable */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps, Button, Input } from '@pancakeswap/uikit'

import { useAudioModeManager, useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import usePersistState from 'hooks/usePersistState'
import { useWeb3React } from '@web3-react/core'
import { Spinner } from './Spinner'
import { useLotteryBalance, viewUserInfoForLotteryId, claimTickets } from '../../../hooks/useLottery'
import useToast from 'hooks/useToast'


// eslint-disable 

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
const TicketContainer = styled(Flex)`
  & > input:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  & > input:last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`

const TicketInput = styled(Input)`
  bottom: 16px;
  outline: none;
  background: white;
  border-radius: inherit;
  color: black;
  &:active {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  &:focus {
    outline: unset;
    box-shadow: unset !important;
    border: unset;
  }
`
interface ViewTicketModalProps extends InjectedModalProps {
  roundID: string,
  winningCards: any,
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ roundID, winningCards, onDismiss }) => {
  const { account } = useWeb3React();
  const [manualTicketGenerate, setManualTicketGenerate] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const { t } = useTranslation();
  const [userTicketInfos, setInfoTickets] = React.useState([]);
  const [forceValue, setForceValue] = useState(0); // integer state
  const [isClaimable, setClaimable] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      await viewUserInfoForLotteryId(account, roundID.toString(), 0, 2500, setInfoTickets);
    }
    fetchData();
  }, [account, roundID]);

  const handleClaimTickets = async () => {
    const ticketIDS = [];
    const brackets = [];
    userTicketInfos.map((ticket) => {
      let bracket = -1;
      for (let i = 0; i <= 5; i++) {
        if (ticket.ticketnumber.charAt(6 - i) !== winningCards[5 - i]) {
          break;
        }
        bracket = i;
      }
      if (bracket >= 0) {
        ticketIDS.push(ticket.id);
        brackets.push(bracket);
      }
    });
    setLoading(true);
    await claimTickets(account, roundID, ticketIDS, brackets);
    setLoading(false);
  }

  React.useEffect(() => {
    if (userTicketInfos?.length > 0) {
      userTicketInfos.map((item) => {
        if (item.status === true) {
          setClaimable(false);
        }
      })
    }
  }, [userTicketInfos]);
  return (
    <Modal
      title={("Round ").concat(roundID.toString()).concat(" Tickets")}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '380px', maxWidth: '380px' }}
    >
      <Flex flexDirection="column" color="white">
        {userTicketInfos?.map((ticket, index) =>
          <Flex flexDirection="column" marginBottom="12px">
            <Text fontSize='13px' mb="8px">

              #{parseInt(ticket.id) < 100 ?
                ((ticket.id + 1).toString().length >= 3) ? (ticket.id + 1).toString() : (new Array(3).join('0') + (ticket.id + 1).toString()).slice(-3)
                : ticket.id
              }
            </Text>
            <TicketContainer>
              {
                ticket.ticketnumber.split('').map((ticketChar, subIndex) => subIndex !== 0 ? (
                  <TicketInput
                    id={index.toString().concat(subIndex).concat("videw-ticket")}
                    placeholder='0'
                    scale="lg"
                    value={ticketChar}
                    onChange={null}
                    style={{
                      textAlign: 'center',
                      border: !ticket.error ? 'none' : '1px red',
                      borderRadius: 'none !important'
                    }}
                    maxLength={1}
                    pattern="\d*"
                  />
                )
                  : <></>
                )
              }
            </TicketContainer>
          </Flex>
        )}
        {isClaimable && 
          <ApplyButton className='selected'
            onClick={handleClaimTickets}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {isLoading ? (
              <Spinner />
            ) : t(`Check Tickets`)}
          </ApplyButton>
        }
      </Flex>
    </Modal>
  )
}

export default ViewTicketModal
