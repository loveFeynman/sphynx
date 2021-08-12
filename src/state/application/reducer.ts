import { createReducer } from '@reduxjs/toolkit'
import { updateBlockNumber } from './actions'
import { Version } from 'hooks/useToggledVersion'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  menuToggled: boolean
  versionSet: Version
  swapType: string
}

const initialState: ApplicationState = {
  blockNumber: {},
  menuToggled: false,
  versionSet: Version.v2,
  swapType: 'swap'
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateBlockNumber, (state, action) => {
    const { chainId, blockNumber } = action.payload
    if (typeof state.blockNumber[chainId] !== 'number') {
      state.blockNumber[chainId] = blockNumber
    } else {
      state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
    }
  }),
)
