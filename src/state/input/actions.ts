import { createAction } from '@reduxjs/toolkit'

export interface Field {
  input : ''
  typeRouterVersion: 'V1'
  type:"INPUT_ADDRESS"
}

export const typeInput = createAction<{ input: string; }>('input/typeInput')
export const typeRouterVersion = createAction<{ routerVersion: string; }>('input/typeRouterVersion')
export const resetMintState = createAction<void>('input/resetState')
