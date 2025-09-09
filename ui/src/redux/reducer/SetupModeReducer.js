
import { createSlice } from '@reduxjs/toolkit';

const SetupModeReducer = createSlice({
  name: 'setupMode',
  initialState: {
    active: false,
  },
  reducers: {
    enterSetupMode: (state) => {
      state.active = true;
    },
    exitSetupMode: (state) => {
      state.active = false;
    },
  },
});

export const { enterSetupMode, exitSetupMode } = SetupModeReducer.actions;
export default SetupModeReducer.reducer;
