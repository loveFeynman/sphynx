import { getMarksData } from 'utils/apiServices'

// Make requests to CryptoCompare API
export async function makeApiRequest1(path: any, routerVersion: any, resolution: any) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API_URL}/${routerVersion === 'v1' ? 'v1/' : ''}chart/${path}?resolution=${resolution}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.json()
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

export async function getAllTransactions(account: any, path: any) {
  try {
    const data: any = await getMarksData(account, path)
    return data
  } catch (error) {
    console.log("error", error)
    return []
  }
}

