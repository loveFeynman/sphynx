/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<void>
    networkVersion?: string
  }
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  }
  trustwallet?: {
    Provider?: {
      chainId: any
    }
  }
  TradingView?: any
  tvWidget?: any
  web3?: any
}
