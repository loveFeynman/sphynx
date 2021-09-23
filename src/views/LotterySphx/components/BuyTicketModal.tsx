/* eslint-disable */

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps, Button, Input } from '@pancakeswap/uikit'

import { useAudioModeManager, useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import usePersistState from 'hooks/usePersistState'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useLotteryBalance, approveCall, buyTickets, getApproveAmount } from '../../../hooks/useLottery'
import { Spinner } from './Spinner'
import useToast from 'hooks/useToast'

// eslint-disable

const ApplyButton = styled(Button)`
  bottom: 16px;
  outline: none;
  background: #8b2a9b;
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

const BalanceButton = styled(Button)`
  bottom: 16px;
  outline: none;
  border-radius: 16px;
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
  background-color: rgba(74, 74, 104, 0.1);
  color: #1fc7d4;
  margin: 10px 0px;
  height: 26px;
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
const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #372f47;
  border-radius: 16px;
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);
  & > input {
    &:focus {
      border: none !important;
      box-shadow: none !important;
      border-radius: none !important;
    }
  }
`
const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(4, auto);
  margin-top: 20px;
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

interface BuyTicketModalProps extends InjectedModalProps {
  setUpdateUserTicket: any,
}
const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ setUpdateUserTicket, onDismiss }) => {
  const { account, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const { balance, roundID, lotteryInfo } = useLotteryBalance()
  const [manualTicketGenerate, setManualTicketGenerate] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [ticketNumbers, setTicketNumbers] = useState([])
  const [tickets, setTickets] = useState<string>('0')
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState<string>('0')
  const [totalSpx, setTotalSpx] = useState<string>('0')
  const [realTokens, setRealTokens] = useState<string>('0')
  const [enabled, setEnabled] = useState(false)
  const [checked, setChecked] = useState(false)
  const [toastMessage, setToastMessage] = useState({
    title: '',
    message: '',
  })
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation()

  const handleInputTokens = useCallback((event) => {
    const input = event.target.value
    if (parseInt(input) > 100) setTickets('100')
    else setTickets(input)
  }, [])

  React.useEffect(() => {
    if (toastMessage.title !== '' && toastMessage.title.includes("Error")) {
      toastError(t(toastMessage.title), t(toastMessage.message));
    }
    if (toastMessage.title !== '' && toastMessage.title.includes("Success")) {
      toastSuccess(t(toastMessage.title), t(toastMessage.message));
    }
    setToastMessage({
      title: '',
      message: '',
    })
  }, [toastMessage])

  useEffect(() => {
    const ticket = parseInt(tickets) > 100 ? 100 : parseInt(tickets)
    if (tickets === '0' || tickets === '') {
      setBulkDiscountPercent('0')
      setRealTokens('0')
      setTicketNumbers([])
    } else {
      setBulkDiscountPercent(
        (
          100 -
          ((parseInt(lotteryInfo?.discountDivisor) + 1 - parseInt(tickets)) / parseInt(lotteryInfo?.discountDivisor)) *
          100
        ).toFixed(2),
      )
      setRealTokens(
        (
          (parseInt(lotteryInfo?.priceTicketInCake) *
            parseInt(tickets) *
            (parseInt(lotteryInfo?.discountDivisor) + 1 - parseInt(tickets))) /
          parseInt(lotteryInfo?.discountDivisor) /
          1000000000000000000
        ).toFixed(5),
      )
      console.log((parseInt(lotteryInfo?.priceTicketInCake) * parseInt(tickets)) / 1000000000000000000)
      setTotalSpx(((parseInt(lotteryInfo?.priceTicketInCake) * parseInt(tickets)) / 1000000000000000000).toFixed(2))
      const data = []
      for (let i = 0; i < ticket; i++) {
        data.push({ id: i, ticketNumber: 0, ticketNumbers: [], error: false })
      }
      setTicketNumbers(data)
    }
    const isApproved = async () => {
      const maxBuyPrice = 5000 * 1000000000000000000
      const approved = await getApproveAmount(account)
      if (approved > maxBuyPrice) {
        setEnabled(true);
      }
      setChecked(true);
    }
    isApproved()
    console.log('lotteryInfo111', lotteryInfo)
  }, [tickets, lotteryInfo])

  const randomTickets = useCallback(() => {
    const data = []
    // setTicketNumbers(input);
    if (ticketNumbers.length > 0) {
      ticketNumbers.map((ticket, index) => {
        const ticketnumbers = []
        for (let i = 0; i < 6; i++) {
          ticketnumbers.push(Math.floor(Math.random() * 10).toString())
        }
        let ticketNumber = ''
        ticketnumbers.forEach((item) => {
          ticketNumber = ticketNumber.concat(item)
        })
        data.push({ id: index, ticketnumber: ticketNumber, ticketNumbers: ticketnumbers, error: false })
        return null
      })
      setTicketNumbers(data)
    }
  }, [ticketNumbers])

  const handleBack = useCallback(() => {
    setManualTicketGenerate(false)
  }, [])

  const handleApply = async () => {
    const ticketArrays = []
    if (tickets === '0') {
      setToastMessage({
        title: 'Error',
        message: 'No tickets',
      })
    }
    ticketNumbers.forEach((item) => ticketArrays.push((parseInt(item.ticketnumber) + 1000000).toString()))
    setLoading(true)
    await buyTickets(signer, roundID, ticketArrays, setLoading, setToastMessage)
    setUpdateUserTicket();
    onDismiss();
    setLoading(false)
    setManualTicketGenerate(false)
  }

  const handleInstantly = async () => {

    const data = []
    // setTicketNumbers(input);
    if (tickets === '0') {
      setToastMessage({
        title: 'Error',
        message: 'No tickets',
      })
    }
    console.log('randomtickets', ticketNumbers)
    if (ticketNumbers.length > 0) {
      ticketNumbers.map((ticket, index) => {
        const ticketnumbers = []
        for (let i = 0; i < 6; i++) {
          ticketnumbers.push(Math.floor(Math.random() * 10).toString())
        }
        let ticketNumber = ''
        ticketnumbers.forEach((item) => {
          ticketNumber = ticketNumber.concat(item)
        })
        data.push((parseInt(ticketNumber) + 1000000).toString())
        return null
      })
      console.log('ticketNumbers', data)
      setLoading(true)
      await buyTickets(account, roundID, data, setLoading, setToastMessage);
      setUpdateUserTicket();
      onDismiss();
      setLoading(false)
    }
  }

  const [forceValue, setForceValue] = useState(0) // integer state

  const handleTicketInput = (event, index, subIndex) => {
    event.preventDefault()
    console.log(event.target.value)
    const data = ticketNumbers

    data[index].ticketNumbers[subIndex] = event.target.value.toString()

    let ticketnumber = ''
    data[index].ticketNumbers.forEach((item) => {
      ticketnumber = ticketnumber.concat(item)
    })
    data[index].ticketNumber = ticketnumber
    setTicketNumbers(data)
    console.log(data)
    setForceValue(forceValue + 1)
  }

  return (
    <Modal
      title={!manualTicketGenerate ? t('Buy Tickets') : 'Round '.concat(roundID.toString())}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ minWidth: '380px', maxWidth: '380px' }}
      onBack={manualTicketGenerate ? handleBack : null}
    >
      {!manualTicketGenerate ? (
        <Flex flexDirection="column">
          <Flex margin="0px 10px 0px" alignItems="center">
            <Grid style={{ marginTop: '12px' }}>
              <GridItem isLeft>
                <Text bold style={{ textAlign: 'left' }} color="white" fontSize="16px">
                  Buy Tickets
                </Text>
              </GridItem>
              <GridItem isLeft>
                <Text bold style={{ textAlign: 'right' }} color="white" fontSize="16px">
                  ~{realTokens} SPX
                </Text>
              </GridItem>
            </Grid>
          </Flex>
          <InputArea>
            <Input
              id="token-input"
              placeholder={t('0')}
              scale="lg"
              autoComplete="off"
              value={tickets}
              onChange={handleInputTokens}
              maxLength={3}
              pattern="\d*"
              required
              style={{ textAlign: 'right', border: 'none' }}
            />
            <Text fontSize="14px" mr="10px" style={{ textAlign: 'right' }}>
              ~{tickets === '' || tickets === '0' ? '0.00' : (parseFloat(tickets) / 4).toFixed(2)} SPX
            </Text>
          </InputArea>
          {balance === 0 && (
            <Text style={{ textAlign: 'right' }} color="red" fontSize="14px" mt="8px">
              Insufficient SPX balance
            </Text>
          )}
          <Flex justifyContent="end" marginTop="4px ">
            <Text style={{ textAlign: 'right' }} color="white" fontSize="14px">
              {' '}
              SPX Balance:
            </Text>
            <Text style={{ textAlign: 'right' }} color="white" fontSize="14px">
              &nbsp;{parseFloat(balance.toString()).toFixed(3).toString()}
            </Text>
          </Flex>
          {balance !== 0 && (
            <Flex justifyContent="space-around">
              <BalanceButton onClick={() => setTickets('1')}>1</BalanceButton>
              <BalanceButton onClick={() => setTickets((balance < 100 ? Math.floor(balance / 4) : 25).toString())}>
                {balance < 100 ? Math.floor(balance / 4) : 25}
              </BalanceButton>
              <BalanceButton onClick={() => setTickets((balance < 100 ? Math.floor(balance / 2) : 50).toString())}>
                {balance < 100 ? Math.floor(balance / 2) : 50}
              </BalanceButton>
              <BalanceButton onClick={() => setTickets((balance < 100 ? Math.floor(balance) : 100).toString())}>
                Max
              </BalanceButton>
            </Flex>
          )}
          <Flex width="100%">
            <Grid>
              <GridItem isLeft>
                <Text style={{ textAlign: 'left' }} color="white" fontSize="14px">
                  Cost (SPX)
                </Text>
              </GridItem>
              <GridItem isLeft={false}>
                <Text style={{ textAlign: 'right' }} color="white" fontSize="14px">
                  {tickets === '' || tickets === '0' ? '0.00' : totalSpx} SPX
                </Text>
              </GridItem>
              <GridItem isLeft>
                <Flex>
                  <Text bold style={{ textAlign: 'left' }} color="white" fontSize="14px">
                    {bulkDiscountPercent}%
                  </Text>
                  <Text style={{ textAlign: 'left' }} color="white" fontSize="14px">
                    &nbsp; Bulk discount
                  </Text>
                </Flex>
              </GridItem>
              <GridItem isLeft={false}>
                <Text style={{ textAlign: 'right' }} color="white" fontSize="14px">
                  ~{((parseInt(totalSpx) * parseFloat(bulkDiscountPercent)) / 100).toFixed(5)} SPX
                </Text>
              </GridItem>
            </Grid>
          </Flex>
          <div style={{ borderTop: '1px solid', color: 'white', marginTop: '8px' }}>
            <></>
          </div>
          <Grid style={{ marginTop: '12px' }}>
            <GridItem isLeft>
              <Text bold style={{ textAlign: 'left' }} color="white" fontSize="16px">
                You Pay
              </Text>
            </GridItem>
            <GridItem isLeft>
              <Text bold style={{ textAlign: 'right' }} color="white" fontSize="16px">
                ~{realTokens} SPX
              </Text>
            </GridItem>
          </Grid>
          <Flex justifyContent="center" alignItems="center" marginTop="20px">
            {
              // account ?
              !enabled ? (
                <ApplyButton
                  className="selected"
                  disabled={!checked}
                  onClick={async () => {
                    setLoading(true)
                    await approveCall(signer, setEnabled, setToastMessage)
                    setLoading(false)
                  }}
                  style={{ width: '100%' }}
                >
                  {isLoading ? <Spinner /> : 'Enable'}
                </ApplyButton>
              ) : (
                <Flex flexDirection="column">
                  <ApplyButton
                    className="selected"
                    onClick={handleInstantly}
                    style={{
                      width: '100%',
                      marginBottom: '20px',
                    }}
                  >
                    {isLoading ? <Spinner /> : 'Buy Instantly'}
                  </ApplyButton>
                  <ApplyButton
                    className="selected"
                    onClick={() => {
                      if (ticketNumbers.length !== 0) {
                        setManualTicketGenerate(true)
                        if (ticketNumbers[0].ticketNumbers.length === 0) randomTickets()
                      } else {
                        if (tickets === '0') {
                          setToastMessage({
                            title: 'Error',
                            message: 'No tickets',
                          })
                        }
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      width: '100%',
                      color: 'white',
                      border: '1px solid',
                    }}
                  >
                    View/Edit manual
                  </ApplyButton>
                </Flex>
              )
              // :
              // <ConnectWalletButton />
            }
          </Flex>
          <Flex>
            <Text fontSize="13px" color="white" mt="10px">
              &quot;Buy Instantly&quot; chooses random numbers, with no duplicates among your tickets. Prices are set
              before each round starts, equal to $5 at that time. Purchases are final.
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column" color="white">
          <ApplyButton
            className="selected"
            onClick={randomTickets}
            style={{
              width: '100%',
              marginBottom: '20px',
            }}
          >
            Randomize
          </ApplyButton>
          {ticketNumbers?.map((ticket, index) => (
            <Flex flexDirection="column" marginBottom="12px">
              <Text fontSize="13px" mb="8px">
                #{ticket.id.length === 1 ? '00'.concat(ticket.id) : ticket.id.length === 2 ? '0'.concat(ticket.id) : ticket.id}
              </Text>
              <TicketContainer>
                {ticket.ticketNumbers.map((ticketChar, subIndex) => (
                  <TicketInput
                    id={index.toString().concat(subIndex).concat('index-ticket')}
                    placeholder={t('0')}
                    scale="lg"
                    value={ticketChar}
                    onChange={(e) => handleTicketInput(e, index, subIndex)}
                    style={{
                      textAlign: 'center',
                      border: !ticket.error ? 'none' : '1px red',
                      borderRadius: 'none !important',
                    }}
                    maxLength={1}
                    pattern="\d*"
                  />
                ))}
              </TicketContainer>
            </Flex>
          ))}
          <ApplyButton className="selected" onClick={handleApply} style={{ width: '100%', marginTop: '20px' }}>
            Confirm and Buy
          </ApplyButton>
        </Flex>
      )}
    </Modal>
  )
}

export default BuyTicketModal
