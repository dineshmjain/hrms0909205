import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import { LeadCreateAction, LeadGetAction } from "../Action/Leads/LeadAction";


const initialState = {
    lead:{},
    leadList:[],
    loading: false,
    error: false,
    errorMessage: "",

};


const LeadReducer = createSlice({
    name: "lead",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
//lead Create
          builder
            .addCase(LeadCreateAction.pending, (state, action) => {
                state.error = false;
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(LeadCreateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload?.data); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.lead = action?.payload.data || []; // Ensure this is the correct path to the data
                // state.totalRecord = action.payload?.data.totalRecord
                // toast.success(action.payload.message);
            })
            .addCase(LeadCreateAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                 state.leadList = []
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                toast.error(validationMessage);
            })
        

        //lead  Get list----------------------------------------------------------------------
        builder
            .addCase(LeadGetAction.pending, (state, action) => {
                state.error = false;
                state.pageNo = action?.meta?.arg?.page || 1
                state.limit = action?.meta?.arg?.limit || 10
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(LeadGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload?.data); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.leadList = action?.payload.data || []; // Ensure this is the correct path to the data
                state.totalRecord = action.payload?.data.totalRecord
                // toast.success(action.payload.message);
            })
            .addCase(LeadGetAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                 state.leadList = []
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                toast.error(validationMessage);
            })
        }
});
export default LeadReducer.reducer;