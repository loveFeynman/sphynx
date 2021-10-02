/* eslint-disable no-console */
import { isAddress } from '@ethersproject/address'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import styled from 'styled-components'
import { Spinner } from '../../LotterySphx/components/Spinner'

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

const BuyersCard = () => {
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
          url: `https://thesphynx.co/api/top-trades?address=${address}&type=buy`,
          headers: {},
        }

        axios(config).then((response) => {
          if (response.data.length) setTableData(response.data)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTableData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <>
      {tableData.length > 0 ? (
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
                    <td style={{ color: '#04ab1d', fontWeight: 'bold' }}>
                      $ {td.usdAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableWrapper>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default BuyersCard
