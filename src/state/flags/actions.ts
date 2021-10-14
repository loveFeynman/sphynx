import { createAction } from '@reduxjs/toolkit'

const autoSwap = createAction<{ swapFlag: boolean }>('flags/autoSwap')

export {
    autoSwap
}

export default autoSwap