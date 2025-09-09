import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"
import { checkPointCreateAction, checkPointListAction, checkPointupdateAction } from "../Action/Checkpoint/CheckpointAction"

const initialFilter = {
    clientId: "",
}

const initialState = {
    checkpoint: [],
    loading: false,
    error: null,
    filters: { ...initialFilter }, // Initialize filters with initialFilter
    totalRecords: 0,
}

const checkPointReducer = createSlice({
    name: 'checkPoints',
    initialState,
    checkpoints: [],
    extraReducers: (builder) => {
        builder.addCase(checkPointListAction.pending, (state, action) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        })
        builder.addCase(checkPointListAction.fulfilled, (state, action) => {
            state.checkpoint = action?.payload?.data?.data
            state.loading = false;
            state.totalRecords = action?.payload?.data?.totalRecords || 0; // Update total records
        })
        builder.addCase(checkPointListAction.rejected, (state, action) => {
            state.error = action.error?.message; // Store error message
            state.checkpoint = []
            state.loading = false;

            state.totalRecords = 0;
            toast.error(`Error fetching checkPoint: ${state.error}`); // Display error toast
        })
        builder.addCase(checkPointCreateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request   
        })
        builder.addCase(checkPointCreateAction.fulfilled, (state, action) => {
            state.loading = false;
        })
        builder.addCase(checkPointCreateAction.rejected, (state, action) => {
            state.error = action.error?.message; // Store error message
            toast.error(`Error Creating checkpoint: ${state.error}`); // Display error toast
            state.loading = false;
        })
        builder.addCase(checkPointupdateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request   
        })
        builder.addCase(checkPointupdateAction.fulfilled, (state, action) => {
            state.loading = false;
        })
        builder.addCase(checkPointupdateAction.rejected, (state, action) => {
            state.error = action.error?.message; // Store error message
            toast.error(`Error Updating checkpoint: ${state.error}`); // Display error toast
            state.loading = false;
        })
    }
})

export default checkPointReducer.reducer    