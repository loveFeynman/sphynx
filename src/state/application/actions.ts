import { createAction } from '@reduxjs/toolkit'
import { RouterType } from 'hooks/useRouterType'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')

export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const setRouterType = createAction<RouterType>('app/useSetRouterType')
export const setSwapType = createAction<string>('app/setSwapType')

export default updateBlockNumber
