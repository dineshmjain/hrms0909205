import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { GetCurrentDayAction } from '../Action/Attendence/attendenceAction';
import { getOverAllDashboardAction } from '../Action/Dashboard/Dashboard';

const initialState = {
    // dashboard: {
    //     currentDay: null,

    // },
    // loading: false,
    // error: '',
    dashboard:[]

};


const handleAddData = (data) => {

    let temp = {
        shift: data?.shiftDetails?.[0]?.currentShiftDetails ?? null,
        transactions: data?.attendanceDetails?.data?.[0]?.attendanceLog?.splice(-3) ?? [],
    }

    return { ...temp };
}


const DashboardReducer = createSlice({
    name: 'dasboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetCurrentDayAction.pending, (state) => {
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(GetCurrentDayAction.fulfilled, (state, action) => {
                state.error = '';
                state.loading = false;

                state.dashboard.currentDay = handleAddData(action.payload.data);
            })
            .addCase(GetCurrentDayAction.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
                toast.error(action.error.message || "Error getting shift detials");
            });
//Over All
            builder.addCase(getOverAllDashboardAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(getOverAllDashboardAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.dashboard = action.payload // Ensure correct path to data and handle empty cases
        console.log("Dashboard:", action.payload.data);
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(getOverAllDashboardAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.dataList = [];
        console.log("AssignedModulesAction Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      });
    }
});

export default DashboardReducer.reducer;
