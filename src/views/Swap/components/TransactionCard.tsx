import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
// import { useWeb3React } from '@web3-react/core'
// import moment from 'moment'
import axios from 'axios';
import moment from 'moment-timezone'
import { useSelector } from 'react-redux';
import { AppState } from '../../../state'
import { isAddress } from '../../../utils'

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
  const result = isAddress(input)

  const [bnb,setBnb]=useState(0);
  const [tokenprice,setTokenPrice]=useState(0);

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

  const fetchData = async () =>{
    try {
      if (result) {
        // setLoader(true);
        const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery })
        const bnbprice:any= await axios.get(`https://api.sphynxswap.finance/price/${input}`);
				const Tprice:any= await axios.get(`https://api.sphynxswap.finance/price/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`);
				setBnb(Tprice.data.price);
			    setTokenPrice(bnbprice.data.price)
				if (queryResult.data.data)
          setTableData(queryResult.data.data.ethereum.dexTrades)
        // setLoader(false);
      }
    }
    catch (err) {
      // eslint-disable-next-line no-console
      // console.log(err);
      console.log("err", err.message);
    }
  }
  useEffect(()=>{
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [input])

  const filterTableData = tableData === null ? [] : tableData.map((val: any) => {
		const link = `https://bscscan.com/tx/${val.transaction.hash}`;
		// eslint-disable-next-line no-console
		
		  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		  // eslint-disable-next-line no-console
      const currentTime = moment().tz(timezone).format();
		  // eslint-disable-next-line no-console
		  const today:any = new Date(currentTime);
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
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}> {Number(val.baseAmount).toLocaleString()}</h2></a></td>
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>{(val.quotePrice*bnb)}</h2></a></td> 
				<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol === val.buyCurrency.symbol ? 'success' : 'error'}>${(val.baseAmount*tokenprice)}</h2></a></td>
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
