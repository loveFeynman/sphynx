/* eslint-disable array-callback-return */
/* eslint-disable no-self-compare */
/* eslint-disable no-console */
import { Flex } from '@pancakeswap/uikit'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDerivedSwapInfo } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { AppState } from '../../../state'
import { isAddress } from '../../../utils'

const TableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: hidden;
  & table {
    background: transparent;
    width: 100%;
    & tr {
      background: transparent;
    }
    & td {
      padding: 8px;
    }
    & thead {
      & td {
        color: white;
        font-size: 16px;
        border-bottom: 1px solid white;
        padding: 16px 8px;
        & > div > div {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    & tbody {
      & tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        & h2 {
          font-size: 14px;
          line-height: 16px;
          font-weight: bold;
          &.success {
            color: #00ac1c;
          }
          &.error {
            color: #ea3943;
          }
        }
      }
    }
  }
`

const TransactionCard = () => {
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const isInput = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.isInput)
  const result = isAddress(input)
  const [socketData, setSocketData]: any = useState({})
  const [dataArr, setDataArr] = useState([])
  const { currencies } = useDerivedSwapInfo()
  const token = currencies[isInput ? Field.OUTPUT : Field.INPUT]

  const getDataQuery = `
  {
  ethereum(network: bsc) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 100, offset: 0}
      date: {since: "2021-08-05", till: null}
      baseCurrency: {is: "${input}"}
      quoteCurrency:{is : "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
      ) {
      block {
        timestamp {
        time(format: "%Y-%m-%d %H:%M:%S")
        }
        height
      }
      tradeIndex
      protocol
      exchange {
        fullName
      }
      smartContract {
        address {
        address
        annotation
        }
      }
      baseAmount
      baseCurrency {
        address
        symbol
      }
      quoteAmount
      quoteCurrency {
        address
        symbol
      }
      transaction {
        hash
      }
      buyCurrency {
        symbol
        address
        name
      }
      sellCurrency {
        symbol
        address
        name
        }
      price
      quotePrice
      }
    }
  }`

  useEffect(() => {
    let socket;
    if (token) {
      const tokenData = token.symbol.toLowerCase()
      const websocketUrl = `wss://stream.binance.com:9443/ws/${tokenData}usdt@trade`
      socket = new W3CWebSocket(websocketUrl)
  
      const array = []
      setDataArr([])
  
      socket.onmessage = (event: any) => {
        if (array.length <= 30) {
          array.unshift(JSON.parse(event.data))
        } else {
          array.pop()
          array.unshift(JSON.parse(event.data))
        }
  
        return setDataArr(array)
      }  
    }

    // effect cleanup function
    return () => {
      // any socket closure logic, cleanup etc..
      socket = null
    }
  }, [token]) // <-- empty dependency array

  // useEffect(() => {
  //   dataArr.map((dt) => {
  //     setSocketData(dt)
  //   })
  // }, [dataArr])
  // eslint-disable-next-line no-console

  // const t = socketData.T
  // const localdate = new Date(t)
  // const d = new Date(localdate.getTime() + localdate.getTimezoneOffset() * 60 * 1000)
  // const offset = localdate.getTimezoneOffset() / 60
  // const hours = localdate.getHours()
  // const lcl = d.setHours(hours - offset)
  // const date = new Date(lcl)
  // const d = new Date(Date.UTC(localdate.getFullYear(), localdate.getMonth(), localdate.getDate(),  localdate.getHours(), localdate.getMinutes(), localdate.getSeconds()));
  // const d :any=new Date(localdate.getTime()+ localdate.getTimezoneOffset()*60*1000);
  // const localtime=d;

  // console.log("localtime============",localtime);

  // eslint-disable-next-line no-console
  return (
    <>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <td style={{ width: '30%' }}>Time</td>
              <td style={{ width: '24%' }}>Traded Tokens</td>
              <td style={{ width: '22%' }}>Token Price</td>
              <td style={{ width: '22%' }}>$Value</td>
            </tr>
          </thead>
          <tbody>
            {dataArr.map((data) => {
              const t = data.T
              const localdate = new Date(t)
              const d = new Date(localdate.getTime() + localdate.getTimezoneOffset() * 60 * 1000)
              const offset = localdate.getTimezoneOffset() / 60
              const hours = localdate.getHours()
              const lcl = d.setHours(hours - offset)
              const date = new Date(lcl)
              return (
                <tr>
                  <td style={{ width: '35%' }}>
                    <Flex alignItems="center">
                      <h2 className={data.m ? 'success' : 'error'}>{date.toString().split('GMT')[0]}</h2>
                    </Flex>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.m ? 'success' : 'error'}> {Number(data.q).toFixed(6)}</h2>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.m ? 'success' : 'error'}>
                      $
                      {Number(data.p)
                        .toFixed(4)
                        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </h2>
                  </td>
                  <td style={{ width: '25%' }}>
                    <h2 className={data.m ? 'success' : 'error'}>
                      ${(data.p * data.q).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </h2>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableWrapper>
      {/* {loader ?
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<BoxesLoader
						boxColor="#8b2a9b"
						shadowColor="#aa8929"
						style={{ marginBottom: "20px", position: 'absolute', left: 567, top: 455 }}
						desktopSize="30px"
						mobileSize="15px"
					/>
				</div>
				: ""
			} */}
    </>
  )
}

export default TransactionCard

// const offset = new Date().getTimezoneOffset();
// console.log(offset);
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// let t:any=timezone
// console.log("t=========================",t)
// t=val.block.timestamp.time
// // // eslint-disable-next-line no-console
// const currentTime = moment().tz(t).format();
// // // eslint-disable-next-line no-console
// const today:any = new Date(currentTime);