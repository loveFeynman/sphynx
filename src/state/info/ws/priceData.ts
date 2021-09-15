import { Contract, utils } from 'ethers'
import { PANCAKE_FACTORY_ADDRESS, ChainId } from '@pancakeswap/sdk'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import pancakeRouterAbi from 'config/abi/pancakeSwapRouter.json'
import pancakeLpAbi from 'config/abi/lpToken.json'
import bscTokenAbi from 'config/abi/erc20.json'
import { ZERO_ADDRESS } from 'config/constants'
import { BUSD, WBNB } from 'config/constants/tokens'

export interface TokenInfo {
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: number
}

export const getMinTokenInfo = async (address, provider): Promise<TokenInfo> => {
  const tokenContract = new Contract(
    address,
    bscTokenAbi,
    provider,
  );
  try {
    const decimals = await tokenContract.decimals()
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    const totalSupply = await tokenContract.totalSupply()
    const tokenInfo = {
      name,
      symbol,
      decimals,
      totalSupply: parseInt(utils.formatUnits(totalSupply, decimals))
    }
    return tokenInfo;
  } catch (e) {
    return null;
  }
}

export const getPancakePairAddress = async (quoteToken, baseToken, provider) => {
  const pancakeFactoryContract = new Contract(
    PANCAKE_FACTORY_ADDRESS,
    pancakeFactoryAbi,
    provider,
  );
  const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken);
  if (pairAddress === ZERO_ADDRESS) {
    return null;
  }
  return pairAddress;
}

const getPancakeLiquidityInfo = async (quoteToken, baseToken, provider) => {
  const lpAddress = await getPancakePairAddress(quoteToken, baseToken, provider);
  const lpContract = new Contract(
    lpAddress,
    pancakeLpAbi,
    provider,
  );
  const quoteTokenInfo = await getMinTokenInfo(quoteToken, provider);
  const baseTokenInfo = await getMinTokenInfo(baseToken, provider);
  const reserves = await lpContract.getReserves();
  let quoteTokenReserve;
  let baseTokenReserve;
  const token0 = await lpContract.token0();
  if (token0.toLowerCase() === quoteToken.toLowerCase()) {
    quoteTokenReserve = utils.formatUnits(reserves[0], quoteTokenInfo.decimals);
    baseTokenReserve = utils.formatUnits(reserves[1], baseTokenInfo.decimals);
  } else {
    quoteTokenReserve = utils.formatUnits(reserves[1], quoteTokenInfo.decimals);
    baseTokenReserve = utils.formatUnits(reserves[0], baseTokenInfo.decimals);
  }

  return {
    quoteToken: {
      ...quoteTokenInfo,
      address: quoteToken,
      reserve: quoteTokenReserve
    },
    baseToken: {
      ...baseTokenInfo,
      address: baseToken,
      reserve: baseTokenReserve
    }
  }
}

export const getBnbPrice = async (provider) => {
  const bnbBusdLp = await getPancakeLiquidityInfo(WBNB.address, BUSD[ChainId.MAINNET].address, provider);
  return bnbBusdLp.baseToken.reserve / bnbBusdLp.quoteToken.reserve;
}

export const getTokenPrice = async (tokenAddress, provider) => {
  const bnbPrice = await getBnbPrice(provider);
  if (tokenAddress === WBNB.address) {
    return bnbPrice;
  }
  if (tokenAddress === BUSD[ChainId.MAINNET].address) {
    const tokenBnbLp = await getPancakeLiquidityInfo(tokenAddress, WBNB.address, provider);
    return tokenBnbLp.baseToken.reserve / tokenBnbLp.quoteToken.reserve * bnbPrice;
  }
  const tokenBnbLp = await getPancakeLiquidityInfo(tokenAddress, WBNB.address, provider);
  const tokenBusdLp = await getPancakeLiquidityInfo(tokenAddress, BUSD[ChainId.MAINNET].address, provider);
  if (tokenBnbLp.quoteToken.reserve >= tokenBusdLp.quoteToken.reserve) {
    return tokenBnbLp.baseToken.reserve / tokenBnbLp.quoteToken.reserve * bnbPrice;
  }
  return tokenBusdLp.baseToken.reserve / tokenBusdLp.quoteToken.reserve;  
}