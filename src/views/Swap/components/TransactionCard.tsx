import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import moment from 'moment'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BoxesLoader } from "react-awesome-loaders";
import { AppDispatch, AppState } from '../../../state'


const data = [
	{
		time: moment.utc(),
		traded: 0.9538,
		price: 0.9538,
		value: 1.9538,
		dex: 'PCSv2',
	},
	{
		time: moment.utc().subtract(1, 'hour'),
		traded: 0.9538,
		price: 0.9538,
		value: 1.9538,
		dex: 'PCSv2',
	},
	{
		time: new Date(),
		traded: 0.9538,
		price: 0.9538,
		value: 1.9538,
		dex: 'PCSv2',
	},
	{
		time: moment.utc().subtract(1, 'hour'),
		traded: 0.9538,
		price: 0.9538,
		value: 1.9538,
		dex: 'PCSv2',
	},
	{
		time: new Date(),
		traded: 0.9538,
		price: 0.9538,
		value: 1.9538,
		dex: 'PCSv2',
	}
];

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

const ArrowDown = styled.div`
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 10px solid #EA3943;
	margin-right: 4px;
`

const ArrowUp = styled.div`
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 10px solid #00AC1C;
	margin-right: 4px;
`

// export interface TransactionCardProps {
//   tokenName: string,
//   contract: string
// }
// 0x016c285d5b918b92aa85ef1e147498badfe30d69

const TransactionCard = () => {


	const { account, activate, deactivate } = useWeb3React()
	const [loader,setLoader]=useState(false)
	
	const [tableData,setTableData]=useState([]);
	// const [data, setData] =useState ([]);
	// const input= localStorage.getItem('InputAddress');
	const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)



	// console.log("inputin table",input)

      

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
		if(input){
			setLoader(true);
			const queryResult= await axios.post('https://graphql.bitquery.io/',{query: getDataQuery});
			if(queryResult.data.data)
			setTableData(queryResult.data.data.ethereum.dexTrades)
			setLoader(false);
		}
       
    }
    useEffect(()=>{
        fetchData();
		  // eslint-disable-next-line react-hooks/exhaustive-deps 
    },[input])
 
  
 

        
      const filteredTableData=tableData.map((val:any) => {
		  const link = `https://bscscan.com/tx/${val.transaction.hash}`
				return(
				
							<tr>
			<td>	
			<a href={link} target="blank"><Flex alignItems='center'><h2 className={val.baseCurrency.symbol===val.buyCurrency.symbol ?'success':'error'}>{ new Date(val.block.timestamp.time).toLocaleTimeString()}</h2></Flex></a>
			</td>	
			<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol===val.buyCurrency.symbol ?'success':'error'}> {val.baseAmount }</h2></a></td>
			<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol===val.buyCurrency.symbol ?'success':'error'}>{ val.quotePrice * 335}</h2></a></td>
			<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol===val.buyCurrency.symbol ?'success':'error'}>${ val.quoteAmount * 335 }</h2></a></td>
			<td><a href={link} target="blank"><h2 className={val.baseCurrency.symbol===val.buyCurrency.symbol ?'success':'error'}>{ val.exchange.fullName }</h2></a></td>
		
		</tr>
	
				

				)			
		
				})


				// console.log("trades::::" , tableData)




  const [hideDirector, setHideDirector] = React.useState(false);
    
//   const [alldata, setalldata] = useState([]);  

// useEffect(() => {
//     axios.fetch('https://jsonplaceholder.typicode.com/users')
// 	.then(res=>res.json()
// 	.then()

// 	})
// }, [])
  

  const fixedHeader = true

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
					{filteredTableData}
				</tbody>
			</table>

		</TableWrapper>
		{loader?

     
<div style={{display:'flex',justifyContent:'center'}}>
<BoxesLoader

boxColor="#8b2a9b"
shadowColor="#aa8929"
style={{ marginBottom: "20px",position: 'absolute',left: 567,top: 455 }}
desktopSize="30px"
mobileSize="15px"
/>
</div>
:""


}
		</>
  )
}

export default TransactionCard
