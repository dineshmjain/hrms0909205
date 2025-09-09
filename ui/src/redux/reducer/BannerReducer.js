import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import { BannerGetListAction } from "../Action/Banner/BannerAction";
const initialState = {
    BannerList: [],
    loading: false,
    error: false,
    errorMessage: "",
};
const BannerReducer = createSlice({
    name: "banner",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(BannerGetListAction.pending, (state, action) => {
                state.error = false;
                state.pageNo = action?.meta?.arg?.page || 1
                state.limit = action?.meta?.arg?.limit || 10
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(BannerGetListAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.BannerList = action?.payload.data || []; // Ensure this is the correct path to the data
                // state.totalRecord = action.payload?.data.totalRecord
                // toast.success(action.payload.message);
            })
            .addCase(BannerGetListAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.data.message || 'Something went wrong';
                state.BannerList = []
                state.error = validationMessage;
                toast.error(validationMessage);
            })
    }
});
export default BannerReducer.reducer;