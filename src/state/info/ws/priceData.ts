import ethers from 'ethers'
import { PANCAKE_FACTORY_ADDRESS, ChainId } from '@pancakeswap/sdk'
import pancakeFactoryAbi from 'config/abi/pancakeSwapFactory.json'
import pancakeRouterAbi from 'config/abi/pancakeSwapRouter.json'
import pancakeLpAbi from 'config/abi/lpToken.json'
import bscTokenAbi from 'config/abi/erc20.json'
import { ZERO_ADDRESS } from 'config/constants'
import { BUSD, WBNB } from 'config/constants/tokens'

const getMinTokenInfo = async (address, provider) => {
  const tokenContract = new ethers.Contract(
    address,
    bscTokenAbi,
    provider,
  );
  let tokenInfo;
  try {
    const decimals = await tokenContract.decimals()
    tokenInfo = {
      name: await tokenContract.name(),
      symbol: await tokenContract.symbol(),
      decimals: decimals,
      totalSupply: parseInt(ethers.utils.formatUnits(await tokenContract.totalSupply(), decimals))
    }
  } catch (e) {
  } finally {
    return tokenInfo;
  }
}

const getPancakePairAddress = async (quoteToken, baseToken, provider) => {
  const pancakeFactoryContract = new ethers.Contract(
    PANCAKE_FACTORY_ADDRESS,
    pancakeFactoryAbi,
    provider,
  );
  const pairAddress = await pancakeFactoryContract.getPair(quoteToken, baseToken);
  if (pairAddress === ZERO_ADDRESS) {
    throw 'Pair Doesn\'t Exists';
  }
  return pairAddress;
}

const getPancakeLiquidityInfo = async (quoteToken, baseToken, provider) => {
  const lpAddress = await getPancakePairAddress(quoteToken, baseToken, provider);
  const lpContract = new ethers.Contract(
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
    quoteTokenReserve = ethers.utils.formatUnits(reserves[0], quoteTokenInfo.decimals);
    baseTokenReserve = ethers.utils.formatUnits(reserves[1], baseTokenInfo.decimals);
  } else {
    quoteTokenReserve = ethers.utils.formatUnits(reserves[1], quoteTokenInfo.decimals);
    baseTokenReserve = ethers.utils.formatUnits(reserves[0], baseTokenInfo.decimals);
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
  const tokenBnbLp = await getPancakeLiquidityInfo(tokenAddress, WBNB.address, provider);
  const tokenBusdLp = await getPancakeLiquidityInfo(tokenAddress, BUSD[ChainId.MAINNET].address, provider);
  if (tokenBnbLp.quoteToken.reserve >= tokenBusdLp.quoteToken.reserve) {
    const bnbPrice = await getBnbPrice(provider);
    return tokenBnbLp.baseToken.reserve / tokenBnbLp.quoteToken.reserve * bnbPrice;
  } else {
    return tokenBusdLp.baseToken.reserve / tokenBusdLp.quoteToken.reserve;
  }
}

export const getWsProvider = () => {
  return new ethers.providers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443')
}