/* eslint-disable */
import Web3 from 'web3'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useMemo, useState, useCallback } from 'react'
import lottery from 'assets/abis/lottery.json'
import sphynx from 'assets/abis/sphynx.json'
import { simpleRpcProvider } from '../utils/providers'

const providerURL = 'https://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/'
let web3 = new Web3(new Web3.providers.HttpProvider(providerURL))

const abi: any = lottery.abi
const lotteryContract = new ethers.Contract('0xf20495AbecdDe4D1652BFfF58ba7c24730534e91', abi, simpleRpcProvider)
const lotteryContractWeb3 = new web3.eth.Contract(abi, '0xf20495AbecdDe4D1652BFfF58ba7c24730534e91')
const spxAbi: any = sphynx.abi
const sphxContractWeb3 = new web3.eth.Contract(spxAbi, '0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c')
const sphxContract = new ethers.Contract('0x2e121Ed64EEEB58788dDb204627cCB7C7c59884c', spxAbi, simpleRpcProvider)

const deepEqual = (object1, object2) => {
  if (object1 === null || object2 === null) return false
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false
    }
  }

  return true
}

const isObject = (object) => {
  return object != null && typeof object === 'object'
}

export const useLotteryBalance = () => {
  const [balance, setBalance] = useState(0)
  const [roundID, setRoundID] = useState(0)
  const [lotteryInfo, setLotteryInfo] = useState(null)
  const [fetchFlag, setRefetch] = useState(true)

  const { account } = useActiveWeb3React()

  useMemo(() => {
    const fetchLotteryID = async () => {
      try {
        await lotteryContractWeb3.methods
          .viewCurrentLotteryId()
          .call()
          .then((data) => {
            // console.log("fetch Round ", data);
            setRoundID(data)
          })
          .catch((err) => {
            console.log(' viewCurrentLotteryId error', err)
          })
      } catch {
        console.error('fetch Round error')
      }
    }

    const getBalance = async () => {
      try {
        const data = await sphxContractWeb3.methods.balanceOf(account).call()
        setBalance(data / 1000000000000000000)
      } catch {
        console.error('balace try error')
        setBalance(0)
      }
    }

    const viewLotterys = async (rID) => {
      console.log('lottery', rID)
      try {
        const data = await lotteryContractWeb3.methods.viewLottery(rID).call()
        // console.log("view lotterys success", data);
        if (!deepEqual(data, lotteryInfo)) {
          setLotteryInfo(data)
        }
      } catch {}
    }
    if (fetchFlag) {
      fetchLotteryID()
      getBalance()
      viewLotterys(roundID)
    }
    // setRefetch(false);
  }, [roundID, account, fetchFlag])
  return { balance, roundID, lotteryInfo, setRefetch }
}

export const approveCall = async (signer, setConfig, setToastMessage) => {
  try {
    await sphxContract
      .connect(signer)
      .approve(
        '0xf20495AbecdDe4D1652BFfF58ba7c24730534e91',
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      )
      .then((data) => {
        // console.log("approve call ", data);
        setConfig(true)
        setToastMessage({ title: 'Success', message: 'Approved your request' })
        return true
      })
      .catch((err) => {
        // console.log('approve call error', err)
        setToastMessage({ title: 'Enabled Error', message: err.message })
        return false
      })
    // console.log("step2")
    return false
  } catch {
    // console.error("fetch Round error")
    return false
  }
}

export const buyTickets = async (signer, roundID, ticketNumbers, setConfig, setToastMessage) => {
  try {
    await lotteryContract
      .connect(signer)
      .buyTickets(roundID, ticketNumbers)
      .then((data) => {
        // console.log(" buyTickets success", data);
        setToastMessage({ title: 'Success ', message: 'Successed buying '.concat(ticketNumbers.length.toString()) })
        setConfig(true)
      })
      .catch((err) => {
        // console.log('buyTickets call error', err);
        setToastMessage({ title: 'Confirm Error', message: err.message })
      })
    // console.log(" buyTickets step2")
  } catch {
    console.error('buyTickets Round error')
    setToastMessage({ title: 'Confirm Error', message: 'error' })
  }
}

export const viewLotterys = async (rID, lastLoteryInfo, setLastLottery) => {
  try {
    const data = await lotteryContractWeb3.methods.viewLottery(rID).call()
    if (!deepEqual(lastLoteryInfo, data)) setLastLottery(data)
  } catch {
    setLastLottery(null)
  }
}

export const getApproveAmount = async (account: string) => {
  const response = await sphxContractWeb3.methods
    .allowance(account, '0xf20495AbecdDe4D1652BFfF58ba7c24730534e91')
    .call()
  return response
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

export const claimTickets = async (signer, roundID, ticketIds, brackets, setToastMessage) => {
  try {
    await lotteryContract
      .connect(signer)
      .claimTickets(roundID, ticketIds, brackets)
      .then((data) => {
        setToastMessage({ title: 'Success ', message: 'Successed Claiming ' })
      })
      .catch((err) => {
        console.log('claimTickets call error', err)
      })
  } catch {
    console.error('claimTickets Round error')
  }
}
