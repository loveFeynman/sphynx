import { createReducer } from '@reduxjs/toolkit'
import { Version } from 'hooks/useToggledVersion'
import { 
  updateBlockNumber,
  toggleMenu,
  setVersion,
  setSwapType
} from './actions'

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
  builder
  .addCase(updateBlockNumber, (state, action) => {
    const { chainId, blockNumber } = action.payload
    if (typeof state.blockNumber[chainId] !== 'number') {
      state.blockNumber[chainId] = blockNumber
    } else {
      state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
    }
  })
  .addCase(toggleMenu, state => {
    state.menuToggled = !state.menuToggled
  })
  .addCase(setVersion, (state, { payload }) => {
    state.versionSet = payload
  })
  .addCase(setSwapType, (state, { payload }) => {
    state.swapType = payload
  })

)
