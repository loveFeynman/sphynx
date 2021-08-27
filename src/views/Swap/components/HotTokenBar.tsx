/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
import React,{useState,useCallback} from 'react'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactLoading from 'react-loading';
// import { ReactComponent as HelpIcon } from 'assets/svg/icon/HelpIcon.svg'
// import { ReactComponent as DownRedArrowIcon} from 'assets/svg/icon/DownRedArrowIcon.svg'
// import { ReactComponent as UpGreenArrowIcon} from 'assets/svg/icon/UpGreenArrowIcon.svg'
import { HotTokenType } from './types'
import { AppState } from '../../../state'
import { typeInput } from '../../../state/input/actions'

export interface HotTokenBarProps {
  tokens?: HotTokenType[] | null
}

const StyledBar = styled.div`
  width: 100%;
  display: flex;
  & span {
    font-family: 'Roboto Regular'
  }
`

const FlowBar = styled.div`
  width: calc(100% - 100px);
  background-color: rgba(0,0,0,0.2);
  border-radius: 0px 12px 12px 0px;
  padding: 6px;
`

const BarIntro = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: #fff;
  background-color: #101010;
  border-radius: 8px 0px 0px 8px;
  & span {
    font-size: 12px;
    line-height: 14px;
  }
`

// const StyledLink = styled(Link)`
//   display: flex;
//   align-items: center;
//   width: fit-content;
//   margin-left: 16px;
//   &:hover {
//     text-decoration: none;
//   }
//   & svg {
//     margin-right: 8px;
//   }
//   & span:last-child {
//     font-weight: bold;
//     color: white;
//     text-transform: uppercase;
//   }
// `;

// const RankingColor = [
//   '#F7931A',
//   '#ACACAC',
//   '#6E441E',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5',
//   '#C5C5C5'
// ]

// const Ranking = styled.span<{
//   index1: number
// }>`
//   padding-right: 8px;
//   color: ${({index1}) => RankingColor[index1 - 1]};
// `

export default function HotTokenBar() {
  const [data,setData]=React.useState([{
    currency:{
      symbol:'',
      name:''
    }
  }])
 const [loader,setLoader]=useState(false)
  const input = useSelector<AppState, AppState['inputReducer']>((state) => state.inputReducer.input)
  const dispatch = useDispatch();

  const date:any = new Date();
  date.setDate(date.getDate() - 2);
  // console.log("data in hotbar==================================",data)
  const d:any = new Date()
  d.setDate(d.getDate() - 2);
  const getDataQuery = `
  {
    ethereum(network: bsc) {
      transfers(
        options: {desc: "count", limit: 10, offset: 0}
        amount: {gt: 0}
        date: {since: "${date.toISOString()}", till: "${d.toISOString()}"}
        currency: {notIn: ["BNB", "WBNB", "BTCB", "ETH", "BUSD", "USDT", "USDC", "DAI"]}
      ) {
        currency {
          symbol
          address
          name
        }
        count
        senders: count(uniq: senders)
        receivers: count(uniq: receivers)
        days: count(uniq: dates)
        from_date: minimum(of: date)
        till_date: maximum(of: date)
        amount
      }
    }
    
  }`

  const handleClick = useCallback(async() => {
  
      setLoader(true);
      const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery });
      // setData(queryResult);
      if (queryResult.data.data){
      setData(queryResult.data.data.ethereum.transfers)
      setLoader(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  //  const fetchData = async () => {
  //    try {
  //        setLoader(true);
  //        const queryResult = await axios.post('https://graphql.bitquery.io/', { query: getDataQuery });
     
  //        if (queryResult.data.data){
  //        setData(queryResult.data.data.ethereum.transfers)
  //        setLoader(false);
  //    }
  //  }
  //    catch (err) {
     
 
  //    }
  //  }
   // console.log("data in hotbar==================================",data)
  React.useEffect(()=>{
    handleClick()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

 return (
   <>
   <StyledBar>
     <BarIntro><span>Top Pairs</span></BarIntro>
    
     <FlowBar>
     {loader?<div style={{display: 'flex', justifyContent: 'center'}}>
     <ReactLoading type="spin" color="green" height='2%' width='2%'  />
     </div>:
       <Marquee gradient={false} className="marquee-container" style={{ overflow: 'hidden !important' }}>
     
         <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'center', width: 'calc(100% - 120px)' }}>
            {
            data.map((elem:any,index) => {
             return (
               <li style={{color:'white',padding:'20'}}>
               <a href="javascript:void(null)" style={{marginRight: 25,textDecoration:'none'}} 
               onClick={()=> dispatch(typeInput({ input: elem.currency.address }))}
               >{`${index+1}. ${elem.currency.symbol}`}</a>
                 {/* < a href="##">{elem.currency.name}</a> */}
                 {/* <HotToken
                   index={key + 1}
                   // dexId={token.}
                   symbol={data.symbol}
                   name={data.name}
                   direction={data.direction}
                 /> */}
               </li>
             )
           })
          }
         </ul>

       </Marquee>
     }
     </FlowBar>
   
     <div className="paddingRight: 30px" />
   </StyledBar>
   </>
 )
}
