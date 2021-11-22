import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { IconButton, Text, Flex, useMatchBreakpoints } from '@sphynxswap/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from "components/Icon/SearchIcon";

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
  padding: 0px 15px;
  margin: 21px 0px;
  border-radius: 3px;
  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: center;

    > div {
      padding: 0;
    }
  }
`

const ControlStretch = styled(Flex) <{ isMobile?: boolean }>`
    height: 47px;
    margin: 12px 0;
    margin-right: ${({ isMobile }) => isMobile ? '0' : '38px'};
    width: ${({ isMobile }) => isMobile ? '100%' : 'auto'};
    background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
    > div {
        flex: 1;
        height: 47px;
        border-radius: 5px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
        > div {
            border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
            height: 47px;
            background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
            > div {
                color: #A7A7CC;
            }
        }
  }
`

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  padding: 0 20px;
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
    color: #A7A7CC;
    font-size: 16px;
    &::placeholder {
      color: #A7A7CC;
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

const ContractCard = styled(Text) <{ isMobile?: boolean }>`
  padding: 0 4px;
  width: ${({ isMobile }) => isMobile ? '100%' : 'auto'};
  height: 47px;
  text-overflow: ellipsis;
  border-radius: 16px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
  border-radius: 5px;
  margin: 12px 0;
  & button:last-child {
    background: #8b2a9b;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
    border-radius: 5px;
  }
`
const TransparentIconButton = styled(IconButton)`
  background-color: transparent !important;
  margin: 0px 3px;
  border: none;
  outline: none !important;
  box-shadow: none;
}
`

const SearchPannel = () => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [showDrop, setShowDrop] = useState(false)
  const [data, setdata] = useState([])

  const setSortOption = (value: string) => {
    return value;
  }

  const setQuery = (value: string) => {
    return value;
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const handlerChange = (e: any) => {
    setQuery(e.target.value)
  }

  const submitFuntioncall = () => {
    console.log('search')
  }  

  return (
    <ViewControls>
      <ControlStretch isMobile={isMobile}>
        <Select
          options={[
            {
              label: t('ALL'),
              value: 'all',
            },
            {
              label: t('PENDDING'),
              value: 'pendding',
            },
            {
              label: t('ACTIVE'),
              value: 'active',
            },
            {
              label: t('ENDED'),
              value: 'ended',
            },
            {
              label: t('FAILED'),
              value: 'failed',
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </ControlStretch>
      <ContractCard isMobile={isMobile}>
        <SearchInputWrapper>
          <input
            placeholder="Search"
            onChange={handlerChange}
          />
          {showDrop && (
            <MenuWrapper>
              {data.length > 0 ? (
                <span>
                  ddd
                </span>
              ) : (
                null
                // <span style={{ padding: '0 16px' }}>no pool</span>
              )}
            </MenuWrapper>
          )}
        </SearchInputWrapper>
        <TransparentIconButton onClick={submitFuntioncall}>
          <SearchIcon width="22px" height="22px" color={useTheme().colors.primary} />
        </TransparentIconButton>
      </ContractCard>
    </ViewControls>
  )
}

export default SearchPannel
