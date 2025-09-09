import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  clientBranchCreateAction,
  clientBranchListAction,
} from "../Action/ClientBranch/ClientBranchAction";

const initialState = {
  clientBranchList: [],
  loading: false,
  error: "",
  totalRecord: 0,
  pageNo: 1,
  limit: 10,
};

const ClientBranchReducer = createSlice({
  name: "clientBranchList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clientBranchListAction.pending, (state, action) => {
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(clientBranchListAction.fulfilled, (state, action) => {
        state.error = "";
        state.loading = false;
        state.clientBranchList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
      })
      .addCase(clientBranchListAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.error = action.error.message;
        state.loading = false;
        state.clientBranchList = [];
        console.log("BranchGetAction Error rejected-->", action.error);
      });
    builder
      .addCase(clientBranchCreateAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(clientBranchCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.error = "";
        state.loading = false;
        if (action.payload?.message) {
          toast.dismiss();
          toast.success(action.payload.message);
        }
      })
      .addCase(clientBranchCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log(
          "Client Branch Create Error:",
          backendError?.validation?.body
        );

        toast.error(validationMessage);
      });
  },
});

export default ClientBranchReducer.reducer;
