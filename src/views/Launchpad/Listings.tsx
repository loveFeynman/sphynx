import React from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { useTranslation } from 'contexts/Localization'
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

const Presale: React.FC = () => {
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()

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
        {TOKEN_DATA.map((item) => (
          <TokenCard
            tokenName={item.tokenName}
            tokenSymbole={item.tokenSymbole}
            tokenLogo={item.tokenLogo}
            activeSale={item.activeSale}
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
