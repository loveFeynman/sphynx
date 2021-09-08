import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput, typeRouterVersion } from './actions'


interface InputState {
  input: string
  routerVersion: string
}

const initialState : InputState = {
  input: '0x3b39243e10f451a7acfcf9e02c6a37303b61da46',
  routerVersion: 'v2'
};


export default createReducer<any>(initialState, builder =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { input } }) => {
        // they're typing into the field they've last typed in
        
          return {
            ...state,
            input
          }
        
        // they're typing into a new field, store the other value
        
    })
    .addCase(typeRouterVersion, (state, { payload: { routerVersion } }) => {
        // they're typing into the field they've last typed in
        
          return {
            ...state,
            routerVersion
          }
        
        // they're typing into a new field, store the other value
        
    })
)
