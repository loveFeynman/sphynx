/* eslint-disable */
import React from 'react'
import styled from 'styled-components'
import { Flex } from '@sphynxswap/uikit'
import ERC20ABI from '../../../assets/abis/erc20.json'
import routerABI from '../../../assets/abis/pancakeRouter.json'
import { Spinner } from '../../LotterySphx/components/Spinner'
import { useTranslation } from 'contexts/Localization'

const abi: any = ERC20ABI
const routerAbi: any = routerABI

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

interface TransactionProps {
  transactionData?: any
  isLoading?: boolean
}

const TransactionCard: React.FC<TransactionProps> = (props) => {
  const { t } = useTranslation()
  // eslint-disable-next-line no-console
  return (
    <>
      {props.isLoading ? (
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <td style={{ width: '30%' }}>{t('Time')}</td>
                <td style={{ width: '24%' }}>{t('Traded Tokens')}</td>
                <td style={{ width: '22%' }}>{t('Token Price')}</td>
                <td style={{ width: '22%' }}>{t('$Value')}</td>
              </tr>
            </thead>
            <tbody>
              {props.transactionData.map((data, key) => {
                return (
                  <tr key={key}>
                    <td style={{ width: '35%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <Flex alignItems="center">
                          <h2 className={!data.isBuy ? 'success' : 'error'}>{data.transactionTime}</h2>
                        </Flex>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          {Number(data.amount)
                            .toFixed(4)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '1,')}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          $
                          {data.price < 0.00001
                            ? data.price
                            : Number(data.price)
                                .toFixed(4)
                                .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                        </h2>
                      </a>
                    </td>
                    <td style={{ width: '25%' }}>
                      <a href={'https://bscscan.com/tx/' + data.tx} target="_blank" rel="noreferrer">
                        <h2 className={!data.isBuy ? 'success' : 'error'}>
                          ${(data.price * data.amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                        </h2>
                      </a>
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

export default TransactionCard
