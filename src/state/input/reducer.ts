import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput, priceInput, amountInput, setIsInput, typeRouterVersion } from './actions'

interface InputState {
  input: string
  price: number
  amount: number
  isInput: boolean
  routerVersion: string
}

const initialState: InputState = {
  input: '0x2e121ed64eeeb58788ddb204627ccb7c7c59884c',
  price: -1,
  amount: 0,
  isInput: true,
  routerVersion: 'v2',
}

export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { input } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        input,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(priceInput, (state, { payload: { price } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        price,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(amountInput, (state, { payload: { amount } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        amount,
      }

      // they're typing into a new field, store the other value
    })
    .addCase(setIsInput, (state, { payload: { isInput } }) => {
      return {
        ...state,
        isInput,
      }
    })
    .addCase(typeRouterVersion, (state, { payload: { routerVersion } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        routerVersion,
      }

      // they're typing into a new field, store the other value
    }),
)
