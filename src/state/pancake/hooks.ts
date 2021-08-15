import {
  BigintIsh,
  Currency,
  CurrencyAmount,
  ETHER,
  Pair,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { RouterType } from 'config/constants'
import { usePancakeswapContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useBNBBalances, useTokenBalance } from 'state/wallet/hooks'

export function usePancakeExchangeAddress(tokenAddress?: string): string | undefined {
  const contract = usePancakeswapContract()

  const inputs = useMemo(() => [tokenAddress], [tokenAddress])
  return useSingleCallResult(contract, 'getExchange', inputs)?.result?.[0]
}

export class PancakePair extends Pair {
  constructor(etherAmount: BigintIsh, tokenAmount: TokenAmount) {
    super(tokenAmount, new TokenAmount(WETH[tokenAmount.token.chainId], etherAmount))
  }
}

function usePancakeswapPair(inputCurrency?: Currency): PancakePair | undefined {
  const token = inputCurrency instanceof Token ? inputCurrency : undefined

  const isWETH = Boolean(token && token.equals(WETH[token.chainId]))
  const pairAddress = usePancakeExchangeAddress(isWETH ? undefined : token?.address)
  const tokenBalance = useTokenBalance(pairAddress, token)
  const BNBBalance = useBNBBalances([pairAddress])[pairAddress ?? '']

  return useMemo(
    () =>
      token && tokenBalance && BNBBalance && inputCurrency ? new PancakePair(BNBBalance.raw, tokenBalance) : undefined,
    [BNBBalance, inputCurrency, token, tokenBalance]
  )
}

export function getRouterType(trade?: Trade): RouterType | undefined {
  const isPancake = trade?.route?.pairs?.some((pair) => pair instanceof PancakePair)
  if (isPancake) return RouterType.pancake
  if (isPancake === false) return RouterType.sphynx
  return undefined
}

/**
 * Returns the trade to execute on Pancakeswap to go between input and output token
 */
export function usePancakeswapTrade(
  isExactIn?: boolean,
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  exactAmount?: CurrencyAmount
): Trade | undefined {
  // get the mock v1 pairs
  const inputPair = usePancakeswapPair(inputCurrency)
  const outputPair = usePancakeswapPair(outputCurrency)

  const inputIsETH = inputCurrency === ETHER
  const outputIsETH = outputCurrency === ETHER

  // construct a direct or through ETH v1 route
  let pairs: Pair[] = []
  if (inputIsETH && outputPair) {
    pairs = [outputPair]
  } else if (outputIsETH && inputPair) {
    pairs = [inputPair]
  }
  // if neither are ETH, it's token-to-token (if they both exist)
  else if (inputPair && outputPair) {
    pairs = [inputPair, outputPair]
  }

  const route = inputCurrency && pairs && pairs.length > 0 && new Route(pairs, inputCurrency, outputCurrency)
  let v1Trade: Trade | undefined
  try {
    v1Trade =
      route && exactAmount
        ? new Trade(route, exactAmount, isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT)
        : undefined
  } catch (error) {
    console.error('Failed to create V1 trade', error)
  }
  return v1Trade
}
