import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { IconButton, Toggle, Text, Flex } from '@sphynxswap/uikit'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import SearchIcon from "components/Icon/SearchIcon";
import ToggleView, { ViewMode } from './ToggleView/ToggleView'

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 25px;

  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
  padding: 15px;
  border-radius: 3px;
  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const ControlStretch = styled(Flex)`
    height: 40px;
    margin-right: 38px;
    background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
    > div {
        flex: 1;
        height: 40px;
        border-radius: 5px;
        box-sizing: border-box;
        background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
        > div {
            border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
            height: 40px;
            background: ${({ theme }) => theme.isDark ? "#0E0E26" : "#2A2E60"};
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

const ContractCard = styled(Text)`
  padding: 0 4px;
  height: 40px;
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
    margin: 0;
    border: 1px solid ${({ theme }) => theme.isDark ? "#2E2E55" : "#4A5187"};
    border-radius: 5px;
  }
`
const TransparentIconButton = styled(IconButton)`
  background-color: transparent !important;
  margin: 0px 3px;
  border: none;
  outline: none !important;
`

const SearchPannel = ({ stakedOnly, setStakedOnly, viewMode, setViewMode }) => {
    const { t } = useTranslation()
    const [sortOption, setSortOption] = useState('hot')
    const [showDrop, setShowDrop] = useState(false)
    const [data, setdata] = useState([])
    const [addressSearch, setAddressSearch] = useState('')

    const handleSortOptionChange = (option: OptionProps): void => {
        setSortOption(option.value)
    }


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('')
        }
    }

    const onSearchKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            console.log('')
        } else if (event.key === 'ArrowUp') {
            console.log('')
        }
    }

    const handlerChange = (e: any) => {
        console.log('')
    }

    const submitFuntioncall = () => {
        console.log('')
    }

    const viewModeToggle = <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
    const stakedOnlySwitch = (
        <ToggleWrapper>
            <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
            <Text color='#A7A7CC'> {t('Stacked only')}</Text>
        </ToggleWrapper>
    )

    return (
        <ViewControls>
            <ControlStretch>
                <Select
                    options={[
                        {
                            label: t('Hot'),
                            value: 'hot',
                        },
                        {
                            label: t('APR'),
                            value: 'apr',
                        },
                        {
                            label: t('Earned'),
                            value: 'earned',
                        },
                        {
                            label: t('Total staked'),
                            value: 'totalStaked',
                        },
                    ]}
                    onChange={handleSortOptionChange}
                />
            </ControlStretch>
            <ContractCard>
                <SearchInputWrapper>
                    <input
                        placeholder="Search pools"
                        value={addressSearch}
                        onFocus={() => setShowDrop(true)}
                        onKeyPress={handleKeyPress}
                        onKeyUp={onSearchKeyDown}
                        onChange={handlerChange}
                    />
                    {showDrop && (
                        <MenuWrapper>
                            {data.length > 0 ? (
                                <span>
                                    ddd
                                </span>
                            ) : (
                                <span style={{ padding: '0 16px' }}>no pool</span>
                            )}
                        </MenuWrapper>
                    )}
                </SearchInputWrapper>
                <TransparentIconButton onClick={submitFuntioncall}>
                    <SearchIcon width="22px" height="22px" color={useTheme().colors.primary} />
                </TransparentIconButton>
            </ContractCard>
            {stakedOnlySwitch}
            {viewModeToggle}
        </ViewControls>
    )
}

export default SearchPannel
