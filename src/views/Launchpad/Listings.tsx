import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import Select, { OptionProps } from 'components/Select/Select'
import { Button, Text } from '@sphynxswap/uikit'
import SearchInput from 'components/SearchInput'
import { useTranslation } from 'contexts/Localization'
import MainLogo from 'assets/svg/icon/logo_new.svg'
import ShivaLogo from 'assets/images/ShivaTokenIcon.png'
import SnifferIcon from 'assets/images/SnifferIcon.png'
import LamboIcon from 'assets/images/LamboIcon.png'
import AfiIcon from 'assets/images/AFIIcon.png'
import GalabetIcon from 'assets/images/GalabetIcon.png'
import BinanceLogo from 'assets/images/BSCNetworkIcon.png'
import { useMenuToggle } from 'state/application/hooks'
import TokenCard from './components/TokenCard'
import Pagenation from './components/Pagenation'

const SORTBY_OPTIONS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "First",
    value: "first",
  },
  {
    label: "Second",
    value: "second",
  },
]

const TOKEN_DATA = [
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: MainLogo,
    activeSale: 19,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "active",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: ShivaLogo,
    activeSale: 4,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "active",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: SnifferIcon,
    activeSale: 88,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "active",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: LamboIcon,
    activeSale: 65,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "active",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: AfiIcon,
    activeSale: 36,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "pending",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: GalabetIcon,
    activeSale: 64,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "failed",
  },
  {
    tokenName: "sphynx token",
    tokenSymbole: "sphynx",
    tokenLogo: MainLogo,
    activeSale: 78,
    softCap: 150,
    hardCap: 300,
    minContribution: 0.1,
    maxContribution: 3,
    tokenState: "active",
  },
]

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  margin: 24px 0 40px;
  text-align: left;
  .ml16 {
    margin-left: 16px;
  }
  .ml32 {
    margin-left: 32px;
  }
  p {
    line-height: 24px;
  }
  p.w110 {
    width: 110px;
  }
  p.w80 {
    width: 80px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    align-items: flex-start;
  }
`

const LogoTitle = styled.h2`
  font-size: 24px;
  line-height: 24px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 36px;
    line-height: 42px;
  }
`

const InputWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
  div:last-child {
    input {
      border-radius: 8px;
      border: unset;
      height: 34px;
      max-width: 192px;
      width: 100%;
      background: ${({ theme }) => (theme.isDark ? "#0E0E26" : "#2A2E60")};
    }
  }
`

const SelectWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
  div: last-child {
    background: ${({ theme }) => (theme.isDark ? "#0E0E26" : "#2A2E60")};
    border-radius: 8px;
    div {
      border-radius: 8px;
      border: unset;
      background: ${({ theme }) => (theme.isDark ? "#0E0E26" : "#2A2E60")};
    }
  }
`

const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  padding: 8px 0px;
  margin-top: 38px;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column;
    align-items: end;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: unset;
    align-items: center;
  }
`

const LoadMoreWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  width: 100%;
  justify-content: center;
`

const TokenListContainder = styled.div<{ toggled: boolean }>`
  margin-top: 24px;
  display: grid;
  grid-gap: 20px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(${(props) => (props.toggled ? '3' : '2')}, 1fr);
  }
  @media screen and (min-width: 1320px) {
    grid-template-columns: repeat(${(props) => (props.toggled ? '4' : '3')}, 1fr);
  }
  @media screen and (min-width: 1720px) {
    grid-template-columns: repeat(${(props) => (props.toggled ? '5' : '4')}, 1fr);
  }
`

const LogoTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: column-reverse;
    gap: 40px;
    align-items: center;

  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: unset;
    gap: unset;
    align-items: unset;
  }
`

const MobileButtonWrapper = styled.div`
  display: flex;
  button {
    height: 40px;
    width: 100%;
    max-width: 164px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 100%;
    justify-content: flex-end;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: unset;
    justify-content: unset;
  }
`

const Presale: React.FC = () => {
  const [sortyBy, setSortBy] = useState('')
  const { t } = useTranslation()
  const { menuToggled } = useMenuToggle()

  const handleSortOptionChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleChangeQuery = (e) => {
    console.log(e)
  }

  return (
    <Wrapper>
      <LogoTitleWrapper>
        <LogoTitle>LaunchPad Listings</LogoTitle>
        <MobileButtonWrapper>
          <Button style={{ borderRadius: "32px", padding: "12px" }}>
            <img src={BinanceLogo} width="24" height="24" alt="network icon" />
            <Text ml="10px" fontWeight="500">BSC Network</Text>
          </Button>
        </MobileButtonWrapper>
      </LogoTitleWrapper>
      <FilterContainer>
        <SelectWrapper>
          <Text textTransform="uppercase">{t('Sort by')}</Text>
          <Select
            options={SORTBY_OPTIONS}
          />
        </SelectWrapper>
        <InputWrapper>
          <Text textTransform="uppercase">{t('Search')}</Text>
          <SearchInput onChange={handleChangeQuery} placeholder="" />
        </InputWrapper>
      </FilterContainer>
      <TokenListContainder toggled={menuToggled}>
        {TOKEN_DATA.map((item) => (
          <TokenCard tokenName={item.tokenName} tokenSymbole={item.tokenSymbole} tokenLogo={item.tokenLogo} activeSale={item.activeSale} softCap={item.softCap} hardCap={item.hardCap} minContribution={item.minContribution} maxContribution={item.maxContribution} tokenState={item.tokenState}>
            <img src={item.tokenLogo} alt="token icon" />
          </TokenCard>
        ))}
      </TokenListContainder>
      <LoadMoreWrapper>
        <Button>Load More</Button>
      </LoadMoreWrapper>
      <Pagenation pageCount="10" />
    </Wrapper>
  )
}

export default Presale
