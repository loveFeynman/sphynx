import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput, setIsInput, typeRouterVersion, marketCap } from './actions'

interface InputState {
  input: string
  isInput: boolean
  routerVersion: string
  marketCapacity: number
}

const initialState: InputState = {
  input: '0x2e121ed64eeeb58788ddb204627ccb7c7c59884c',
  isInput: true,
  routerVersion: 'sphynx',
  marketCapacity: 0,
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
    })
    .addCase(marketCap, (state, { payload: { marketCapacity } }) => {
      // they're typing into the field they've last typed in

      return {
        ...state,
        marketCapacity,
      }

      // they're typing into a new field, store the other value
    }),
)
