import { createAction } from '@reduxjs/toolkit'

export interface Field {
  input : ''
  type:"INPUT_ADDRESS"
}

export const typeInput = createAction<{ input: string; }>('input/typeInput')
export const resetMintState = createAction<void>('input/resetState')
