// Make requests to CryptoCompare API

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
    // console.log("here in api reuest",path)
    const response = await fetch(
      `https://thesphynx.co/api/${routerVersion === 'v1' ? 'v1/' : ''}chart/${path}?resolution=${resolution}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
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
