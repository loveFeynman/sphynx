// Make requests to CryptoCompare API

import axios from 'axios'
import { getVersion } from '../../../../../utils/getVersion'

export async function makeApiRequest(path: any) {
  try {
    const response = await fetch(`https://thesphynx.co/api/tokenDetails/${path}`)
    return response.json()
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`)
  }
}
export async function makeApiRequest1(path: any, routerVersion: any, resolution: any) {
  try {
    if (!path) {
      return null;
    }
    const till = new Date().toISOString();
    const resolutionMap = {
      1: "1m",
      5: "5m",
      10: "10m",
      15: "15m",
      30: "30m",
      60: "1h",
      "1D": "1d",
      "1W": "1w",
      "1M": "1M",
    };
    const version = await getVersion(path);
    const url = `https://api2.poocoin.app/candles-bsc?to=${till}&limit=320&lpAddress=${version.pairAddress}&interval=${resolutionMap[resolution]}&baseLp=0x1B96B92314C44b159149f7E0303511fB2Fc4774f`;
    const { data } = await axios.get(url, {
      headers: {
        origin: "https://poocoin.app",
        referer: "https://poocoin.app/",
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "user-agent": "PostmanRuntime/7.26.8",
        Connection: "keep-alive",
      },
    });
    return data;
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`)
  }
}
// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange: any, fromSymbol: any, toSymbol: any) {
  const short = `${fromSymbol}/${toSymbol}`
  return {
    short,
    full: `${exchange}:${short}`,
  }
}
export function parseFullSymbol(fullSymbol: any) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/)
  if (!match) {
    return null
  }
  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  }
}
