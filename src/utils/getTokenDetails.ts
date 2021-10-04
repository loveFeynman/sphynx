import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import abi from '../config/abi/erc20ABI.json'
import { getVersion } from './getVersion'

const httpProvider = new Web3.providers.HttpProvider(
  "https://old-thrumming-voice.bsc.quiknode.pro/7674ba364cc71989fb1398e1e53db54e4fe0e9e0/"
);
const web3 = new Web3(httpProvider);


async function getTokenDetails(address: string): Promise<{
  name: string,
  symbol: string,
  pair: string,
  version: string
}> {
  if (!address) {
    return null;
  }
  const token = new web3.eth.Contract(abi as AbiItem[], address);
  const name = await token.methods.name().call();
  const symbol = await token.methods.symbol().call();
  const version = await getVersion(address);
  return { name, symbol, pair: `${symbol }/BNB`, version: version.version }
}

export default getTokenDetails
