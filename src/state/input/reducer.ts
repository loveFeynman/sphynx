import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput, typeRouterVersion } from './actions'


interface InputState {
  input: string
  routerVersion: string
}

const initialState : InputState = {
  input: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
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
