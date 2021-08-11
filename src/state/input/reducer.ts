import { createReducer } from '@reduxjs/toolkit'
import { resetMintState, typeInput } from './actions'


interface InputState {
    input: string
  }
  
  const initialState : InputState = {
    input: ''
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
)
