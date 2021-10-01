/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import Marquee from 'react-fast-marquee'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import ReactLoading from 'react-loading'
import { BITQUERY_API, BITQUERY_API_KEY } from 'config/constants/endpoints'
import { HotTokenType } from './types'
import { AppState } from '../../../state'
import { setIsInput } from '../../../state/input/actions'

export interface HotTokenBarProps {
  tokens?: HotTokenType[] | null
}

const StyledBar = styled.div`
  width: 100%;
  display: flex;
  & span {
    font-family: 'Roboto Regular';
  }
`

const FlowBar = styled.div`
  width: calc(100% - 100px);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0px 12px 12px 0px;
  padding: 6px;
`

const BarIntro = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: #fff;
  background-color: #101010;
  border-radius: 8px 0px 0px 8px;
  & span {
    font-size: 12px;
    line-height: 14px;
  }
`

export default function HotTokenBar() {
  const [data, setData] = React.useState([
    {
      currency: {
        symbol: '',
        name: '',
      },
    },
  ])
  const [loader, setLoader] = useState(false)
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const dispatch = useDispatch()

  const prevDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
  const currentDate =moment().format('YYYY-MM-DD')
  const getDataQuery = `
  {
    ethereum(network: bsc) {
      dexTrades(
        options: {desc: "currencyAmount", limit: 10 }
        date: {since: "${prevDate}", till: "${currentDate}"}
        baseCurrency: {notIn: ["BNB", "", "WBNB", "BTCB", "ETH", "BUSD", "USDT", "USDC", "DAI"]}
      ) {
        currency: baseCurrency {
          symbol
          address
        }
        count
        currencyAmount: baseAmount(in: USD)
        dates: count(uniq: dates)
        started: minimum(of: date)
      }
    }
  }`

  const handleClick = useCallback(async () => {
    setLoader(true)
    const bitConfig = {
      headers: {
        'X-API-KEY': BITQUERY_API_KEY,
      },
    }
    const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery }, bitConfig)
    // setData(queryResult);
    if (queryResult.data.data) {
      setData(queryResult.data.data.ethereum.dexTrades)
      setLoader(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    handleClick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <StyledBar>
        <BarIntro>
          <span>Top Pairs</span>
        </BarIntro>

        <FlowBar>
          {loader ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ReactLoading type="spin" color="green" height="2%" width="2%" />
            </div>
          ) : (
            <Marquee
              gradient={false}
              speed={40}
              className="marquee-container"
              style={{ overflow: 'hidden !important' }}
            >
              <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center' }}>
                {data.map((elem: any, index) => {
                  return (
                    <li key={`${index + 1}.${elem.currency.symbol}`} style={{ color: 'white', padding: '12' }}>
                      <a
                        href={`#/swap/${elem.currency.address}`}
                        style={{ marginRight: 20, textDecoration: 'none' }}
                        onClick={() => {
                          dispatch(setIsInput({ isInput: true }))
                        }}
                      >{`${index + 1}. ${elem.currency.symbol}`}</a>
                    </li>
                  )
                })}
              </ul>
            </Marquee>
          )}
        </FlowBar>

        <div className="paddingRight: 30px" />
      </StyledBar>
    </>
  )
}
