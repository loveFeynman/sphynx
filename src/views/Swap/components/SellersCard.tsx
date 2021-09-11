/* eslint-disable no-console */
// import { useWeb3React } from '@web3-react/core'
// import moment from 'moment'
import { isAddress } from '@ethersproject/address'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import styled from 'styled-components'

const TableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: auto;
  & table {
    background: transparent;
    min-width: 420px;
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

const SellersCard = () => {
  const [tableData, setTableData] = useState([])
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

  const result = isAddress(input)
  // eslint-disable-next-line no-console

  const getTableData = async () => {
    const address = input
    const from = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    const to = new Date().toISOString()
    try {
      if (result && address && from && to) {
        const config: any = {
          method: 'get',
          url: `https://api1.poocoin.app/top-trades?address=${address}&from=${from}&to=${to}&type=sell`,
          headers: {},
        }

        axios(config).then((response) => {
          if (response.data.wallet !== null && response.data.usdAmount !== null) {
            setTableData(response.data)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setInterval(() => {
      getTableData()
    }, 5000)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

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
              <td>Wallet</td>
              <td>Total Bought</td>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((td) => {
              return (
                <tr style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  <td style={{ color: '#fff', fontWeight: 'bold' }}>{td.wallet}</td>
                  <td style={{ color: '#ea3843', fontWeight: 'bold' }}>
                    $ {td.usdAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableWrapper>
    </>
  )
}

export default SellersCard
