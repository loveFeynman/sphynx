import { ethers } from 'ethers'
import Web3 from 'web3'
import getRpcUrl from 'utils/getRpcUrl'
import chainIds from 'config/constants/chainIds'

const BNB_RPC_URL = getRpcUrl(chainIds.BNB_CHAIN_ID)
const ETH_RPC_URL = getRpcUrl(chainIds.ETH_CHAIN_ID)

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(BNB_RPC_URL)
export const simpleRpcETHProvider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL)
export const web3Provider = new Web3.providers.HttpProvider(BNB_RPC_URL);
export const ethWeb3Provider = new Web3.providers.HttpProvider(ETH_RPC_URL);

export const WEBSOCKET_URL = process.env.REACT_APP_WSNODE_1
// export const simpleWebsocketProvider = new ethers.providers.WebSocketProvider(WEBSOCKET_URL)

export default simpleRpcProvider
