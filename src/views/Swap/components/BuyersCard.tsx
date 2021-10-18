/* eslint-disable no-console */
import { isAddress } from '@ethersproject/address'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import styled from 'styled-components'
import { Flex } from '@sphynxswap/uikit'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'contexts/Localization'
import { Spinner } from '../../LotterySphx/components/Spinner'
import { topTrades } from '../../../utils/apiServices'

const TableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  position: relative;
  width: 100%;
  & table {
    background: transparent;
    min-width: 280px;
    width: 100%;
    max-width: 100%;
    word-break: break-all;
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
        
        & td {
          a:hover {
            color: white;
            text-decoration: underline;
            text-decoration-color: #007bff;
            -webkit-text-decoration-color: #007bff;
          }
        }
      }
    }
  }
`

const BuyersCard = () => {
  const [tableData, setTableData] = useState([])
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const { t } = useTranslation()

  const result = isAddress(input)
  // eslint-disable-next-line no-console

  const getTableData = async () => {
    const address = input
    const from = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    const to = new Date().toISOString()
    try {
      if (result && address && from && to) {
        const topBuyers = await topTrades(address, 'buy');
        if (topBuyers) {
          setTableData(topBuyers);
        }
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
                <td>{t('Wallet')}</td>
                <td>{t('Total Bought')}</td>
              </tr>
            </thead>
            <tbody>
              {tableData?.map(item => ({
                ...item,
                id: uuidv4()
              })).map((td) => {
                return (
                  <tr key={td.id} style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    <td style={{ color: '#fff', fontWeight: 'bold' }}>
                      <a href={`https://bscscan.com/token/0x2e121ed64eeeb58788ddb204627ccb7c7c59884c?a=${td.wallet}`} target="_blank" rel="noreferrer">
                        {td.wallet}
                      </a>
                    </td>
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
