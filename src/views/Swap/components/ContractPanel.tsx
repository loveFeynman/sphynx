/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Button, Link, Text } from '@sphynxswap/uikit'

import { ReactComponent as TwitterIcon } from 'assets/svg/icon/TwitterIcon.svg'
// eslint-disable-next-line import/no-cycle
import { ReactComponent as SocialIcon2 } from 'assets/svg/icon/SocialIcon2.svg'
import { ReactComponent as TelegramIcon } from 'assets/svg/icon/TelegramIcon.svg'
import { ReactComponent as BscscanIcon } from 'assets/svg/icon/Bscscan.svg'

import { RouterTypeToggle } from 'config/constants/types'
import { PoolData } from 'state/info/types'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import { fetchPoolData } from 'state/info/queries/pools/poolData'

import CopyHelper from 'components/AccountDetails/Copy'
// eslint-disable-next-line import/no-unresolved
import './dropdown.css'
import axios from 'axios'
import { MenuItem } from '@material-ui/core'
import ToggleList from './ToggleList'
import { AppState } from '../../../state'
import { setIsInput, typeInput, typeRouterVersion } from '../../../state/input/actions'
import { getBscScanLink, isAddress } from '../../../utils'
import { searchToken } from '../../../utils/apiServices'

export interface ContractPanelProps {
  value: any
}

const ContractPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // margin-bottom: 28px;
  & > div {
    margin-bottom: 12px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  margin: 12px 0;
  & button:last-child {
    background: #8b2a9b;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
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
    font-size: 16px;
    &::placeholder {
      color: #8f80ba;
    }
  }
`

const SocialIconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  & svg {
    margin: 0 11px;
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

export default function ContractPanel({ value }: ContractPanelProps) {
  const [addressSearch, setAddressSearch] = useState('')
  const [show, setShow] = useState(true)
  const [showDrop, setShowDrop] = useState(false)
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

  const checksumAddress = isAddress(input)
  // eslint-disable-next-line no-console
  const [data, setdata] = useState([])
  const dispatch = useDispatch()
  const [social, setSocial] = useState({
    website: '',
  })

  const [twitterUrl, setTwitter] = useState('')
  const [telegramUrl, setTelegram] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)

  const [poolDatas, setPoolDatas] = useState<PoolData[]>([])
  const getWebsite = async () => {
    const web: any = await axios.get(`https://thesphynx.co/api/socials/${checksumAddress}`)
    const links = web.data.data.links || []
    const twitter = links.find((e) => e.name === 'twitter')
    const telegram = links.find((e) => e.name === 'telegram')

    if (twitter) {
      setTwitter(twitter.url)
    }

    if (telegram) {
      setTelegram(telegram.url)
    }

    setSocial(web.data.data)
  }

  const handlerChange = async (e: any) => {
    try {
      if (e.target.value && e.target.value.length > 0) {
        searchToken(e.target.value).then((response) => {
          setdata(response)
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
    const fetchPools = async () => {
      if (checksumAddress) {
        const { error: fetchError, addresses } = await fetchPoolsForToken(checksumAddress.toLocaleLowerCase())
        const { error: fetchError2, poolDatas: poolDatas1 } = await fetchPoolData(addresses)
        setPoolDatas(poolDatas1)
      }
    }

    console.log('start fetchPools')
    fetchPools()

    getWebsite()

    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        console.log("Enter key was pressed. Run your function.");
      }
    }

    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <ContractPanelWrapper>
      <ContractCard>
        <CopyHelper toCopy={value ? value.contractAddress : addressSearch}>&nbsp;</CopyHelper>
        <SearchInputWrapper>
          <input
            placeholder=""
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
                        href={`#/swap/${item.address}`}
                        onClick={() => {
                          dispatch(setIsInput({ isInput: true }))
                        }}
                      >
                        <MenuItem
                          className={index === selectedItemIndex ? 'selectedItem' : ''}
                          onClick={() => {
                            dispatch(typeRouterVersion({ routerVersion: RouterTypeToggle[0].key }))
                          }}
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
        <Button scale="sm" onClick={submitFuntioncall} disabled={show}>
          Submit
        </Button>
      </ContractCard>
      <ToggleList poolDatas={poolDatas} />
      <SocialIconsWrapper>
        <Link href={getBscScanLink(checksumAddress === false ? '' : checksumAddress, 'token')} external>
          <BscscanIcon />
        </Link>
        <Link external href={twitterUrl}>
          <TwitterIcon />
        </Link>
        <Link external href={social.website}>
          <SocialIcon2 />
        </Link>
        <Link external href={telegramUrl}>
          <TelegramIcon />
        </Link>
      </SocialIconsWrapper>
      {showDrop && <ContractPanelOverlay onClick={() => setShowDrop(false)} />}
    </ContractPanelWrapper>
  )
}
