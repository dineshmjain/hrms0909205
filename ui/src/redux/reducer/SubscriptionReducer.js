import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import { PlansGetActiveListAction } from "../Action/Susbcription/SubscriptionAction";
const initialState = {
    PlanList: [],
};
const SubscriptionReducer = createSlice({
    name: "plans",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(PlansGetActiveListAction.pending, (state, action) => {
                state.error = false;
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(PlansGetActiveListAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload);
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.PlanList = action?.payload.data || []; 
            })
            .addCase(PlansGetActiveListAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                const backendError = action.error?.response?.data || action.payload || action.error;
                state.PlanList = []
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                toast.error(validationMessage);
            })
    }
});

export default SubscriptionReducer.reducer;