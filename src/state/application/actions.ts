import { createAction } from '@reduxjs/toolkit'
import { RouterType } from '@pancakeswap/sdk'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')

export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const setRouterType = createAction<RouterType>('app/useSetRouterType')
export const setSwapType = createAction<string>('app/setSwapType')
export const setSwapTransCard = createAction<string>('app/setSwapTransCard')
export const setLiquidityPairA = createAction<string>('app/setLiquidityPairA')
export const setLiquidityPairB = createAction<string>('app/setLiquidityPairB')

export default updateBlockNumber
