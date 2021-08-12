import { createAction } from '@reduxjs/toolkit'

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')

import { Version } from 'hooks/useToggledVersion'

export const toggleMenu = createAction<boolean>('app/toggleMenu')
export const setVersion = createAction<Version>('app/setVersion')
export const setSwapType = createAction<string>('app/setSwapType')

export default updateBlockNumber
