import { createReducer } from '@reduxjs/toolkit'
import { RouterType } from 'hooks/useRouterType'
import { 
  updateBlockNumber,
  toggleMenu,
  setRouterType,
  setSwapType
} from './actions'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  menuToggled: boolean
  routerType: RouterType
  swapType: string
}

const initialState: ApplicationState = {
  blockNumber: {},
  menuToggled: false,
  routerType: RouterType.sphynx,
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
  .addCase(setRouterType, (state, { payload }) => {
    state.routerType = payload
  })
  .addCase(setSwapType, (state, { payload }) => {
    state.swapType = payload
  })

)
