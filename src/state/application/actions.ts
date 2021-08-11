import { createAction } from '@reduxjs/toolkit'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')

export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const setSwapType = createAction<string>('app/setSwapType')

export default updateBlockNumber
