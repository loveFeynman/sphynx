import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { useTheme } from 'styled-components'
import { IconButton, Link, Text, useMatchBreakpoints } from '@sphynxswap/uikit'
import SearchIcon from "components/Icon/SearchIcon";
import { PoolData } from 'state/info/types'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import { fetchPoolData } from 'state/info/queries/pools/poolData'

import CopyHelper from 'components/AccountDetails/Copy'
import './dropdown.css'
import axios from 'axios'
import { MenuItem } from '@material-ui/core'
import { socialToken } from 'utils/apiServices'
import ToggleList from './ToggleList'
import LiveAmountPanel from './LiveAmountPanel'
import { AppState } from '../../../state'
import { setIsInput, typeInput } from '../../../state/input/actions'
import { isAddress } from '../../../utils'
import { useTranslation } from '../../../contexts/Localization'

export interface ContractPanelProps {
  value: any
  symbol: string
  amount: number
  price: number
}

const ContractPanelWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.isDark ?  "#0E0E26": "#2A2E60"};
  padding: 15px 12px;
  flex-direction: column;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 15px 12px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    & > div {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
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
    border-radius: 5px;
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
    font-size: 13px;
    &::placeholder {
      color: #8f80ba;
    }
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

const TransparentIconButton = styled(IconButton)`
  background-color: transparent !important;
  margin: 0px 3px;
  border: none;
  box-shadow: unset;
`

const SearchInputDivider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.isDark ? "#A7A7CC" : "#4A5187"};
  margin-left: 2px;
  margin-right: 8px;
  height: 20px;
`

// {token} : ContractPanelProps)
export default function ContractPanel({ value, symbol, amount, price }: ContractPanelProps) {
  const [addressSearch, setAddressSearch] = useState('')
  const [show, setShow] = useState(true)
  const [showDrop, setShowDrop] = useState(false)
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

  const checksumAddress = isAddress(input)
  const [data, setdata] = useState([])
  const dispatch = useDispatch()

  const [social, setSocial] = useState({
    website: '',
  })

  const [twitterUrl, setTwitter] = useState('')
  const [telegramUrl, setTelegram] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)

  const [poolDatas, setPoolDatas] = useState<PoolData[]>([])
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  const getWebsite = useCallback(async () => {
    const web: any = await socialToken(checksumAddress.toString());
    const links = web.links || []
    const twitter = links.find((e) => e.name === 'twitter')
    const telegram = links.find((e) => e.name === 'telegram')

    if (twitter) {
      setTwitter(twitter.url)
    }

    if (telegram) {
      setTelegram(telegram.url)
    }

    setSocial(web)
  }, [checksumAddress])

  const handlerChange = (e: any) => {
    try {
      if (e.target.value && e.target.value.length > 0) {
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/search/${e.target.value}`).then((response) => {
          setdata(response.data)
        })
      } else {
        setdata([])
      }
    } catch (err) {
      throw new Error(err)
    }

    const result = isAddress(e.target.value)
    if (result) {
      setAddressSearch(e.target.value)
      setShow(false)
    } else {
      setAddressSearch(e.target.value)
      setShow(true)
    }
  }
  const submitFuntioncall = () => {
    dispatch(typeInput({ input: addressSearch }))
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

  useEffect(() => {
    const ac = new AbortController();
    const fetchPools = async () => {
      if (checksumAddress) {
        const { addresses } = await fetchPoolsForToken(checksumAddress.toLocaleLowerCase())
        const { poolDatas: poolDatas1 } = await fetchPoolData(addresses)
        setPoolDatas(poolDatas1)

      }
    }
    fetchPools()

    getWebsite()

    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        // console.log("Enter key was pressed. Run your function.");
        // callMyFunction();
      }
    }

    document.addEventListener('keydown', listener, { passive: true })
    return () => {
      document.removeEventListener('keydown', listener)
      ac.abort();
    }

  }, [input, checksumAddress, getWebsite])

  return (
    <ContractPanelWrapper>
      <ToggleList poolDatas={poolDatas} />
      <ContractCard>
        <CopyHelper toCopy={value ? value.contractAddress : addressSearch}>&nbsp;</CopyHelper>
        <SearchInputDivider />
        <SearchInputWrapper>
          <input
            placeholder="Enter token name/address..."
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
                  {data?.map((item: any, index: number) => {
                    return (
                      <Link
                        href={`/swap/${item.address}`}
                        onClick={() => {
                          setdata([])
                          setShowDrop(false)
                          dispatch(setIsInput({ isInput: true }))
                        }}
                      >
                        <MenuItem
                          className={index === selectedItemIndex ? 'selectedItem' : ''}
                        >
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
        <TransparentIconButton onClick={submitFuntioncall}>
          <SearchIcon width="22px" height="22px" color={useTheme().colors.primary}/>
        </TransparentIconButton>
      </ContractCard>
      {isMobile ?
        < LiveAmountPanel symbol={symbol} amount={amount} price={price} />
        : null
      }
      {showDrop && <ContractPanelOverlay onClick={() => setShowDrop(false)} />}
    </ContractPanelWrapper>
  )
}
