import { ethers } from 'ethers'
import Web3 from 'web3'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)
export const web3Provider = new Web3.providers.HttpProvider(RPC_URL);

export const web3ArchiveProvider = new Web3.providers.HttpProvider(RPC_URL);

export const WEBSOCKET_URL = process.env.REACT_APP_WSNODE_1
// export const simpleWebsocketProvider = new ethers.providers.WebSocketProvider(WEBSOCKET_URL)

export default simpleRpcProvider
