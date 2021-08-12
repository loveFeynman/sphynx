import React,{useState,useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { ReactComponent as MoreIcon2 } from 'assets/svg/icon/MoreIcon2.svg' 
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../../../state'



// eslint-disable-next-line import/no-cycle


// import { TokenDetailProps } from './types'

const TextWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  word-break: break-all;
  & > div:first-child {
    color: white;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  }
  & > div:last-child {
    font-size: 14px;
    line-height: 16px;
    color: #ADB5BD;
    margin-top: 2px;
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const TokenInfoContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 12px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0;
  }
`
// {tokenInfo}: {tokenInfo?: TokenDetailProps | null}
export default function TokenInfo() {
  
  //  const input= localStorage.getItem('InputAddress');
  //   console.log("inputaddress1",input);
    const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

    // console.log("input in chart",input);

  const [alldata, setalldata] = useState({
    holders : '',
    txs : '',
    marketCap : '',
    symbol : '',
    totalSupply : ''
  });

  const getTableData =   () => {
    axios.post("https://api.sphynxswap.finance/tokenStats",{address:input || "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"})
        .then((response) => {
            setalldata(response.data)
        });
       }  
     

useEffect(() => {

  getTableData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[input])
  
  return (
    <TokenInfoContainer>
    <Flex alignItems="center" justifyContent='space-between'>
        <Flex alignItems='center'>
          {/* { */}
            {/* tokenInfo ? */}
              <IconWrapper size={32}>
                <Text>{alldata.symbol}</Text> 
              </IconWrapper>
              {/* :  */}
          {/* } */}
          {/* <Text color='white'>{id ? createdAt : ''}</Text> */}
        </Flex>
        <Flex style={{ width: 40 }}>
          <MoreIcon2 />
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <TextWrapper>
          <Text>Total Supply</Text>
          <Text>{ alldata.totalSupply}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Market Cap:<span style={{ fontSize: '70%' }}>(includes locked, excludes burned)</span></Text>
          <Text>{alldata.marketCap}</Text>
        </TextWrapper>
        {/* <TextWrapper>
          <Text>Pc v2| DOGESON/BNB LP Holdings:</Text>
          <Text>{alldata.txs})|Chart|Holders
          </Text>
        </TextWrapper> */}
          <TextWrapper>
          <Text>Transactions</Text>
          <Text>{alldata.txs}</Text>
        </TextWrapper>
        {/* <TextWrapper>
          <Text>Transactions</Text>
          <Text>{id ? numeral(id).format('0,0') : ''}</Text>
        </TextWrapper> */}
        <TextWrapper>
          <Text>Contract Address</Text>
          <Text>{!input?"0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82":input}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Holders</Text>
          <Text>{alldata.holders}</Text>
        </TextWrapper>
      </Flex>
    </TokenInfoContainer>
  )
}