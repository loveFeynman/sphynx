import Web3 from 'web3';
import { useWeb3React, getWeb3ReactContext } from '@web3-react/core';
import { useEffect, useState, useCallback } from 'react';
import lottery from 'assets/abis/lottery.json'
import sphynx from 'assets/abis/sphynx.json'
import HDWalletProvider from '@truffle/hdwallet-provider';

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
const lotteryContract = new web3.eth.Contract(abi, '0x5Fc5be63623f27C9718cc7bbF04c4B268F11C3f1');
const spxAbi: any = sphynx.abi;

export const useLotteryBalance = () => {
  const [balance, setBalance] = useState(0);
  const [roundID, setRoundID] = useState(0);
  const { account } = useWeb3React();
  const sphxContract = new web3.eth.Contract(spxAbi, '0x8AAF4B1e2dD87b8852A642f52f2B35C3aBb3A076');

  useEffect(() => {
    const ticketIDs = [];

    const fetchLotteryID = async () => {
      try {
        await lotteryContract.methods.viewCurrentLotteryId().call()
          .then((data) => {
            console.log("fetch Round ", data);
            setRoundID(data);
          }).catch((err) => {
            console.log(' viewCurrentLotteryId error', err)
          });
      } catch {
        console.error("fetch Round error")
      }
    }
    fetchLotteryID();

    const getBalance = async () => {
      try {
        await sphxContract.methods.balanceOf("0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E").call()
          .then((data) => {
            console.log("balance", data);
            setBalance(data);
          }).catch((err) => {
            console.log('balace error', err);
          });
      } catch {
        console.error("balace try error");
        setBalance(45);
      }
    }
    getBalance();
    // approveCall();
    // lotteryContract.methods.buyTickets(lotteryID, ticketIDs).send(/**{from: }}*/).then((data) => {
    //   console.log("bbbbb");
    // }).catch((err) => {
    //   console.log(' buyTickets error', err)
    // });
    // const players = lotteryContract.methods.getPlayers().call();
    // function balanceOf(address account) external view returns (uint256);
  }, [account, balance, sphxContract.methods]);
  // function approve(address spender, uint256 amount) external returns (bool);

  return { balance, roundID };
}

export const approveCall = async (account) => {
  try {
    const sphxContract = new web3.eth.Contract(spxAbi, '0x8AAF4B1e2dD87b8852A642f52f2B35C3aBb3A076');
    console.log("step1");
    console.log("aaaaaaaaaaaaaaaaaa", await web3.eth.getAccounts());
    console.log("step2", account);
    await sphxContract.methods.approve("0x5Fc5be63623f27C9718cc7bbF04c4B268F11C3f1", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      .send({ from: "0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E" })
      .then((data) => {
        console.log("approve call ", data);
      }).catch((err) => {
        console.log('approve call error', err)
      });
    console.log("step2")
  } catch {
    console.error("fetch Round error")
  }
};

export const buyTickets = async (account, roundID, ticketNumbers) => {
  try {
    console.log("step1");
    console.log("aaaaaaaaaaaaaaaaaa", await web3.eth.getAccounts());
    console.log("step2", account);
    await lotteryContract.methods.buyTickets(roundID, ticketNumbers)
      .send({ from: "0x3EF6FeB63B2F0f1305839589eDf487fb61b99A4E" })
      .then((data) => {
        console.log("approve call ", data);
      }).catch((err) => {
        console.log('approve call error', err)
      });
    console.log("step2")
  } catch {
    console.error("fetch Round error")
  }
};
