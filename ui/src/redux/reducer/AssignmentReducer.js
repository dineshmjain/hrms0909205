import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import { AssignedModulesAction } from "../Action/Assignment/assignmentAction";

const initialState = {
  dataList: [],
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  assigned: {},
};

// A utility function to check if dataList is already populated
const shouldFetchAssignedModules = (state) => {
  // Only fetch if there is no data or the status is not 'success'
  return !state.dataList.length && state.status !== "loading";
};

const AssignedReducer = createSlice({
  name: "dataList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AssignedModulesAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(AssignedModulesAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.dataList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        console.log("Branch list:", action.payload.data);
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(AssignedModulesAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.dataList = [];
        console.log("AssignedModulesAction Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      });
  },
});

export default AssignedReducer.reducer;
