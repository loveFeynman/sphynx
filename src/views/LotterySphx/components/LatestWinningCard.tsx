/* eslint-disable */
import styled, { ThemeConsumer, useTheme } from 'styled-components'
import { Text, Flex, Box } from '@sphynxswap/uikit'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { AppState } from '../../../state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import DownArrow from 'assets/svg/icon/LotteryDownIcon.svg'
import PotContentTable from './PotContentTable'
import { claimTickets } from '../../../hooks/useLottery'
import { Spinner } from './Spinner'
import ViewTickets from './ViewTickets'
import useToast from 'hooks/useToast'
import { FormattedNumber } from './FormattedNumber'
import { SPHYNX_TOKEN_ADDRESS } from 'config/constants'
import LotteryLatestMark from 'assets/svg/icon/LotteryLatestMark.svg'

const Container = styled.div`
  width: 332px;
  background: ${({ theme }) => (theme.isDark ? '#1A1A3A' : '#20234E')};
  border-radius: 10px;
  min-height: 500px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 332px;
  }
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  padding: 20px 20px 0px 20px;
  grid-gap: 10px;
`
const GridItem = styled.div`
  max-width: 180px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  color: white;
  padding: 6px 0px;
`
const WinningNumber = styled(Flex)`
  width: 68px;
  height: 68px;
  background: #0E0E26;
  border-radius: 5px;
  border: 1px solid #2E2E55;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 6px 0px;
`


export default function LatestWinningCard({
  winningCards,
}) {
  const theme = useTheme();

  return (
    <Container>
      <Flex flexDirection="column" alignItems="center" >
        <Box pt="42px">
          <img src={LotteryLatestMark} alt="Logo" />
        </Box>
        <Text fontSize="20px" fontWeight="600" mt="1rem">Latest Winning Numbers</Text>
        <Box mt="87px">
          <Grid>
          {winningCards.map((item) => (
            <GridItem>
              <WinningNumber>
                <Text fontSize="25px" fontWeight="500"> {item === '' ? '?' : item} </Text>
              </WinningNumber>
            </GridItem>
            ))
          }
          </Grid>
        </Box>
      </Flex>
    </Container>
  )
}
