import { createAction } from '@reduxjs/toolkit'

export const removeChartData = createAction<void>('charts/remove')
export const addChartData = createAction<{open: any, close: any, low: any, high: any, time: any, volume: any}>('charts/add')
