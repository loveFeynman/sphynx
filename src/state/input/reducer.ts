import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput, setIsInput, typeRouterVersion } from './actions'


interface InputState {
  input: string
  isInput: boolean
  routerVersion: string
}

const initialState : InputState = {
  input: '0xafD60977A4d00f596dF68ff2756192545c9b96d2',
  isInput: true,
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
    .addCase(setIsInput, (state, { payload: { isInput } }) => {
      return {
        ...state,
        isInput
      }
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
