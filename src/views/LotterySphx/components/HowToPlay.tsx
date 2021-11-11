import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Heading, useMatchBreakpoints, Link } from '@sphynxswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import WebFont from 'webfontloader'
import LotteryStep1 from 'assets/svg/icon/LotteryStep1.svg'
import LotteryStep2 from 'assets/svg/icon/LotteryStep2.svg'
import LotteryStep3 from 'assets/svg/icon/LotteryStep3.svg'
import LotteryWinningCardSapmple from 'assets/svg/icon/LotteryWinningCardSample.svg'
import LotteryWinningCardWSapmple from 'assets/svg/icon/LotteryWinningCardWSample.svg'
import LotteryDMatchDark from 'assets/svg/icon/LotteryDMatchDark.svg'
import LotteryDMatchWhite from 'assets/svg/icon/LotteryDMatchWhite.svg'
import LotteryLatestIcon from 'assets/images/winning-mark.png'
import LotteryFundsIcon from 'assets/images/funds.png'
import Question from 'assets/images/question.png'
import { ReactComponent as ListMaker } from 'assets/svg/icon/ListMaker.svg'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  position: relative;
`
const Divider = styled.div`
  background-color: #21214A;
  height: 1px;
  width: 80%;
`

const BulletList = styled.ul`
  list-style-type: none;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::marker {
    font-size: 12px;
  }
`

const StepContainer = styled.div`
  width: 100%;
  display: grid;
  flex-direction: column;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  min-height: 305px;
  padding: 76px 36px 67px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledStepCard = styled(Box)`
  display: flex;
  align-self: baseline;
  position: relative;
  padding: 1px 1px 3px 1px;
  min-height: 305px;
  border-radius: 10px;
  background: ${({ theme }) => (theme.isDark ? '#1A1A3A' : '#20234E')};
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const GappedFlex = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#2A2E60')};
  gap: 52px;
`

const StyledStepCardTop = styled(Box)`
  display: flex;
  align-self: baseline;
  justify-content: center;
  position: relative;
  width: 128px;
  border-radius: 64px;
  align-self: center;
  margin-top: -30px;
  height: 128px;
  padding: 1px 1px 3px 1px;
  background: ${({ theme }) => (theme.isDark ? '#1A1A3A' : '#20234E')};
  border: ${({ theme }) => (theme.isDark ? '6px solid #0E0E26' : '6px solid #2A2E60')};
`

type Step = { title: string; subtitle: string; label: string; img: any }

const StepCard: React.FC<{ step: Step }> = ({ step }) => {

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ['Raleway', 'Chilanka'],
      },
    })
  }, [])

  return (
    <StyledStepCard width="100%">
      <Flex flexDirection="column" width="100%">
        <StyledStepCardTop>
          <img src={step.img} alt="" />
        </StyledStepCardTop>
        <Text mt="16px" fontSize="18px" color="#F2C94C" bold textAlign="center">
          {step.label}
        </Text>
        <Text mb="8px" mt="11px" fontSize="20px" bold color="white" textAlign="center">
          {step.title}
        </Text>
        <Text color="#777777" px={step.img === LotteryStep2 ? "10%" : "25%"} textAlign="center">{step.subtitle}</Text>
      </Flex>
    </StyledStepCard>
  )
}

const InlineLink = styled(Link)`
  display: inline;
  text-decoration: underline;
  color: #B928AF;
  font-size: 14px;
`

const PoolAllocations = () => {
  const { t } = useTranslation()
  const theme = useTheme();
  return (
    <StyledStepCard style={{ border: 'none', background: 'none' }}>
      <img src={theme.isDark ? LotteryDMatchDark : LotteryDMatchWhite} alt="" />
    </StyledStepCard>
  )
}


const HowToPlay: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme();
  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Buy Tickets'),
      subtitle: t('Prices are set when the round starts, equal to 5 USD in Sphynx per ticket.'),
      img: LotteryStep1,
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Wait for the Draw'),
      subtitle: t('There is one draw every day: one every 24 hours. First draw will be drawn on Monday, 4th of October 3AM UTC.'),
      img: LotteryStep2,
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Check for Prizes'),
      subtitle: t('Once the round’s over, come back to the page and check to see if you’ve won!'),
      img: LotteryStep3,
    },
  ]
  return (
    <Box width="100%">
      <Container>
        <Flex pt="35px" alignItems="center" flexDirection="column">
          <Heading scale="xl" color="white">
            {t('How to Play')}
          </Heading>
          <Text fontSize="15px" fontWeight="500" textAlign="center" color="#A7A7CC" mt="12px" lineHeight="146%" px="33%">
            {t(
              'If the digits on your tickets match the winning numbers in the correct order, you win a portion of the prize pool.',
            )}
          </Text>
        </Flex>
        <StepContainer>
          {steps.map((step) => (
            <StepCard key={step.label} step={step} />
          ))}
        </StepContainer>
      </Container>
      <Container style={{ marginTop: "20px" }}>
        <GappedFlex mx="10%" py="45px" >
          <Flex flex="2" flexDirection="row" maxWidth="fit-content">
            <Box minWidth="79px">
              <img src={LotteryLatestIcon} alt="" />
            </Box>
            <Box pl="5px" maxWidth="400px">
              <Text fontSize="26px" color="white" fontWeight="600">
                {t('Winning Criteria')}
              </Text>
              <Text fontSize="15px" color="#A7A7CC" fontWeight="500">
                {t('The digits on your ticket must match in the correct order to win.')}
              </Text>
              <Text mt="8px" color="#B928AF">
                {t('Here’s an example lottery draw, with two tickets, A and B.')}
              </Text>
              <BulletList >
                <li >
                  <Flex mt="12px" ml="-28px" style={{columnGap: '10px'}}>
                    <Box maxWidth="18px" >
                      <ListMaker />
                    </Box>
                    <Text display="inline" fontSize="14px" color="#A7A7CC" >
                      {t(
                        'Ticket A: The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.',
                      )}
                    </Text>
                  </Flex>
                </li>
                <li>
                  <Flex mt="12px" ml="-28px" style={{columnGap: '10px'}}>
                    <Box maxWidth="18px">
                      <ListMaker />
                    </Box>
                    <Text display="inline"  fontSize="14px" color="#A7A7CC">
                      {t(
                        'Ticket B: Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.',
                      )}
                    </Text>
                  </Flex>
                </li>
              </BulletList>
              <Text mt="16px" fontSize="14px" color="#A7A7CC">
                {t(
                  'Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.',
                )}
              </Text>
            </Box>
          </Flex>
          <Flex flex="1" justifyContent="center">
            <img src={theme.isDark ? LotteryWinningCardSapmple : LotteryWinningCardWSapmple} alt="" />
          </Flex>
        </GappedFlex>
        <Divider style={{margin: "0px 48px"}} />
        <GappedFlex mx="10%" py="65px">
          <Flex flex="1" justifyContent="center">
            <PoolAllocations />
          </Flex>
          <Flex flex="2" flexDirection="column">
            <Flex maxWidth="fit-content">
              <Flex maxWidth="61px" maxHeight="70px">
                <img src={LotteryFundsIcon} width="69px" height="78px" alt="funds" />
              </Flex>
              <Box pl="5px" maxWidth="400px">
                <Heading  mb="13px" scale="lg" color="white">
                  {t('Prize Funds')}
                </Heading>
                <Text color="#A7A7CC" fontSize="15px" lineHeight="142%">
                  {t('The prizes for each lottery round come from three sources:')}
                </Text>
                <Text m="16px 0px 4px" fontSize="15px" lineHeight="142%">
                  {t('Ticket Purchases')}
                </Text>
                <Text display="inline" color="#A7A7CC" lineHeight="142%">
                  {t('100% of the Sphynx paid by people buying tickets that round goes back into the prize pools.')}
                </Text>
                <Text m="16px 0px 4px" fontSize="15px" lineHeight="142%" >
                  {t('Rollover Prizes')}
                </Text>
                <Text display="inline" color="#A7A7CC" lineHeight="142%">
                  {t(
                    'After every round, if nobody wins in one of the prize brackets, the unclaimed Sphynx for that bracket rolls over into the next round and are redistributed among the prize pools.',
                  )}
                </Text>
                <Text m="16px 0px 4px" lineHeight="142%" >
                  {t('Sphynx Injections')}
                </Text>
                <Text display="inline" color="#A7A7CC" lineHeight="142%">
                  {t(
                    'Sphynx tokens from the contract is added to the lottery each and every day. This Sphynx is of course also included in rollovers! Read more in our guide to ',
                  )}
                  <InlineLink href="https://www.sphynxtoken.co/static/media/whitepaper.88cdeecb.pdf" target="_blank" color="">
                    {t('Sphynx Tokenomics')}
                  </InlineLink>
                </Text>
              </Box>
            </Flex>
          </Flex>
        </GappedFlex>
      </Container>

      <Flex 
        justifyContent="center" 
        alignItems="center" 
        flexDirection="column" 
        mt="40px" 
        mb="66px" 
        style={{textAlign: 'center'}}
      >
        {/* <img src={LotteryDMatchWhite} alt="question" /> */}
        <img src={Question} alt="question" />
        <Flex flexDirection="column" >
          <Text mt="15px" fontSize="20px">
            {t('Still got questions?')}
          </Text>
          <Text fontSize="12px" mt="11px" color="#A7A7CC">
            {t('Check our in-depth guide on')}{' '}
            <InlineLink href="/Lottery.pdf" target="_blank" fontSize="12px">
              {t('how to play the Sphynx lottery!')}
            </InlineLink>
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default HowToPlay

