import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, useMatchBreakpoints } from '@sphynxdex/uikit'
import { ReactComponent as MainLogo } from 'assets/svg/icon/logo_new.svg'
import styled from 'styled-components'
import Spinner from 'components/Loader/Spinner'
import TimerComponent from 'components/Timer/TimerComponent';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: white;
  padding: 5px;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
  p {
    line-height: 24px;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 24px;
  }
`

const PageHeader = styled.div`
  width: 100%;
`

const WelcomeText = styled(Text)`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  font-size: 20px;
  text-align: left;
  padding: 0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 30px;
  }
`

const TokenPresaleBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => (theme.isDark ? '#0E0E26' : '#191C41')};
  padding: 23px 28px;
  border-radius: 5px;
  margin-top: 30px;
`

const TokenPresaleContainder = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  background: ${({ theme }) => (theme.isDark ? '#1A1A3A' : '#2A2E60')};
  min-width: 240px;
  height: fit-content;
  padding: 14px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px 34px;
  }
`

const MainCardWrapper = styled(CardWrapper)`
  width: auto;
`

const SubCardWrapper = styled(CardWrapper)`
  width: 350px;
  padding: 20px 14px;
`

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 24px;
    gap: 16px;
`

const TokenWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
    flex: 2;
`

const TokenImg = styled.div`
    img {
        width: 64px;
        height: 64px;
        max-width: unset;
    }
`

const TokenSymbolWrapper = styled.div`
    div:first-child {
        font-weight: bold;
        font-size: 20px;
        text-transform: capitalize;
    }
    div:last-child {
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        color: #A7A7CC;
        text-transform: capitalize;
    }
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  flex-direction: row;
  div {
    font-size: 14px;
  }
  div:last-child {
    color: #f2c94c;
    font-size: 12px;
    font-weight: 600;
    word-break: break-word;
    text-align: left;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const SaleInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const SaleInfoTitle = styled.div`
    color: #A7A7CC;
    font-weight: 600;
    font-size: 14px;
`

const SaleInfoValue = styled.div`
    color: #F2C94C;
    font-weight: 600;
    font-size: 14px;
`

const Divider = styled.div`
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 16px 0px;
`

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.isDark ? "#1A1A3A" : "#2A2E60"};
  border-radius: 8px;
  height: 100%;
  max-height: 500px;
  overflow: auto;
  overflow-x: hidden;
  margin-top: 10px;
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
        font-size: 14px;
        text-align: left;
        vertical-align: middle;
        background: transparent;
        padding: 16px 8px;
        font-weight: 600;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          font-size: 12px;
          line-height: 16px;
          word-break: break-word;
          font-weight: 600;
          text-align: left;
          &.success {
            color: ${({ theme }) => theme.isDark ? "#219653" : "#77BF3E"};
          }
          &.error {
            color: ${({ theme }) => theme.isDark ? "#EB5757" : "#F84364"};
          }
        }
      }
    }
  }
`

const DetailLocker: React.FC = () => {
    const { t } = useTranslation()
    const { isXl } = useMatchBreakpoints()
    const [tokenInfo, setTokenInfo] = useState(null)
    const [cpkSchedules, setCpkSchedules] = useState(null)
    const isMobile = !isXl

    useEffect(() => {
        const info = {
            id: 0,
            tokenLogo: "https://sphynxtoken.co/static/media/Sphynx-Token-Transparent-1.020aae53.png",
            tokenName: "Sphynx Token",
            tokenSymbol: "SPHYNX",
            startTime: "1637691698",
            endTime: "1637791698",
            totalSupply: 1000000000,
            totalUnlocked: 100000000,
            totalLocks: 3,
            tokenAddress: "0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"
        }
        setTokenInfo(info)

        const cpks = [
            {
                date: "1637791698",
                amount: 100000000
            },
            {
                date: "1637792698",
                amount: 100000000
            },
            {
                date: "1637793698",
                amount: 100000000
            },
            {
                date: "1637794698",
                amount: 100000000
            },
            {
                date: "1637795698",
                amount: 100000000
            },
            {
                date: "1637796698",
                amount: 100000000
            },
            {
                date: "1637797698",
                amount: 100000000
            },
        ]
        setCpkSchedules(cpks)
    }, [setTokenInfo])

    return (
        <Wrapper>
            <PageHeader>
                <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
                    <Flex alignItems="center">
                        <MainLogo width="80" height="80" />
                        <Flex flexDirection="column" ml="10px">
                            <WelcomeText>{t('SPHYNX LOCKERS/DETAILS')}</WelcomeText>
                        </Flex>
                    </Flex>
                </Flex>
            </PageHeader>
            {!tokenInfo && <Spinner />}
            {tokenInfo && <TokenPresaleBody>
                <TokenPresaleContainder>
                    {/* <SubCardWrapper>DYOR Area</SubCardWrapper> */}
                    <MainCardWrapper>
                        <CardHeader>
                            <TokenWrapper>
                                <TokenImg>
                                    <img src={tokenInfo.tokenLogo} alt="token icon" />
                                </TokenImg>
                                <TokenSymbolWrapper>
                                    <Text>{tokenInfo.tokenSymbol}</Text>
                                    <Text>{tokenInfo.tokenName}</Text>
                                </TokenSymbolWrapper>
                            </TokenWrapper>
                        </CardHeader>
                        <AddressWrapper>
                            <Text color="#A7A7CC" bold>
                                Token Address:
                            </Text>
                            <Text>{tokenInfo.tokenAddress}</Text>
                        </AddressWrapper>
                        <Divider />
                        <SaleInfo>
                            <SaleInfoTitle>
                                Lock Timer:
                            </SaleInfoTitle>
                            <SaleInfoValue>
                                <TimerComponent time={tokenInfo.endTime} />
                            </SaleInfoValue>
                        </SaleInfo>
                        <Divider />
                        <SaleInfo>
                            <SaleInfoTitle>
                                Total Supply of Tokens:
                            </SaleInfoTitle>
                            <SaleInfoValue>
                                {tokenInfo.totalSupply}
                            </SaleInfoValue>
                        </SaleInfo>
                        <Divider />
                        <SaleInfo>
                            <SaleInfoTitle>
                                Total Locked Tokens:
                            </SaleInfoTitle>
                            <SaleInfoValue>
                                {tokenInfo.totalUnlocked}
                            </SaleInfoValue>
                        </SaleInfo>
                        <Divider />
                        <SaleInfo>
                            <SaleInfoTitle style={{ marginRight: '5px' }}>
                                Unlock Date:
                            </SaleInfoTitle>
                            <SaleInfoValue>
                                {new Date(parseInt(tokenInfo.startTime) * 1000).toLocaleString()}
                            </SaleInfoValue>
                        </SaleInfo>
                        <Divider />
                        <SaleInfo>
                            <SaleInfoTitle>
                                Total Locks:
                            </SaleInfoTitle>
                            <SaleInfoValue>
                                {tokenInfo.totalLocks}
                            </SaleInfoValue>
                        </SaleInfo>
                    </MainCardWrapper>
                    <SubCardWrapper>
                        <Text fontSize='20px' bold>
                            CPK Vesting Schedule
                        </Text>
                        <TableWrapper>
                            <table>
                                <thead>
                                    <tr>
                                        <td style={{ width: '15%', textAlign: 'center' }}>{t('No')}</td>
                                        <td style={{ width: '50%' }}>{t('Estimated Release Date')}</td>
                                        <td style={{ width: '35%' }}>{t('Token Released')}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cpkSchedules.map((cell, index) => {
                                        return (
                                            <tr key="key">
                                                <td style={{ width: '15%' }}>
                                                    <Text fontSize='12px' color='#A7A7CC' style={{ textAlign: 'center' }}>{index + 1}</Text>
                                                </td>
                                                <td style={{ width: '50%' }}>
                                                    <Text fontSize='12px' color='#A7A7CC' style={{ textAlign: 'left' }}>{new Date(parseInt(cell.date) * 1000).toLocaleString()}</Text>
                                                </td>
                                                <td style={{ width: '35%' }}>
                                                    <Text fontSize='12px' color='#A7A7CC' style={{ textAlign: 'left' }}> {cell.amount}</Text>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </TableWrapper>
                    </SubCardWrapper>
                </TokenPresaleContainder>
            </TokenPresaleBody>}
        </Wrapper>
    )
}

export default DetailLocker
