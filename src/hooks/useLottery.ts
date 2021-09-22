/* eslint-disable */
import Web3 from 'web3';
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useMemo, useState, useCallback } from 'react'
import lottery from 'assets/abis/lottery.json'
import sphynx from 'assets/abis/sphynx.json'
import { simpleRpcProvider } from '../utils/providers'

const providerURL = "https://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/";
let web3 = new Web3(new Web3.providers.HttpProvider(providerURL));

const abi: any = lottery.abi
const lotteryContract = new ethers.Contract('0xEA2E7a7E3c6132f6B041A705C9a6F4593e69Ecc2', abi, simpleRpcProvider)
const lotteryContractWeb3 = new web3.eth.Contract(abi, '0xEA2E7a7E3c6132f6B041A705C9a6F4593e69Ecc2')
const spxAbi: any = sphynx.abi
const sphxContractWeb3 = new web3.eth.Contract(spxAbi, '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c')
const sphxContract = new ethers.Contract('0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c', spxAbi, simpleRpcProvider)

export const useLotteryBalance = () => {
  const [balance, setBalance] = useState(0)
  const [roundID, setRoundID] = useState(0)
  const [lotteryInfo, setLotteryInfo] = useState(null)
  const [fetchFlag, setRefetch] = useState(true)

  const { account } = useActiveWeb3React()

  useMemo(() => {
    const fetchLotteryID = async () => {
      try {
        await lotteryContractWeb3.methods.viewCurrentLotteryId().call()
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
        await sphxContractWeb3.methods.balanceOf(account).call()
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
        await lotteryContractWeb3.methods.viewLottery(rID)
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

export const approveCall = async (signer, setConfig, setErrorMessage) => {
  try {
    await sphxContract
      .connect(signer)
      .approve(
        '0xEA2E7a7E3c6132f6B041A705C9a6F4593e69Ecc2',
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      )
      .then((data) => {
        // console.log("approve call ", data);
        setConfig(true)
        return true
      })
      .catch((err) => {
        // console.log('approve call error', err)
        setErrorMessage({ title: 'Enabled error', message: err.message })
        return false
      })
    // console.log("step2")
    return false
  } catch {
    // console.error("fetch Round error")
    return false
  }
}

export const buyTickets = async (signer, roundID, ticketNumbers, setConfig, setErrorMessage) => {
  try {
    await lotteryContract
      .connect(signer)
      .buyTickets(roundID, ticketNumbers)
      .then((data) => {
        // console.log(" buyTickets success", data);
        setConfig(true)
      })
      .catch((err) => {
        // console.log('buyTickets call error', err);
        setErrorMessage({ title: 'Confirm Error', message: err.message })
      })
    // console.log(" buyTickets step2")
  } catch {
    console.error('buyTickets Round error')
    setErrorMessage({ title: 'Confirm Error', message: 'error' })
  }
}

export const viewLotterys = async (rID, setLastLottery) => {
  try {
    await lotteryContractWeb3.methods.viewLottery(rID)
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
}

export const viewUserInfoForLotteryId = async (
  account: string,
  lotteryId: string,
  cursor: number,
  perRequestLimit: number,
  setUserInfoTickets: any,
) => {
  try {
    const response = await lotteryContract.viewUserInfoForLotteryId(
      account,
      lotteryId,
      cursor.toString(),
      perRequestLimit.toString(),
    )
    const dataArray = response[0].map((item, index) => {
      return {
        id: response[0][index].toString(),
        ticketnumber: response[1][index].toString(),
        status: response[2][index],
      }
    })
    setUserInfoTickets(dataArray)
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

export const claimTickets = async (signer, roundID, ticketIds, brackets) => {
  try {
    await lotteryContract
      .connect(signer)
      .claimTickets(roundID, ticketIds, brackets)
      .then((data) => {
        console.log('buyTickets call ', data)
      })
      .catch((err) => {
        console.log('buyTickets call error', err)
      })
    console.log(' buyTickets step2')
  } catch {
    console.error('buyTickets Round error')
  }
}
