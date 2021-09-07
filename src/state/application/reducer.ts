import { createReducer } from '@reduxjs/toolkit'
import { RouterType } from '@pancakeswap/sdk'
import { 
  updateBlockNumber,
  toggleMenu,
  setRouterType,
  setSwapType,
  setSwapTransCard,
  setLiquidityPairA,
  setLiquidityPairB
} from './actions'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  menuToggled: boolean
  routerType: RouterType
  swapType: string
  swapTransCard: string
  liquidityPairA: string
  liquidityPairB: string
}

const initialState: ApplicationState = {
  blockNumber: {},
  menuToggled: false,
  routerType: RouterType.sphynx,
  swapType: 'swap',
  swapTransCard: 'tokenDX',
  liquidityPairA: null,
  liquidityPairB: null
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
  .addCase(setSwapTransCard, (state, { payload }) => {
    state.swapTransCard = payload
  })
  .addCase(setLiquidityPairA, (state, { payload }) => {
    state.liquidityPairA = payload
  })
  .addCase(setLiquidityPairB, (state, { payload }) => {
    state.liquidityPairB = payload
  })

)
