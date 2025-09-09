import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  BranchCreateAction,
  BranchEditAction,
  BranchGetAction,
  BranchKycCreateAction,
  BranchKycGetAction,
  BranchRadiusGetAction,
  BranchRadiusUpdateAction,
  BranchStatusUpdateAction,
} from "../Action/Branch/BranchAction";

const initialState = {
  branchList: [],
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  totalRecord: 0,
  pageNo: 1,
  limit: 10,
  branchCreate: {},
  branchkycDetails: {},
};

// A utility function to check if branchList is already populated
const shouldFetchBranches = (state) => {
  // Only fetch if there is no data or the status is not 'success'
  return !state.branchList.length && state.status !== "loading";
};

const BranchListReducer = createSlice({
  name: "BranchList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(BranchGetAction.pending, (state, action) => {
        // Avoid redundant calls by checking the status and existing data
        // if (!shouldFetchBranches(state)) return;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(BranchGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(BranchGetAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.branchList = [];
        console.log("BranchGetAction Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      });
    //branch create
    builder
      .addCase(BranchCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(BranchCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchCreate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Branch", action);
        console.log("Showing toast success:", action.payload.message); // ADD THIS
        if (action.payload?.message) {
          toast.dismiss();
          toast.success(action.payload.message);
        }
      })
      .addCase(BranchCreateAction.rejected, (state, action) => {
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
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });

    //branch edit
    builder
      .addCase(BranchEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(BranchEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchCreate = action.payload;
        console.log("B update:", action);
        toast.success(action.payload.message);
      })
      .addCase(BranchEditAction.rejected, (state, action) => {
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
        console.log("Branch Edit Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    // Branch Status
    builder
      .addCase(BranchStatusUpdateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(BranchStatusUpdateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchCreate = action?.payload?.data || {}; // Ensure this is the correct path to the data
        console.log("Branch", action);
        toast.success(action.payload.message);
      })
      .addCase(BranchStatusUpdateAction.rejected, (state, action) => {
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
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });

    //update/create Branch KYc
    builder
      .addCase(BranchKycCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(BranchKycCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchCreate = action?.payload?.datad || {}; // Ensure this is the correct path to the data
        console.log("Branch", action);
        toast.success(action.payload.message);
      })
      .addCase(BranchKycCreateAction.rejected, (state, action) => {
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
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });

    //get KYc
    builder
      .addCase(BranchKycGetAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(BranchKycGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchkycDetails = action?.payload?.data || {}; // Ensure this is the correct path to the data
        console.log("kyc branch list:", action);
        // toast.success(action.payload.message);
      })
      .addCase(BranchKycGetAction.rejected, (state, action) => {
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
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      })
      //branch radius get
      .addCase(BranchRadiusGetAction.pending, (state, action) => {
        // Avoid redundant calls by checking the status and existing data
        // if (!shouldFetchBranches(state)) return;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(BranchRadiusGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.branchList = action.payload?.data?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.data.totalRecord;
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(BranchRadiusGetAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
        state.branchList = [];
        console.log("BranchGetAction Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      })
      //branch radius update
    builder
    .addCase(BranchRadiusUpdateAction.pending, (state) => {
      state.status = "loading";
      state.error = false;
      state.loading = true;
    })
    .addCase(BranchRadiusUpdateAction.fulfilled, (state, action) => {
      console.log("Full payload:", action?.payload); // Check the structure of the payload
      state.status = "success";
      state.error = "";
      state.loading = false;
      state.branchCreate = action?.payload || {}; // Ensure this is the correct path to the data
      console.log("Branch", action);
      console.log("Showing toast success:", action.payload.message); // ADD THIS
      if (action.payload?.message) {
        toast.dismiss();
        toast.success(action.payload.message);
      }
    })
    .addCase(BranchRadiusUpdateAction.rejected, (state, action) => {
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
      console.log("Branch Create Error:", backendError?.validation?.body);

      toast.error(validationMessage);
    });
  },
});

export default BranchListReducer.reducer;
