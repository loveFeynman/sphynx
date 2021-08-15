import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {utils} from "ethers";
import axios from 'axios';
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap/uikit'
import Column from 'components/Column'
import { AppState } from '../../../state'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  span {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-end;
  }
`

const StyledWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px 12px 0px 0px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  & > div {
    margin: 0 0 12px;
    & > div, & > div > div > div {
      &:first-child {
        color: white;
        font-size: 16px;
        line-height: 19px;
        font-weight: 500;
        margin-bottom: 2px;
      }
      &:last-child {
        color: #ADB5BD;
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
      }
    }
    & h2 {
      font-size: 14px;
      line-height: 16px;
      font-weight: bold;
      &.success {
        color: #00AC1C;
      }
      &.error {
        color: #EA3943;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0;
  }
`

export default function CoinStatsBoard() {
  // const theme = useContext(ThemeContext)

  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input);
  // console.log("input in marketcap==========",input);
  const [alldata, setalldata] = useState({
    address : '',
    price : '',
    change : '',
    volume : '',
    liquidityV2 : '',
    liquidityV2BNB:''
  });

  const [linkIcon, setLinkIcon] = useState('https://r.poocoin.app/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png')
    // const pricedecimal=parseFloat(alldata.price).toFixed(5);
    const changedecimal:any=parseFloat(alldata.change).toFixed(3);
    // const set=Math.sign(changedecimal);
    const volumedecimal=parseFloat(alldata.volume).toFixed(3);
    const liquidityV2decimal=parseFloat(alldata.liquidityV2).toFixed(3);
    const liquidityV2BNBdecimal=parseFloat(alldata.liquidityV2BNB).toFixed(3);
 
    const getTableData =   () => {
      try{
        axios.post("https://api.sphynxswap.finance/chartStats",{address:input})
        .then((response) => {
            setalldata(response.data)
            setLinkIcon(`https://r.poocoin.app/smartchain/assets/${input ? utils.getAddress(input) : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'}/logo.png`);
        });

      }
      catch(err){
        // eslint-disable-next-line no-console
        console.log(err)
        
      }
    }
    useEffect(() => {
      getTableData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[input])

  return (
    <StyledWrapper>
      <Column>
        <Flex>
        {/* { */}
          {/* tokenInfo ? */}
            <IconWrapper size={32}>
              <img src={linkIcon} alt="Coin icon" />
            </IconWrapper>
        <div>
          <Text>Coin</Text>
          <Text>{input}</Text>
        </div>
        </Flex>
      </Column>
      <Column>
        <Text>Price</Text>
        <Text>2000</Text>
      </Column>
      <Column>
        <Text>24h Change</Text>
        <Text><h2 className={Math.sign(changedecimal)===-1 ? 'error':'success'}> {changedecimal }%</h2></Text>
        {/* <Text>{changedecimal}%</Text> */}
      </Column>
      <Column>
        <Text>24h Volume</Text>
        <Text>$ {volumedecimal}</Text>
      </Column>
      <Column>
        <Text>Liquidity</Text>
        <Text style={{color:'white'}}> $ {liquidityV2decimal}</Text>
        <Text>BNB {liquidityV2BNBdecimal} </Text>
      </Column>
      <Column>
        <Text>MarketCap</Text>
        {/* {tokenInfo ? numeral(tokenInfo.marketCap).format('$0,0.00') : ''} */}
        <Text>200</Text>
      </Column>
    </StyledWrapper>
  )
}
