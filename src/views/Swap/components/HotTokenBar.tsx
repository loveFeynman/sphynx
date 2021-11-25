/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import Marquee from 'react-easy-marquee'
// import { useDispatch, useSelector } from 'react-redux'
// import moment from 'moment'
import { useTranslation } from 'contexts/Localization'
import { HotTokenType } from './types'
// import { AppState } from '../../../state'

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
  background-color: transparent;
  border-radius: 0px 12px 12px 0px;
  padding: 6px;
`

const BarIntro = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background-color: transparent;
  border-radius: 8px 0px 0px 8px;
  & span {
    color: #a7a7cc;
    font-size: 12px;
    font-weight: bold;
    line-height: 14px;
    text-transform: uppercase;
  }
`

export default function HotTokenBar() {
  const data = [
    {
      currency: {
        symbol: 'SPHYNX BSC',
        name: 'SPHYNX BSC',
        address: '0xd38ec16caf3464ca04929e847e4550dcff25b27a',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
    {
      currency: {
        symbol: '??',
        name: '??',
        address: '',
      },
    },
  ]
  // const [data, setData] = React.useState([
  //   {
  //     currency: {
  //       symbol: '',
  //       name: '',
  //     },
  //   },
  // ])
  // const [loader, setLoader] = useState(false)
  // const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  // const dispatch = useDispatch()
  const { t } = useTranslation()

  // const prevDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
  // const currentDate = moment().format('YYYY-MM-DD')
  // const getDataQuery = `
  // {
  //   ethereum(network: bsc) {
  //     dexTrades(
  //       options: {desc: "currencyAmount", limit: 10 }
  //       date: {since: "${prevDate}", till: "${currentDate}"}
  //       baseCurrency: {notIn: ["BNB", "", "WBNB", "BTCB", "ETH", "BUSD", "USDT", "USDC", "DAI"]}
  //     ) {
  //       currency: baseCurrency {
  //         symbol
  //         address
  //       }
  //       count
  //       currencyAmount: baseAmount(in: USD)
  //       dates: count(uniq: dates)
  //       started: minimum(of: date)
  //     }
  //   }
  // }`

  // const handleClick = useCallback(async () => {
  //   setLoader(true)
  //   const bitConfig = {
  //     headers: {
  //       'X-API-KEY': BITQUERY_API_KEY,
  //     },
  //   }
  //   const queryResult = await axios.post(BITQUERY_API, { query: getDataQuery }, bitConfig)
  //   if (queryResult.data.data) {
  //     setData(queryResult.data.data.ethereum.dexTrades)
  //     setLoader(false)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // React.useEffect(() => {
  //   handleClick()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <>
      <StyledBar>
        <BarIntro>
          <span>{t('Top Pairs')}</span>
        </BarIntro>

        <FlowBar>
          <Marquee pauseOnHover duration={20000} reverse={true} height="36px" width="100%">
            <>
              <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center' }}>
                {data.map((elem: any, index) => {
                  return elem.currency.address !== '' ? (
                    <li
                      key={`${index + 1}.${elem.currency.symbol}`}
                      style={{ color: 'white', padding: '12', paddingInlineEnd: '24px' }}
                    >
                      <a href={`/swap/${elem.currency.address}`} style={{ marginRight: 20, textDecoration: 'none' }}>
                        <span style={{ color: index === 0 ? 'yellow' : 'white', fontSize: '14px' }}>{`${
                          index + 1
                        }. `}</span>
                        {`${elem.currency.symbol}`}
                      </a>
                    </li>
                  ) : (
                    <li
                      key={`${index + 1}.${elem.currency.symbol}`}
                      style={{ color: 'white', padding: '12', paddingInlineEnd: '24px' }}
                    >
                      <span style={{ color: index === 0 ? 'yellow' : 'white', fontSize: '14px' }}>{`${
                        index + 1
                      }. `}</span>
                      {`${elem.currency.symbol}`}
                    </li>
                  )
                })}
              </ul>
              <div style={{ width: window.screen.width > 1080 ? '720px' : window.screen.width * 0.7 + 'px' }} />
            </>
          </Marquee>
          {/* {loader ? (
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
          )} */}
        </FlowBar>

        <div className="paddingRight: 30px" />
      </StyledBar>
    </>
  )
}
