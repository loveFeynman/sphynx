import React, { useEffect, useState } from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { useTranslation } from 'contexts/Localization'
import axios from 'axios'
import * as ethers from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import { getPresaleContract } from 'utils/contractHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import ShivaLogo from 'assets/images/ShivaTokenIcon.png'
import SnifferIcon from 'assets/images/SnifferIcon.png'
import LamboIcon from 'assets/images/LamboIcon.png'
import AfiIcon from 'assets/images/AFIIcon.png'
import GalabetIcon from 'assets/images/GalabetIcon.png'
import ListIcon from 'assets/svg/icon/ListIcon.svg'
import { useMenuToggle } from 'state/application/hooks'
import TokenCard from './components/TokenCard'
import SearchPannel from './components/SearchPannel'

import {
  Wrapper,
  HeaderWrapper,
  TitleWrapper,
  Title,
  LogoTitle,
  TokenListContainder,
  PaginationWrapper
} from './ListingsStyles'

const TOKEN_DATA = [
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: MainLogo,
    activeSale: 19,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'active',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: ShivaLogo,
    activeSale: 4,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'active',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: SnifferIcon,
    activeSale: 88,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'active',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: LamboIcon,
    activeSale: 65,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'active',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: AfiIcon,
    activeSale: 36,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'pending',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: GalabetIcon,
    activeSale: 64,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'failed',
  },
  {
    tokenName: 'sphynx token',
    tokenSymbole: 'sphynx',
    tokenLogo: MainLogo,
    activeSale: 78,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: 'active',
  },
]

const presaleContract = getPresaleContract(simpleRpcProvider)

const Presale: React.FC = () => {
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()
  const [tokenList, setTokenList] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL2}/getAllPresaleInfo`).then(async (response) => {
        if (response.data) {
          const list = await Promise.all(response.data.map(async (cell) => {
            const item = {
              tokenName: cell.token_name,
              tokenSymbole: cell.token_symbol,
              tokenLogo: cell.logo_link,
              activeSale: 0,
              totalCap: 0,
              softCap: cell.soft_cap,
              hardCap: cell.hard_cap,
              minContribution: cell.min_buy,
              maxContribution: cell.max_buy,
              tokenState: 'active',
            }
            let temp = (await presaleContract.totalContributionBNB(cell.sale_id)).toString()
            const value = parseFloat(ethers.utils.formatUnits(temp, cell.decimal))
            item.totalCap = value
            item.activeSale = value / cell.hard_cap

            temp = (await presaleContract.isDeposited(cell.sale_id.toString()))
            temp = true
            if (temp) {
              /* is deposited */
              const now = (Math.floor((new Date().getTime() / 1000)))
              if (parseInt(cell.start_time) < now && parseInt(cell.end_time) > now) {
                if (item.totalCap < item.softCap) {
                  item.tokenState = 'failed'
                }
                else {
                  item.tokenState = 'active'
                }
              }
              else if (now > parseInt(cell.end_time)) {
                item.tokenState = 'ended'
              }
              else if ( now < parseInt(cell.start_time)) {
                item.tokenState = 'pending'
              }
            }
            return item
          }))
          setTokenList(list)
        }
      })
    }

    fetchData()
  }, [])

  return (
    <Wrapper>
      <HeaderWrapper>
        <TitleWrapper>
          <img src={ListIcon} alt="listIcon" />
          <Title>
            <LogoTitle>LaunchPad Listings</LogoTitle>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit</span>
          </Title>
        </TitleWrapper>
      </HeaderWrapper>
      <SearchPannel />
      <TokenListContainder toggled={menuToggled}>
        {tokenList && tokenList.map((item) => (
          <TokenCard
            tokenName={item.tokenName}
            tokenSymbole={item.tokenSymbole}
            tokenLogo={item.tokenLogo}
            activeSale={item.activeSale}
            totalCap={item.totalCap}
            softCap={item.softCap}
            hardCap={item.hardCap}
            minContribution={item.minContribution}
            maxContribution={item.maxContribution}
            tokenState={item.tokenState}
          >
            <img src={item.tokenLogo} alt="token icon" />
          </TokenCard>
        ))}
      </TokenListContainder>
      <PaginationWrapper>
        <Pagination
          count={5}
          siblingCount={0}
        />
      </PaginationWrapper>
    </Wrapper>
  )
}

export default Presale
