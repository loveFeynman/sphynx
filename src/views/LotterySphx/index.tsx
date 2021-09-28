/* eslint-disable */

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import Web3 from 'web3'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Nav from 'components/LotteryCardNav'
import { Heading, Text, Button, Link, useModal } from '@sphynxswap/uikit'
import { Button as materialButton, Menu, MenuItem } from '@material-ui/core'
import PageHeader from 'components/PageHeader'
import WebFont from 'webfontloader'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from 'assets/images/search.png'
import { typeInput, setIsInput } from '../../state/input/actions'
import PrizePotCard from './components/PrizePotCard'
import TicketCard from './components/TicketCard'
import History from './components/LotteryHistory'
import { isAddress, getBscScanLink } from '../../utils'
import BuyTicketModal from './components/BuyTicketModal'
import {
  useLotteryBalance,
  approveCall,
  buyTickets,
  viewLotterys,
  viewUserInfoForLotteryId,
} from '../../hooks/useLottery'

const size = {
  xs: '320px',
  sm: '768px',
  lg: '1200px',
}
const device = {
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  lg: `(max-width: ${size.lg})`,
}

const WinningCard = styled.div`
  width: 94px;
  height: 94px;
  background: #8b2a9b;
  border-radius: 24px;
  margin: 12px 36px;
  @media only screen and ${device.lg} {
    margin: 0px 24px;
  }
`
const WinningCardTop = styled.div`
  width: 48px;
  height: 48px;
  background: #8b2a9b;
  border-radius: 12px;
  margin: 12px 12px;
  opacity: 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 0px 12px;
    opacity: 1;
  }
`

const ContractCard = styled(Text)`
  padding: 0 4px;
  max-width: 505px;
  height: 48px;
  text-overflow: ellipsis;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  & button:last-child {
    background: #8b2a9b;
  }
`
const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  z-index: 3;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 420px;
  }
  & input {
    background: transparent;
    border: none;
    width: 100%;
    box-shadow: none;
    outline: none;
    color: #f7931a;
    font-size: 16px;
    &::placeholder {
      color: #8f80ba;
    }
  }
`
const MenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  background: #131313;
  color: #eee;
  margin-top: 12px;
  overflow-y: auto;
  max-height: 90vh;
  & a {
    color: white !important;
  }
  & .selectedItem {
    background: rgba(0, 0, 0, 0.4);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const ContractPanelOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  left: 0;
  top: 0;
`
const PrizePotCardContainer = styled.div`
  display: flex;
  jusitfy-content: center;
  flex-direction: column-reverse;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: baseline;
    justify-content: center;
  }
`
const WinningCardContainer = styled.div`
  display: flex;
  margin-top: 21px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
const WinningCardContainerTop = styled.div`
  visibility: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    margin-top: 12px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    visibility: visible;
  }
`
const PastDrawCardContainer = styled.div`
  display: flex;
  margin: 20px 0px 200px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: baseline;
  }
`
const RightContainer = styled.div`
  visibility: hidden;
  height: 0;
  width: 0;
  ${({ theme }) => theme.mediaQueries.xl} {
    right: 0px;
    height: auto;
    width: auto;
    visibility: visible;
  }
`
const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, auto);
`
export default function Lottery() {
  const { account, library } = useActiveWeb3React()
  const signer = library.getSigner()
  const dispatch = useDispatch()
  const [winningCards, setWinningCard] = React.useState([])
  const [cursor, setCursor] = React.useState(0)
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [ticketSearch, setTicketSearch] = React.useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [show, setShow] = useState(true)
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)
  const [data, setdata] = useState([])
  const [lastLoteryInfo, setLastLotteryInfo] = React.useState(null)
  const [forceValue, setForceValue] = useState(0) // integer state
  const [userTicketInfos, setUserInfoTickets] = React.useState([])
  const { roundID, lotteryInfo, setRefetch } = useLotteryBalance()
  const [userUpdateTicket, setUserUpdateTicket] = React.useState(0)
  const setUpdateUserTicket = () => {
    setUserUpdateTicket(userUpdateTicket + 1)
  }
  const [onPresentSettingsModal] = useModal(<BuyTicketModal setUpdateUserTicket={setUpdateUserTicket} />)

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Raleway', 'Chilanka'],
      },
    })
  }, [])

  //
  React.useEffect(() => {
    if (lastLoteryInfo !== null) {
      const arrayData = []
      for (let i = 1; i <= 6; i++) {
        arrayData.push(lastLoteryInfo.finalNumber.toString().charAt(i))
      }
      setWinningCard(arrayData)
    }
  }, [lastLoteryInfo])

  React.useEffect(() => {
    clearInterval()
    setInterval(() => {
      setRefetch(false)
      setRefetch(true)
    }, 60 * 1000)
  }, [])
  //getting lottery status
  React.useEffect(() => {
    if (lotteryInfo !== null) {
      if (new Date().getTime() / 1000 > lotteryInfo?.endTime) {
        viewLotterys(roundID, lastLoteryInfo, setLastLotteryInfo)
      } else {
        // viewLotterys
        viewLotterys(roundID - 1, lastLoteryInfo, setLastLotteryInfo)
      }
      setCursor(lotteryInfo?.firstTicketId)
    }
  }, [lotteryInfo, roundID])

  //getting user tickets

  React.useEffect(() => {
    const fetchData = async () => {
      await viewUserInfoForLotteryId(account, roundID.toString(), 0, 2500, setUserInfoTickets)
    }
    fetchData()
    setForceValue(forceValue + 1)
  }, [account, roundID, cursor, userUpdateTicket])

  const handleItemClick = () => {
    if (activeIndex === 0) setActiveIndex(1)
    else setActiveIndex(0)
  }

  const submitFuntioncall = () => {
    dispatch(typeInput({ input: ticketSearch }))
    dispatch(
      setIsInput({
        isInput: true,
      }),
    )
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      submitFuntioncall()
    }
  }

  const onSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      if (selectedItemIndex < data.length - 1) {
        setSelectedItemIndex(selectedItemIndex + 1)
      } else {
        setSelectedItemIndex(0)
      }
    } else if (event.key === 'ArrowUp') {
      if (selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1)
      } else {
        setSelectedItemIndex(data.length - 1)
      }
    }
  }

  const handlerChange = (e: any) => {
    try {
      if (e.target.value && e.target.value.length > 0) {
        axios.get(`https://thesphynx.co/api/search/${e.target.value}`).then((response) => {
          setdata(response.data)
        })
      } else {
        setdata([])
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('errr', err.message)
    }

    const result = isAddress(e.target.value)
    if (result) {
      setTicketSearch(e.target.value)
      setShow(false)
    } else {
      setTicketSearch(e.target.value)
      setShow(true)
    }
  }

  return (
    <div style={{ fontFamily: 'Raleway' }}>
      <PageHeader>
        <Grid>
          <div>
            <Heading as="h4" scale="xl" color="white">
              {t('Lottery')}
            </Heading>
            <Heading as="h6" scale="md" color="text" mt="20px">
              {t('Win Lottery if 2, 3, 4, 5 or 6 of your ticket numbers matched')}
            </Heading>
          </div>
          <RightContainer>
            <div
              style={{
                textAlign: 'center',
                marginLeft: '40px',
                background: 'rgba(0, 0, 0, 0.0)',
                borderRadius: '24px',
              }}
            >
              <Text fontSize="24px" color="white" style={{ fontWeight: 700 }}>
                {t(`Latest Winning Numbers`)}
              </Text>
              <WinningCardContainerTop>
                {winningCards.map((item, key) => (
                  <WinningCardTop key={key}>
                    <Text fontSize="18px" color="white" style={{ fontWeight: 700, padding: '12px' }}>
                      {' '}
                      {item === '' ? '?' : item}
                    </Text>
                  </WinningCardTop>
                ))}
              </WinningCardContainerTop>
            </div>
          </RightContainer>
        </Grid>
      </PageHeader>
      <div>
        <Nav activeIndex={activeIndex} setActiveIndex={handleItemClick} />
      </div>
      {activeIndex === 0 && (
        <>
          <PrizePotCardContainer>
            <div style={{ margin: '10px' }}>
              {forceValue > 0 && (
                <PrizePotCard
                  isNext={false}
                  setModal={null}
                  roundID={roundID}
                  lotteryInfo={lotteryInfo}
                  lastLoteryInfo={lastLoteryInfo}
                  userTicketInfos={userTicketInfos}
                  winningCards={winningCards}
                />
              )}
            </div>
            <div style={{ margin: '10px' }}>
              {forceValue > 0 && (
                <PrizePotCard
                  isNext
                  setModal={onPresentSettingsModal}
                  roundID={roundID}
                  lotteryInfo={lotteryInfo}
                  lastLoteryInfo={lastLoteryInfo}
                  userTicketInfos={userTicketInfos}
                  winningCards={winningCards}
                />
              )}
            </div>
          </PrizePotCardContainer>
          <div style={{ textAlign: 'center', margin: '88px 0px 76px 0px' }}>
            <Text bold fontSize="48px" color="white" style={{ fontWeight: 700 }}>
              How it works
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Text bold fontSize="16px" color="#ddd" style={{ maxWidth: '440px', textAlign: 'left' }}>
                {t(
                  `Spend Sphynx to buy tickets, contributing to the lottery pot. Win prizes if 2, 3, 4, 5 or 6 of your ticket numbers match the winning numbers and their exact order!`,
                )}
              </Text>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '24px',
              paddingTop: '32px',
              paddingBottom: '42px',
            }}
          >
            <Text fontSize="36px" color="white" style={{ fontWeight: 700 }}>
              {t(`Latest Winning Numbers`)}
            </Text>
            <WinningCardContainer>
              {winningCards.map((item, key) => (
                <WinningCard key={key}>
                  <Text fontSize="36px" color="white" style={{ fontWeight: 700, padding: '26px' }}>
                    {' '}
                    {item === '' ? '?' : item}
                  </Text>
                </WinningCard>
              ))}
            </WinningCardContainer>
          </div>
        </>
      )}
      {activeIndex === 1 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContractCard>
              <img src={SearchIcon} style={{ marginLeft: '4px' }} alt="search" />
              <SearchInputWrapper>
                <input
                  placeholder=""
                  value={ticketSearch}
                  onFocus={() => setShowDrop(true)}
                  onKeyPress={handleKeyPress}
                  onKeyUp={onSearchKeyDown}
                  onChange={handlerChange}
                />
                {showDrop && (
                  <MenuWrapper>
                    {data.length > 0 ? (
                      <span>
                        {data?.map((item: any, index: number) => {
                          return (
                            <Link href={`#/swap/${item.address}`}>
                              <MenuItem className={index === selectedItemIndex ? 'selectedItem' : ''}>
                                {item.name}
                                <br />
                                {item.symbol}
                                <br />
                                {item.address}
                              </MenuItem>
                            </Link>
                          )
                        })}
                      </span>
                    ) : (
                      <span style={{ padding: '0 16px' }}>no record</span>
                    )}
                  </MenuWrapper>
                )}
              </SearchInputWrapper>
              <Button scale="sm" onClick={submitFuntioncall} style={{ height: 'inherit' }}>
                {t(`Search`)}
              </Button>
            </ContractCard>
          </div>
          <PastDrawCardContainer>
            <div style={{ margin: '10px' }}>
              <TicketCard lastLoteryInfo={lastLoteryInfo} roundID={roundID} />
            </div>
            <div style={{ margin: '10px' }}>
              <History />
            </div>
          </PastDrawCardContainer>
          {showDrop && <ContractPanelOverlay onClick={() => setShowDrop(false)} />}
        </>
      )}
    </div>
  )
}
