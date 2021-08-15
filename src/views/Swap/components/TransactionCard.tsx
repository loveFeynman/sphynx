import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
// import { useWeb3React } from '@web3-react/core'
// import moment from 'moment'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppState } from '../../../state'

const TableWrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  height: 100%;
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
            color: #00AC1C;
          }
          &.error {
            color: #EA3943;
          }
        }  
      }
    }
  }
`

const TransactionCard = () => {
  const [tableData, setTableData] = useState([]);
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)

  const getDataQuery = `
  {
  ethereum(network: bsc) {
      dexTrades(
      options: {desc: ["block.height", "tradeIndex"], limit: 10, offset: 0}
      date: {since: "2021-08-05", till: null}
      baseCurrency: {is: "${input}"}
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
      quotePrice
      }
    }
    
  }`

  const fetchData = async () =>{
    try {
      if (input) {
        // setLoader(true);
        const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery })
        if (queryResult.data.data)
          setTableData(queryResult.data.data.ethereum.dexTrades)
        // setLoader(false);
      }
    }
    catch (err) {
      // eslint-disable-next-line no-console
      // console.log(err);
      window.alert("Invalid Address: fetch data")
    }
  }
  useEffect(()=>{
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [input])

  const filterTableData = tableData === null ? [] : tableData.map((val: any) => {
		const link = `https://bscscan.com/tx/${val.transaction.hash}`;
		  const today:Date = new Date(val.block.timestamp.time);
		  today.setHours(today.getHours() + 5);
		//   const  time=new Date(val.block.timestamp.time)
		//   console.log(time)
		//   const  addhour=today.getHours()+5;
		  
		//   const onlytime=today.getHours(5)
		      // eslint-disable-next-line no-console
		//   console.log("onlytime",onlytime)
		return (
			<tr>
				<td>
					<a href={link} target="blank"><Flex alignItems='center'><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>{today.toLocaleTimeString()}</h2></Flex></a>
				</td>
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}> {val.baseAmount}</h2></a></td>
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>{val.quotePrice * 335}</h2></a></td>
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>${val.quoteAmount * 335}</h2></a></td>
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>{val.exchange.fullName}</h2></a></td>
			</tr>
		)
	})
  
  // eslint-disable-next-line no-console
  return (
		<>
			<TableWrapper>
				<table>
					<thead>
						<tr>
							<td>Time</td>
							<td>Traded Tokens</td>
							<td>Token Price</td>
							<td>$Value</td>
							<td>DEX</td>
						</tr>
					</thead>
					<tbody>
						{filterTableData}
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
