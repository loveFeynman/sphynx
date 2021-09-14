import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import lottery from 'assets/abis/lottery.json'

export const useLotteryBalance = async () => {
  const { account } = useWeb3React();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const providerURL = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
    const abi: any = lottery.abi;
    const lotteryContract = new web3.eth.Contract(abi, '0x5Fc5be63623f27C9718cc7bbF04c4B268F11C3f1');
    // const manager = lotteryContract.methods.manager().call();
    // const players = lotteryContract.methods.getPlayers().call();
    // console.log(manager, players, balance);
    setBalance(20);
  }, [account, balance]);
  return {balance};
}