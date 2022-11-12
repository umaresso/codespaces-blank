import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BlockchainParamters {
  value: Object,
}

const initialState: BlockchainParamters = {
  value: {},
}

export const blockchainSlice = createSlice({
  name: 'blockchainUpdater',
  initialState,
  reducers: {
    updateBlockchain: (state, value) => {
      state.value = value.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateBlockchain } = blockchainSlice.actions

export default blockchainSlice.reducer