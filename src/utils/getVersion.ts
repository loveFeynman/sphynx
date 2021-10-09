import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import abi from '../config/abi/erc20ABI.json'
import factoryAbi from '../config/abi/factoryAbi.json'
import factoryV1Abi from '../config/abi/factoryV1.json'


const httpProvider = new Web3.providers.HttpProvider(
  "https://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/"
);
const web3 = new Web3(httpProvider);


const getVersion = async (address: string) => {
  try {
    const wbnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

    // @ts-ignore
    const factoryv2 = new web3.eth.Contract(
      factoryAbi as AbiItem[],
      "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    );
    const factoryv1 = new web3.eth.Contract(
      factoryV1Abi as AbiItem[],
      "0xBCfCcbde45cE874adCB698cC183deBcF17952812"
    );

    const v1Pair = await factoryv1.methods.getPair(address, wbnbAddress).call();
    const v2Pair = await factoryv2.methods.getPair(address, wbnbAddress).call();

    if (!v2Pair && !v1Pair) {
      return { status: false, version: "", pairAddress: "" };
    }

    if (!v1Pair) {
      return { status: true, version: "Pancake v2", pairAddress: v2Pair };
    }

    if (!v2Pair) {
      return { status: false, version: "Pancake v1", pairAddress: v1Pair };
    }

    const wbnbToken = new web3.eth.Contract(abi as AbiItem[], wbnbAddress);
    const v1Balance = await wbnbToken.methods.balanceOf(v1Pair).call();
    const v2Balance = await wbnbToken.methods.balanceOf(v2Pair).call();

    let version;
    let pairAddress;
    if (parseFloat(v1Balance) <= parseFloat(v2Balance)) {
      version = "Pancake v2";
      pairAddress = v2Pair;
    } else {
      version = "Pancake v1";
      pairAddress = v1Pair;
    }

    return { status: true, version, pairAddress };
  } catch (error) {
    return { status: false, version: "", pairAddress: "" };
  }
};

const getVersion1 = async (address) => {
  try {
    const wbnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

    const factoryv1 = new web3.eth.Contract(
      factoryV1Abi as AbiItem[],
      "0xBCfCcbde45cE874adCB698cC183deBcF17952812"
    );

    const v1Pair = await factoryv1.methods.getPair(address, wbnbAddress).call();

    if (!v1Pair) {
      return { status: false, version: "", pairAddress: "" };
    }

    const version = "Pancake v1";
    const pairAddress = v1Pair;

    return { status: true, version, pairAddress };
  } catch (error) {
    return { status: false, version: "", pairAddress: "" };
  }
};

export {
  getVersion,
  getVersion1
}
