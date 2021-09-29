import { createReducer } from '@reduxjs/toolkit'
import { removeChartData, addChartData } from './actions'

interface ChartData {
  low: any
  high: any
  open: any
  close: any
  volume: any
  time: any
}

export interface ChartState {
  data: ChartData[]
}

const initialState: ChartState = {
  data: [],
}

export default createReducer<ChartState>(initialState, (builder) =>
  builder
    .addCase(removeChartData, (state) => {
      return initialState
    })
    .addCase(addChartData, (state, { payload: { open, close, low, high, time, volume } }) => {
      const data = state.data
      data.push({ low, high, time, open, close, volume })
      state.data = data
      return state
    }),
)
