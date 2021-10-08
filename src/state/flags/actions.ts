import { createAction } from '@reduxjs/toolkit'

export const autoSwap = createAction<{ swapFlag: boolean }>('flags/autoSwap')
