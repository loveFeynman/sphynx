/* eslint-disable */
import Web3 from 'web3';
import { useWeb3React, getWeb3ReactContext } from '@web3-react/core';
import { useEffect,useMemo, useState, useCallback } from 'react';
import lottery from 'assets/abis/lottery.json'
import sphynx from 'assets/abis/sphynx.json'
import HDWalletProvider from '@truffle/hdwallet-provider';
import { TICKET_LIMIT_PER_REQUEST } from 'config/constants/lottery'

let web3;
const providerURL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const provider = new HDWalletProvider(
  "1903d8f7a9deb960d275a9da849c878111af8401b06a9a0530083a3036aceb99",
  providerURL
);
if (process.env.NODE_ENV !== 'production')
  web3 = new Web3(provider);
else
  web3 = new Web3(new Web3.providers.HttpProvider(providerURL));

const abi: any = lottery.abi;
const lotteryContract = new web3.eth.Contract(abi, '0x860D8b604423bbAB6CACc8554294f336Ac670a56');
const spxAbi: any = sphynx.abi;
const sphxContract = new web3.eth.Contract(spxAbi, '0x8AAF4B1e2dD87b8852A642f52f2B35C3aBb3A076');

export const useLotteryBalance = () => {
  const [balance, setBalance] = useState(0);
  const [roundID, setRoundID] = useState(0);
  const [lotteryInfo, setLotteryInfo] = useState(null);
  const [fetchFlag, setRefetch] = useState(true);

  const { account } = useWeb3React();

  useMemo(() => {
    const fetchLotteryID = async () => {
      try {
        await lotteryContract.methods.viewCurrentLotteryId().call()
          .then((data) => {
            // console.log("fetch Round ", data);
            setRoundID(data);
          }).catch((err) => {
            console.log(' viewCurrentLotteryId error', err)
          });
      } catch {
        console.error("fetch Round error")
      }
    }

    const getBalance = async () => {
      try {
        await sphxContract.methods.balanceOf(process.env.NODE_ENV !== 'production'?
          "0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account).call()
          .then((data) => {
            // console.log("balance", data);
            setBalance(data/1000000000000000000);
          }).catch((err) => {
            console.log('balace error', err);
          });
      } catch {
        console.error("balace try error");
        setBalance(0);
      }
    }
    
    const viewLotterys = async (rID) => {
      try {
        await lotteryContract.methods.viewLottery(rID)
          .call()
          .then((data) => {
            // console.log("view lotterys success", data);
            setLotteryInfo(data);
          }).catch((err) => {
            console.log('view lotterys', err)
          });
      } catch {
      }
    };
    if (fetchFlag) {
      fetchLotteryID();
      getBalance();
      viewLotterys(roundID);
    }
    // setRefetch(false);
  }, [roundID, account, fetchFlag]);
  return { balance, roundID, lotteryInfo, setRefetch};
}

export const approveCall = async (account, setConfig, setErrorMessage) => {
  try {
    await sphxContract.methods.approve("0x860D8b604423bbAB6CACc8554294f336Ac670a56", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      .send({ from: process.env.NODE_ENV !== 'production'?"0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account})
      .then((data) => {
        // console.log("approve call ", data);
        setConfig(true)
        return true;
      }).catch((err) => {
        // console.log('approve call error', err)
        setErrorMessage({title: "Enabled error", message: err.message});
        return  false;
      });
    // console.log("step2")
    return false;
  } catch {
    // console.error("fetch Round error")
    return false;
  }
};

export const buyTickets = async ( account, roundID, ticketNumbers,setConfig, setErrorMessage) => {
  try {
    
    await lotteryContract.methods.buyTickets(roundID, ticketNumbers)
      .send({ from: process.env.NODE_ENV !== 'production'?"0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account})
      .then((data) => {
        // console.log(" buyTickets success", data);
        setConfig(true);
      }).catch((err) => {
        // console.log('buyTickets call error', err);
        setErrorMessage({title:"Confirm Error", message: err.message});
      });
    // console.log(" buyTickets step2")
  } catch {
    console.error("buyTickets Round error");
    setErrorMessage({title:"Confirm Error", message: "error"});
  }
};

export const viewLotterys = async (rID, setLastLottery) => {
  try {
    await lotteryContract.methods.viewLottery(rID)
      .call()
      .then((data) => {
        setLastLottery(data);
        // console.log("view lotterys alone success", data);
      }).catch((err) => {
        // console.log('view lotterys alone fail', err);
        setLastLottery(null);
      });
  } catch {
    setLastLottery(null);
  }
};


export const viewUserInfoForLotteryId = async (
  account: string,
  lotteryId: string,
  cursor: number,
  perRequestLimit: number,
  setUserInfoTickets: any,
) => {
  try {
    await lotteryContract.methods.viewUserInfoForLotteryId(process.env.NODE_ENV !== 'production'?"0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account, lotteryId, cursor.toString(), perRequestLimit.toString())
    .call()
    .then((response)=>{
      const dataArray = response[0].map((item, index)=> {return {
        id: response[0][index],
        ticketnumber: response[1][index],
        status: response[2][index],
      }})
      setUserInfoTickets(dataArray);
    })
    .catch((err)=>{
      console.error('viewUserInfoForLotteryId', err)
    });
  } catch (error) {
    console.error('viewUserInfoForLotteryId', error)
    return null
  }
}

export const processRawTicketsResponse = (ticketsResponse) => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse

  if (ticketIds?.length > 0) {
    return ticketIds.map((ticketId, index) => {
      return {
        id: ticketId.toString(),
        number: ticketNumbers[index].toString(),
        status: ticketStatuses[index],
      }
    })
  }
  return []
}

// export const fetchUserTicketsForOneRound = async (account: string, lotteryId: string) => {
//   let cursor = 0
//   let numReturned = TICKET_LIMIT_PER_REQUEST
//   const ticketData = []

//   while (numReturned === TICKET_LIMIT_PER_REQUEST) {
//     // eslint-disable-next-line no-await-in-loop
//     const response = await viewUserInfoForLotteryId(account, lotteryId, cursor, TICKET_LIMIT_PER_REQUEST);
//     if (response !== null) {
//       cursor += TICKET_LIMIT_PER_REQUEST
//       numReturned = response?.length
//       ticketData.push(...response)
//     }
    
//   }

//   return ticketData
// }

export const claimTickets = async ( account, roundID, cursor) => {
  try {
    await lotteryContract.methods.claimTickets(process.env.NODE_ENV !== 'production'?"0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account, roundID, cursor,100)
      .send({ from: process.env.NODE_ENV !== 'production'?"0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E":account})
      .then((data) => {
        console.log("buyTickets call ", data);
      }).catch((err) => {
        console.log('buyTickets call error', err)
      });
    console.log(" buyTickets step2")
  } catch {
    console.error("buyTickets Round error")
  }
};

