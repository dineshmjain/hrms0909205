import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  SubOrgCreateAction,
  SubOrgEditAction,
  SubOrgListAction,
} from "../Action/SubOrgAction/SubOrgAction";

const initialState = {
  subOrgs: [],
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  totalRecord: 0,
  subOrgsCreate: [],
  limit: 10,
  pageNo: 1,
};

const SubOrgListReducer = createSlice({
  name: "subOrgs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SubOrgListAction.pending, (state, action) => {
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(SubOrgListAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.subOrgs = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        console.log("Sub Org list:", action.payload.data);
        // toast.success(action.payload.message || 'Sub Org data loaded successfully!');
      })
      .addCase(SubOrgListAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        console.log("BranchGetAction Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load Sub Org data. Please try again.');
      });
    //create
    builder
      .addCase(SubOrgCreateAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(SubOrgCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload);

        state.status = "success";
        state.error = "";
        state.loading = false;
        state.subOrgsCreate = action.payload?.data || [];
        state.totalRecord = action.payload?.totalRecord || 0;
        console.log("Sub Org list:", state.subOrgsCreate);
      })

      .addCase(SubOrgCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
console.log("SubOrg Create Error rejected-->", action);
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("SubOrg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    //edit
    builder
      .addCase(SubOrgEditAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(SubOrgEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload);

        state.status = "success";
        state.error = "";
        state.loading = false;
        // toast.success(
        //   action.payload.message || "Sub Org data loaded successfully!"
        // );
        //   state.subOrgsCreate = action.payload?.data || [];
        //   state.totalRecord = action.payload?.totalRecord || 0
        console.log("Sub Org list:", state.subOrgsCreate);
      })

      .addCase(SubOrgEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("SubOrg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
  },
});

export default SubOrgListReducer.reducer;
