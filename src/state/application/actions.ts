import { createAction } from '@reduxjs/toolkit'
import { Version } from 'hooks/useToggledVersion'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')


export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const setVersion = createAction<Version>('app/setVersion')
export const setSwapType = createAction<string>('app/setSwapType')

export default updateBlockNumber
