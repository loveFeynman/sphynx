import { createReducer } from '@reduxjs/toolkit'
import { autoSwap } from './actions'

interface InputState {
  swapFlag: boolean
}

const initialState: InputState = {
  swapFlag: false,
}

export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(autoSwap, (state, { payload: { swapFlag } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        swapFlag,
      }

      // they're typing into a new field, store the other value
    })
)
